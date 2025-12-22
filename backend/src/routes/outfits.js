const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfitController');
const authMiddleware = require('../middleware/auth');

// All outfit routes require authentication
router.use(authMiddleware);

/**
 * GET /api/outfits
 * Get all outfits for the authenticated user
 */
router.get('/', outfitController.getAllOutfits);

/**
 * GET /api/outfits/:id
 * Get a specific outfit by ID with full item details
 */
router.get('/:id', outfitController.getOutfitById);

/**
 * POST /api/outfits
 * Create a new outfit
 */
router.post('/', outfitController.createOutfit);

/**
 * PUT /api/outfits/:id
 * Update an outfit
 */
router.put('/:id', outfitController.updateOutfit);

/**
 * DELETE /api/outfits/:id
 * Delete an outfit
 */
router.delete('/:id', outfitController.deleteOutfit);

module.exports = router;
