const supabaseService = require('../services/supabase');

/**
 * Get all outfits for the authenticated user
 */
const getAllOutfits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseService.outfits.getAll(userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific outfit by ID with full item details
 */
const getOutfitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabaseService.outfits.getById(id);

    if (error) throw error;

    // Verify ownership
    if (data.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this outfit'
        }
      });
    }

    // Fetch clothing items for this outfit
    const itemPromises = data.clothing_item_ids.map(itemId =>
      supabaseService.clothing.getById(itemId)
    );
    const itemResults = await Promise.all(itemPromises);
    const items = itemResults.map(result => result.data).filter(Boolean);

    res.json({ ...data, items });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new outfit
 */
const createOutfit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const outfitData = {
      ...req.body,
      user_id: userId
    };

    const { data, error } = await supabaseService.outfits.create(outfitData);

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an outfit
 */
const updateOutfit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const { data: existing } = await supabaseService.outfits.getById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this outfit'
        }
      });
    }

    const { data, error } = await supabaseService.outfits.update(id, req.body);

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an outfit
 */
const deleteOutfit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const { data: existing } = await supabaseService.outfits.getById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this outfit'
        }
      });
    }

    const { error } = await supabaseService.outfits.delete(id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit
};
