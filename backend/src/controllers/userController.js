const supabaseService = require('../services/supabase');

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseService.profile.get(userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseService.profile.update(userId, req.body);

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user wardrobe statistics
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all clothing items
    const { data: items } = await supabaseService.clothing.getAll(userId);

    // Get all outfits
    const { data: outfits } = await supabaseService.outfits.getAll(userId);

    // Calculate stats
    const itemsByCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalItems: items.length,
      totalOutfits: outfits.length,
      itemsByCategory
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats
};
