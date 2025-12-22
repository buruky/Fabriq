/**
 * Validation middleware functions
 */

/**
 * Validate clothing item data
 */
const validateClothingItem = (req, res, next) => {
  const { name, category, image_url } = req.body;

  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Item name is required');
  }

  if (!category || category.trim() === '') {
    errors.push('Category is required');
  }

  const validCategories = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'];
  if (category && !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (!image_url || image_url.trim() === '') {
    errors.push('Image URL is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  next();
};

/**
 * Validate outfit data
 */
const validateOutfit = (req, res, next) => {
  const { name, clothing_item_ids } = req.body;

  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Outfit name is required');
  }

  if (!clothing_item_ids || !Array.isArray(clothing_item_ids)) {
    errors.push('Clothing items must be an array');
  }

  if (clothing_item_ids && clothing_item_ids.length === 0) {
    errors.push('Outfit must contain at least one item');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  next();
};

/**
 * Validate profile update data
 */
const validateProfileUpdate = (req, res, next) => {
  const { username, display_name } = req.body;

  const errors = [];

  if (username !== undefined && username.trim() === '') {
    errors.push('Username cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors
      }
    });
  }

  next();
};

module.exports = {
  validateClothingItem,
  validateOutfit,
  validateProfileUpdate
};
