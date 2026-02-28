const express = require('express');
const router = express.Router();
const {
  getUserStats,
  getUserProfile,
  updateProfile,
  changePassword,
  generateApiKey,
  getApiKeys,
  revokeApiKey,
  updateSubscription,
  deleteAccount,
  getUsageAnalytics,
  getAllUsers,
  updateUserRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.get('/stats', protect, getUserStats);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/api-keys', protect, generateApiKey);
router.get('/api-keys', protect, getApiKeys);
router.put('/api-keys/:id/revoke', protect, revokeApiKey);
router.put('/subscription', protect, updateSubscription);
router.delete('/account', protect, deleteAccount);
router.get('/analytics', protect, getUsageAnalytics);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:userId/role', protect, authorize('admin'), updateUserRole);

module.exports = router;