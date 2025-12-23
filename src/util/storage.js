// src/util/storage.js
// Updated to use Supabase database instead of IndexedDB

import { db } from '../services/supabase';

/**
 * Get all wardrobe items for a user
 * @param {string} userId - The user's ID from Supabase auth
 * @returns {Promise<Array>} Array of wardrobe items
 */
export const getWardrobe = async (userId) => {
  if (!userId) {
    console.warn('No user ID provided to getWardrobe');
    return [];
  }

  try {
    const { data, error } = await db.clothing.getAll(userId);

    if (error) {
      console.error('Error fetching wardrobe:', error);
      return [];
    }

    // Transform database format to match the frontend format
    return (data || []).map(item => ({
      id: item.id,
      src: item.image_url,
      alt: item.name,
      type: item.category
    }));
  } catch (error) {
    console.error('Unexpected error in getWardrobe:', error);
    return [];
  }
};

/**
 * Add a new item to the wardrobe
 * @param {string} userId - The user's ID from Supabase auth
 * @param {Object} newItem - Item with src (image_url), alt (name), and type (category)
 * @returns {Promise<Object>} The created item
 */
export const addToWardrobe = async (userId, newItem) => {
  if (!userId) {
    throw new Error('User ID is required to add wardrobe item');
  }

  // Transform frontend format to database format
  const itemToSave = {
    user_id: userId,
    name: newItem.alt,
    category: newItem.type,
    image_url: newItem.src
  };

  try {
    const { data, error } = await db.clothing.create(itemToSave);

    if (error) {
      console.error('Error adding to wardrobe:', error);
      throw new Error(error.message || 'Failed to add item to wardrobe');
    }

    // Return in frontend format
    return {
      id: data[0].id,
      src: data[0].image_url,
      alt: data[0].name,
      type: data[0].category
    };
  } catch (error) {
    console.error('Unexpected error in addToWardrobe:', error);
    throw error;
  }
};

/**
 * Update an existing wardrobe item
 * @param {string} userId - The user's ID (not used but kept for consistency)
 * @param {string} itemId - The item's database ID
 * @param {Object} updatedItem - Updated item data
 * @returns {Promise<Object>} The updated item
 */
export const updateItemInWardrobe = async (userId, itemId, updatedItem) => {
  if (!itemId) {
    throw new Error('Item ID is required to update wardrobe item');
  }

  // Transform frontend format to database format
  const updates = {
    name: updatedItem.alt,
    category: updatedItem.type,
    image_url: updatedItem.src
  };

  try {
    const { data, error } = await db.clothing.update(itemId, updates);

    if (error) {
      console.error('Error updating wardrobe item:', error);
      throw new Error(error.message || 'Failed to update item');
    }

    // Return in frontend format
    return {
      id: data[0].id,
      src: data[0].image_url,
      alt: data[0].name,
      type: data[0].category
    };
  } catch (error) {
    console.error('Unexpected error in updateItemInWardrobe:', error);
    throw error;
  }
};

/**
 * Delete a wardrobe item
 * @param {string} userId - The user's ID (not used but kept for consistency)
 * @param {string} itemId - The item's database ID
 * @returns {Promise<void>}
 */
export const deleteItemFromWardrobe = async (userId, itemId) => {
  if (!itemId) {
    throw new Error('Item ID is required to delete wardrobe item');
  }

  try {
    const { error } = await db.clothing.delete(itemId);

    if (error) {
      console.error('Error deleting wardrobe item:', error);
      throw new Error(error.message || 'Failed to delete item');
    }
  } catch (error) {
    console.error('Unexpected error in deleteItemFromWardrobe:', error);
    throw error;
  }
};

/**
 * @deprecated This function is deprecated. Data is now stored in Supabase database.
 */
export const setWardrobe = async (username, fullList) => {
  console.warn('setWardrobe is deprecated - data is now stored in Supabase database');
};

