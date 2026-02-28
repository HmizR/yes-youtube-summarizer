const db = require('../models');
const SummaryService = require('../services/summaryService');

exports.createSummary = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { videoUrl, options = {} } = req.body;
    const user = req.user;

    console.log(options);

    // Check if user can create more summaries
    if (!user.canCreateSummary()) {
      await t.rollback();
      return res.status(429).json({
        success: false,
        error: 'Monthly limit reached. Please upgrade your plan.'
      });
    }

    // Check if summary already exists
    const videoId = SummaryService.youtube.extractVideoId(videoUrl);
    const existing = await db.Summary.findOne({
      where: { video_id: videoId, user_id: user.id },
      transaction: t
    });
    
    let summary;
    console.log('Passed existing summary check');
    if (existing) {
      if (existing.status === 'failed') {
        summary = await existing.update({
          status: 'processing'
        }, { transaction: t });
      } else if (existing.status === 'processing') {
        if (req.io) {
          req.io.to(user.id).emit('summary-already-processing', {
            summaryId: existing.id,
            videoTitle: existing.video_title
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Summary already processing',
          data: existing
        });
      } else {
        if (req.io) {
          req.io.to(user.id).emit('summary-exists', {
            summaryId: existing.id,
            videoTitle: existing.video_title
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Summary already exists',
          data: existing
        });
      }
    } else {
      summary = await db.Summary.create({
        user_id: user.id,
        video_id: videoId,
        status: 'processing'
      }, { transaction: t });
    }
    // if (existing) {
    //   await t.rollback();
    //   return res.status(200).json({
    //     success: true,
    //     message: 'Summary already exists',
    //     data: existing
    //   });
    // }

    // // Create initial summary record
    // const summary = await db.Summary.create({
    //   user_id: user.id,
    //   video_id: videoId,
    //   status: 'processing'
    // }, { transaction: t });
    
    // Commit transaction for immediate response
    await t.commit();
    console.log('Passed summary record creation');

    // Send immediate response
    res.status(202).json({
      success: true,
      message: 'Summary processing started',
      data: { summaryId: summary.id }
    });
    console.log('Sent immediate response, starting background processing');

    // Process summary in background
    try {
      const summaryData = await SummaryService.createSummary(videoUrl, options, user);
      console.log('Summary generated for video ID:', videoId);
      
      // Update summary record in new transaction
      const t2 = await db.sequelize.transaction();
      try {
        await db.Summary.update({
          ...summaryData,
          status: 'completed'
        }, {
          where: { id: summary.id },
          transaction: t2
        });

        // Update user stats
        const timeSavedMinutes = Math.round(
          SummaryService.parseDuration(summaryData.duration) * 
          (summaryData.reduction_percentage / 100) / 60
        );

        await db.User.increment({
          summaries_created: 1,
          total_time_saved: timeSavedMinutes,
          total_words_saved: summaryData.original_word_count - summaryData.summary_word_count,
          used_this_month: 1
        }, {
          where: { id: user.id },
          transaction: t2
        });

        await t2.commit();

        // Emit WebSocket event if needed
        if (req.io) {
          req.io.to(user.id).emit('summary-completed', {
            summaryId: summary.id,
            videoTitle: summaryData.video_title
          });
        }
      } catch (error) {
        await t2.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Background processing failed:', error);
      
      // Update status to failed
      await db.Summary.update(
        { status: 'failed' },
        { where: { id: summary.id } }
      );
      
      if (req.io) {
        req.io.to(user.id).emit('summary-failed', {
          summaryId: summary.id,
          error: error.message
        });
      }
      throw error; // Optional: re-throw if you want to log it further up
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSummaries = async (req, res) => {
  try {
    const user = req.user;
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      status,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const where = { user_id: user.id };

    if (search) {
      where[db.Sequelize.Op.or] = [
        { video_title: { [db.Sequelize.Op.like]: `%${search}%` } },
        { channel_name: { [db.Sequelize.Op.like]: `%${search}%` } },
        db.Sequelize.literal(`JSON_CONTAINS(tags, '"${search}"')`)
      ];
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const order = [[sortBy, sortOrder.toUpperCase()]];

    /** MAIN DATA */
    const { count, rows: summaries } = await db.Summary.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    /** EXTRA STATS */
    const stats = await db.Summary.findOne({
      where: { user_id: user.id },
      attributes: [
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'totalSummaries'],
        [db.Sequelize.fn('AVG', db.Sequelize.col('reduction_percentage')), 'avgReduction'],
        [
          db.Sequelize.fn(
            'SUM',
            db.Sequelize.literal(`CASE WHEN status = 'processing' THEN 1 ELSE 0 END`)
          ),
          'processingCount'
        ]
      ],
      raw: true
    });

    res.status(200).json({
      success: true,
      count: summaries.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      stats: {
        totalSummaries: Number(stats.totalSummaries),
        avgReduction: Number(stats.avgReduction || 0).toFixed(2),
        processing: Number(stats.processingCount)
      },
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.getSummary = async (req, res) => {
  try {
    const summary = await db.Summary.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }]
    });

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    // Increment download count
    if (!req.headers['x-api-key']) {
      await summary.increment('download_count');
    }

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateSummary = async (req, res) => {
  try {
    const { title, tags, category, isPublic, isBookmarked } = req.body;
    
    const [updated] = await db.Summary.update({
      ...(title && { video_title: title }),
      ...(tags && { tags: Array.isArray(tags) ? tags : JSON.parse(tags) }),
      ...(category && { category }),
      ...(isPublic !== undefined && { is_public: isPublic }),
      ...(isBookmarked !== undefined && { is_bookmarked: isBookmarked })
    }, {
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      returning: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    const summary = await db.Summary.findByPk(req.params.id);
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
    throw error;
  }
};

exports.deleteSummary = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const deleted = await db.Summary.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      transaction: t
    });

    if (!deleted) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    // Update user stats
    await db.User.decrement('summaries_created', {
      by: 1,
      where: { id: req.user.id },
      transaction: t
    });

    await t.commit();
    
    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Export functionality remains similar but uses MySQL JSON functions
exports.exportSummary = async (req, res) => {
  try {
    const summary = await db.Summary.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    const format = req.params.format || 'json';
    
    switch (format) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="summary-${summary.video_id}.json"`);
        res.send(JSON.stringify(summary, null, 2));
        break;
        
      case 'txt':
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="summary-${summary.video_id}.txt"`);
        
        // Handle JSON fields in MySQL
        const keyPoints = Array.isArray(summary.key_points) 
          ? summary.key_points 
          : JSON.parse(summary.key_points || '[]');
        
        const transcript = Array.isArray(summary.transcript)
          ? summary.transcript
          : JSON.parse(summary.transcript || '[]');
        
        const text = `
${summary.video_title}
Channel: ${summary.channel_name}
Duration: ${summary.duration}
Created: ${summary.created_at}

SUMMARY:
${summary.summary}

KEY POINTS:
${keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

TRANSCRIPT:
${transcript.map(t => `[${t.timestamp}] ${t.text}`).join('\n')}
        `.trim();
        
        res.send(text);
        break;
        
      default:
        res.status(400).json({
          success: false,
          error: 'Unsupported export format'
        });
    }

    // Update download count
    await summary.increment('download_count');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get public summaries with pagination
exports.getPublicSummaries = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const { count, rows: summaries } = await db.Summary.findAndCountAll({
      where: { is_public: true },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      attributes: { exclude: ['transcript', 'summary'] }
    });

    res.status(200).json({
      success: true,
      count: summaries.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};