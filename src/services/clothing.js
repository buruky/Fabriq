// Clothing items service
// This wraps database operations for clothing items
import { db } from './supabase';

export const clothingService = {
  // Get all clothing items for a user
  async getAllItems(userId) {
    try {
      const { data, error } = await db.clothing.getAll(userId);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  },

  // Get a specific clothing item by ID
  async getItemById(itemId) {
    try {
      const { data, error } = await db.clothing.getById(itemId);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Create a new clothing item
  async createItem(item) {
    try {
      const { data, error } = await db.clothing.create(item);
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update an existing clothing item
  async updateItem(itemId, updates) {
    try {
      const { data, error } = await db.clothing.update(itemId, updates);
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete a clothing item
  async deleteItem(itemId) {
    try {
      const { error } = await db.clothing.delete(itemId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Filter items by category
  filterByCategory(items, category) {
    if (!category || category === 'all') return items;
    return items.filter(item => item.category === category);
  },

  // Search items by name
  searchByName(items, searchTerm) {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }
};
