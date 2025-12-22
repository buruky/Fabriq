const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', userController.getProfile);

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', userController.updateProfile);

/**
 * GET /api/user/stats
 * Get user wardrobe statistics
 */
router.get('/stats', userController.getStats);

module.exports = router;
