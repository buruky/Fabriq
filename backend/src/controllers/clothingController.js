const supabaseService = require('../services/supabase');

/**
 * Get all clothing items for the authenticated user
 */
const getAllItems = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseService.clothing.getAll(userId);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific clothing item by ID
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabaseService.clothing.getById(id);

    if (error) throw error;

    // Verify ownership
    if (data.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this item'
        }
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new clothing item
 */
const createItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemData = {
      ...req.body,
      user_id: userId
    };

    const { data, error } = await supabaseService.clothing.create(itemData);

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a clothing item
 */
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const { data: existing } = await supabaseService.clothing.getById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to update this item'
        }
      });
    }

    const { data, error } = await supabaseService.clothing.update(id, req.body);

    if (error) throw error;

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a clothing item
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership first
    const { data: existing } = await supabaseService.clothing.getById(id);
    if (existing.user_id !== userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this item'
        }
      });
    }

    const { error } = await supabaseService.clothing.delete(id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
