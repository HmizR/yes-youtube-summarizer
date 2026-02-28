const express = require('express');
const router = express.Router();
const {
  createSummary,
  getSummaries,
  getSummary,
  updateSummary,
  deleteSummary,
  exportSummary,
  getPublicSummaries
} = require('../controllers/summaryController');
const { protect, apiKeyAuth } = require('../middleware/auth');
const { summaryLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/public', getPublicSummaries);

// Protected routes
router.post('/', protect, summaryLimiter, createSummary);
router.get('/', protect, getSummaries);
router.get('/:id', protect, getSummary);
router.put('/:id', protect, updateSummary);
router.delete('/:id', protect, deleteSummary);
router.get('/:id/export/:format', protect, exportSummary);

// API routes (for programmatic access)
router.post('/api/summarize', apiKeyAuth, summaryLimiter, createSummary);
router.get('/api/summaries', apiKeyAuth, getSummaries);
router.get('/api/summaries/:id', apiKeyAuth, getSummary);

module.exports = router;