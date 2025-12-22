const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingController');
const authMiddleware = require('../middleware/auth');

// All clothing routes require authentication
router.use(authMiddleware);

/**
 * GET /api/clothing
 * Get all clothing items for the authenticated user
 */
router.get('/', clothingController.getAllItems);

/**
 * GET /api/clothing/:id
 * Get a specific clothing item by ID
 */
router.get('/:id', clothingController.getItemById);

/**
 * POST /api/clothing
 * Create a new clothing item
 */
router.post('/', clothingController.createItem);

/**
 * PUT /api/clothing/:id
 * Update a clothing item
 */
router.put('/:id', clothingController.updateItem);

/**
 * DELETE /api/clothing/:id
 * Delete a clothing item
 */
router.delete('/:id', clothingController.deleteItem);

module.exports = router;
