// Outfits service
// This wraps database operations for outfits
import { db } from './supabase';

export const outfitsService = {
  // Get all outfits for a user
  async getAllOutfits(userId) {
    try {
      const { data, error } = await db.outfits.getAll(userId);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  },

  // Get a specific outfit by ID
  async getOutfitById(outfitId) {
    try {
      const { data, error } = await db.outfits.getById(outfitId);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get outfit with full clothing item details
  async getOutfitWithItems(outfitId) {
    try {
      // Get the outfit first
      const { data: outfit, error: outfitError } = await db.outfits.getById(outfitId);
      if (outfitError) throw outfitError;

      // Fetch all clothing items for this outfit
      const itemPromises = outfit.clothing_item_ids.map(id =>
        db.clothing.getById(id)
      );
      const itemResults = await Promise.all(itemPromises);
      const items = itemResults
        .map(result => result.data)
        .filter(Boolean);

      return {
        data: { ...outfit, items },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Create a new outfit
  async createOutfit(outfit) {
    try {
      const { data, error } = await db.outfits.create(outfit);
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update an existing outfit
  async updateOutfit(outfitId, updates) {
    try {
      const { data, error } = await db.outfits.update(outfitId, updates);
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete an outfit
  async deleteOutfit(outfitId) {
    try {
      const { error } = await db.outfits.delete(outfitId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  }
};
