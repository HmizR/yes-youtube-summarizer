const db = require('../models');
const ollamaService = require('../services/ollamaService');

// GET /api/v1/ollama/models - Get available Ollama models
exports.getAvailableModels = async (req, res) => {
  try {
    const models = await ollamaService.getAvailableModels();
    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET /api/v1/summaries/:summaryId/discussions
// Get all discussions for a summary
exports.getDiscussionsBySummary = async (req, res) => {
  try {
    const discussions = await db.DiscussionThread.findAll({
      where: { 
        summary_id: req.params.summaryId,
        is_active: true 
      },
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['updated_at', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: discussions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/discussions/:threadId/messages
// Get all messages for a discussion thread
exports.getThreadMessages = async (req, res) => {
  try {
    const messages = await db.DiscussionMessage.findAll({
      where: { thread_id: req.params.threadId },
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['created_at', 'ASC']],
      limit: 50 // paginate if needed
    });
    
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// POST /api/v1/summaries/:summaryId/discussions/start - Start new discussion
exports.startDiscussion = async (req, res) => {
  try {
    const { summaryId } = req.params;
    const { model = 'llama2' } = req.body;
    
    // Check if summary exists
    const summary = await db.Summary.findByPk(summaryId);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    // Create discussion thread
    const thread = await db.DiscussionThread.create({
      summary_id: summaryId,
      user_id: req.user.id,
      title: `Discussion: ${summary.video_title}`,
      model_used: model
    });

    res.status(201).json({
      success: true,
      data: thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET /api/v1/summaries/:summaryId/suggested-questions
exports.getSuggestedQuestions = async (req, res) => {
  try {
    const { summaryId } = req.params;
    
    // If key_points and transcript are attributes, just fetch the summary
    const summary = await db.Summary.findByPk(summaryId);

    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    // Generate questions using Ollama
    const questions = await ollamaService.generateQuestions(summary, 5);

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error getting suggested questions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// controllers/discussionController.js (updated sendMessage)
exports.sendMessage = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content, model, stream = false } = req.body;

    // Get thread with summary
    const thread = await db.DiscussionThread.findByPk(threadId, {
      include: [{
        model: db.Summary,
        as: 'summary',
        // include: ['transcript', 'key_points']
      }]
    });

    console.log('Thread fetched:', thread.summary);

    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Discussion thread not found'
      });
    }

    // Save user message
    const userMessage = await db.DiscussionMessage.create({
      thread_id: threadId,
      user_id: req.user.id,
      role: 'user',
      content: content
    });

    // Get previous messages for context
    const previousMessages = await db.DiscussionMessage.findAll({
      where: { thread_id: threadId },
      order: [['created_at', 'ASC']],
      limit: 15
    });

    // Generate AI response
    const aiResponse = await ollamaService.generateResponse({
      model: 'gemma-2-2b-it',
      summary: thread.summary,
      conversation: previousMessages,
      userMessage: content
    });

    // Save AI response
    const aiMessage = await db.DiscussionMessage.create({
      thread_id: threadId,
      role: 'assistant',
      content: aiResponse.content,
      model_used: aiResponse.model,
      token_count: aiResponse.tokenCount,
      metadata: {
        total_duration: aiResponse.totalDuration,
        load_duration: aiResponse.loadDuration,
        prompt_tokens: aiResponse.promptTokens
      }
    });

    // Update thread stats
    await thread.update({
      message_count: thread.message_count + 2,
      last_message_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        metadata: {
          model: aiResponse.model,
          tokens: aiResponse.tokenCount,
          promptTokens: aiResponse.promptTokens,
          duration: aiResponse.totalDuration,
          loadDuration: aiResponse.loadDuration
        }
      }
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};