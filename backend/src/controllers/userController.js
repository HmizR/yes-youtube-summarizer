const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const env = require('../config/env');

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get summary statistics using Sequelize
    const summaryStats = await db.Summary.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['status', 'category'],
      raw: true
    });

    // Get user with summary count
    const user = await db.User.findByPk(userId, {
      include: [{
        model: db.Summary,
        as: 'summaries',
        attributes: []
      }],
      attributes: {
        include: [
          [db.sequelize.fn('COUNT', db.sequelize.col('summaries.id')), 'total_summaries']
        ]
      },
      group: ['User.id'],
      raw: true
    });

    // Calculate monthly usage
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await db.Summary.count({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    // Get recent activity
    const recentActivity = await db.Summary.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'video_title', 'status', 'created_at', 'processing_time']
    });

    // Calculate category distribution
    const categoryStats = {};
    const statusStats = { processing: 0, completed: 0, failed: 0 };
    
    summaryStats.forEach(stat => {
      if (stat.category) {
        categoryStats[stat.category] = (categoryStats[stat.category] || 0) + parseInt(stat.count);
      }
      if (stat.status) {
        statusStats[stat.status] = (statusStats[stat.status] || 0) + parseInt(stat.count);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          summaries_created: user.summaries_created,
          total_time_saved: user.total_time_saved,
          total_words_saved: user.total_words_saved,
          subscription_plan: user.subscription_plan,
          monthly_limit: user.monthly_limit,
          used_this_month: monthlyUsage,
          remaining_this_month: Math.max(0, user.monthly_limit - monthlyUsage)
        },
        statistics: {
          total_summaries: user.total_summaries || 0,
          by_category: categoryStats,
          by_status: statusStats,
          monthly_usage: monthlyUsage
        },
        recent_activity: recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password', 'reset_password_token', 'reset_password_expire'] 
      },
      include: [{
        model: db.ApiKey,
        as: 'api_keys',
        where: { is_active: true },
        required: false
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate monthly usage for the response
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await db.Summary.count({
      where: {
        user_id: req.user.id,
        created_at: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    // Add usage data to the response
    const userData = user.toJSON();
    userData.used_this_month = monthlyUsage;
    userData.remaining_this_month = Math.max(0, user.monthly_limit - monthlyUsage);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { username, email, avatar, preferred_ai_model, default_summary_length, auto_save_transcript } = req.body;
    
    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const whereCondition = {
        id: { [Op.ne]: req.user.id }
      };
      
      if (username) whereCondition.username = username;
      if (email) whereCondition.email = email;
      
      const existingUser = await db.User.findOne({
        where: whereCondition,
        transaction: t
      });
      
      if (existingUser) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: existingUser.username === username ? 
            'Username already exists' : 'Email already exists'
        });
      }
    }

    // Update user
    const [updated] = await db.User.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(preferred_ai_model && { preferred_ai_model }),
      ...(default_summary_length && { default_summary_length }),
      ...(auto_save_transcript !== undefined && { auto_save_transcript })
    }, {
      where: { id: req.user.id },
      transaction: t,
      returning: true,
      individualHooks: true
    });

    if (!updated) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await t.commit();
    
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'New passwords do not match'
      });
    }

    if (newPassword.length < 8) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Get user with password
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'password']
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.User.update(
      { password: hashedPassword },
      {
        where: { id: req.user.id },
        transaction: t,
        individualHooks: true
      }
    );

    await t.commit();

    // Invalidate all sessions (optional - depends on your auth strategy)
    // You could add a version field to the JWT payload and increment it here

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.generateApiKey = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { name = 'Default', rate_limit = 100 } = req.body;
    
    // Generate API key
    const apiKey = jwt.sign(
      { id: req.user.id, type: 'api', timestamp: Date.now() },
      env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Save API key to database
    const apiKeyRecord = await db.ApiKey.create({
      user_id: req.user.id,
      api_key: apiKey,
      name,
      rate_limit,
      usage: [],
      is_active: true
    }, { transaction: t });

    // Also update user's main api_key field (backward compatibility)
    await db.User.update(
      { api_key: apiKey },
      { 
        where: { id: req.user.id },
        transaction: t 
      }
    );

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'API key generated successfully',
      data: {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        api_key: apiKey,
        rate_limit: apiKeyRecord.rate_limit,
        created_at: apiKeyRecord.created_at
      },
      warning: 'Save this API key now. It will not be shown again.'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getApiKeys = async (req, res) => {
  try {
    const apiKeys = await db.ApiKey.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'rate_limit', 'last_used', 'is_active', 'created_at']
    });

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.revokeApiKey = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const [updated] = await db.ApiKey.update(
      { is_active: false },
      {
        where: {
          id,
          user_id: req.user.id
        },
        transaction: t
      }
    );

    if (!updated) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'API key not found'
      });
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateSubscription = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { plan } = req.body;
    
    if (!['free', 'pro', 'business'].includes(plan)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription plan'
      });
    }

    // In a real application, you would:
    // 1. Verify payment
    // 2. Set expiration date
    // 3. Update usage limits
    
    const [updated] = await db.User.update({
      subscription_plan: plan,
      subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      monthly_limit: env.getSubscriptionLimits(plan)
    }, {
      where: { id: req.user.id },
      transaction: t
    });

    if (!updated) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await t.commit();

    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'subscription_plan', 'subscription_expires_at', 'monthly_limit']
    });

    res.status(200).json({
      success: true,
      message: `Subscription updated to ${plan} plan`,
      data: user
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteAccount = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Password confirmation is required'
      });
    }

    // Get user with password
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'password']
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(confirmPassword, user.password);
    if (!isMatch) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        error: 'Password is incorrect'
      });
    }

    // Soft delete: mark as inactive instead of actually deleting
    await db.User.update(
      { 
        is_active: false,
        email: `deleted_${Date.now()}_${user.email}`,
        username: `deleted_${Date.now()}_${user.username}`
      },
      {
        where: { id: req.user.id },
        transaction: t
      }
    );

    // Revoke all API keys
    await db.ApiKey.update(
      { is_active: false },
      {
        where: { user_id: req.user.id },
        transaction: t
      }
    );

    await t.commit();

    // Clear cookie
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUsageAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const userId = req.user.id;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    // Get daily summary counts
    const dailyUsage = await db.Summary.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: [db.sequelize.fn('DATE', db.sequelize.col('created_at'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Get category distribution for the period
    const categoryUsage = await db.Summary.findAll({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    // Get processing time statistics
    const processingStats = await db.Summary.findOne({
      where: {
        user_id: userId,
        created_at: {
          [Op.gte]: startDate
        },
        processing_time: {
          [Op.not]: null
        }
      },
      attributes: [
        [db.sequelize.fn('AVG', db.sequelize.col('processing_time')), 'avg_time'],
        [db.sequelize.fn('MAX', db.sequelize.col('processing_time')), 'max_time'],
        [db.sequelize.fn('MIN', db.sequelize.col('processing_time')), 'min_time']
      ],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        start_date: startDate,
        end_date: new Date(),
        daily_usage: dailyUsage,
        category_distribution: categoryUsage.reduce((acc, curr) => {
          acc[curr.category] = parseInt(curr.count);
          return acc;
        }, {}),
        processing_stats: {
          avg_time: parseFloat(processingStats?.avg_time || 0).toFixed(2),
          max_time: processingStats?.max_time || 0,
          min_time: processingStats?.min_time || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin-only endpoints
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    // Build where clause
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) {
      where.role = role;
    }

    // Build order
    const order = [[sortBy, sortOrder.toUpperCase()]];

    // Execute query
    const { count, rows: users } = await db.User.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      attributes: { 
        exclude: ['password', 'reset_password_token', 'reset_password_expire'] 
      },
      include: [{
        model: db.Summary,
        as: 'summaries',
        attributes: [],
        required: false
      }],
      attributes: {
        include: [
          [db.sequelize.fn('COUNT', db.sequelize.col('summaries.id')), 'total_summaries']
        ]
      },
      group: ['User.id']
    });

    res.status(200).json({
      success: true,
      count: users.length,
      total: count.length, // Sequelize returns count as array when using GROUP BY
      totalPages: Math.ceil(count.length / limit),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateUserRole = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin', 'premium'].includes(role)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const [updated] = await db.User.update(
      { role },
      {
        where: { id: userId },
        transaction: t
      }
    );

    if (!updated) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await t.commit();

    const user = await db.User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'created_at']
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};