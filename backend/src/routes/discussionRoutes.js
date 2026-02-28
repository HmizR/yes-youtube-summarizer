// routes/discussionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const discussionController = require('../controllers/discussionController');

// Ollama models
router.get('/ollama/models', protect, discussionController.getAvailableModels);
// Discussions
router.post('/summaries/:summaryId/discussions/start', protect, discussionController.startDiscussion);
router.get('/summaries/:summaryId/discussions', protect, discussionController.getDiscussionsBySummary);
router.get('/discussions/:threadId/messages', protect, discussionController.getThreadMessages);
router.post('/discussions/:threadId/messages', protect, discussionController.sendMessage);

// Suggested questions
router.get('/summaries/:summaryId/suggested-questions', protect, discussionController.getSuggestedQuestions);

module.exports = router;