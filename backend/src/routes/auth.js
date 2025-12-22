const express = require('express');
const router = express.Router();

// Auth routes are typically handled by Supabase
// These are placeholders if you want to add custom auth logic

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res, next) => {
  try {
    // Custom signup logic here if needed
    // Otherwise, handle on frontend with Supabase directly
    res.status(501).json({ message: 'Use Supabase Auth on frontend' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res, next) => {
  try {
    // Custom login logic here if needed
    res.status(501).json({ message: 'Use Supabase Auth on frontend' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', async (req, res, next) => {
  try {
    // Custom logout logic here if needed
    res.status(501).json({ message: 'Use Supabase Auth on frontend' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/user
 * Get current user info
 */
router.get('/user', async (req, res, next) => {
  try {
    // Custom user info logic here if needed
    res.status(501).json({ message: 'Use Supabase Auth on frontend' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
