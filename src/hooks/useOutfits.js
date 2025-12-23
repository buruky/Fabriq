import { useState, useEffect } from 'react';
import { db } from '../services/supabase';

export const useOutfits = (userId) => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadOutfits();
    }
  }, [userId]);

  const loadOutfits = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.outfits.getAll(userId);
      if (error) throw error;
      setOutfits(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addOutfit = async (outfit) => {
    try {
      const { data, error } = await db.outfits.create({
        ...outfit,
        user_id: userId
      });
      if (error) throw error;
      setOutfits((prev) => [data[0], ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateOutfit = async (id, updates) => {
    try {
      const { data, error } = await db.outfits.update(id, updates);
      if (error) throw error;
      setOutfits((prev) =>
        prev.map((outfit) => (outfit.id === id ? data[0] : outfit))
      );
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteOutfit = async (id) => {
    try {
      const { error } = await db.outfits.delete(id);
      if (error) throw error;
      setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  const getOutfitWithItems = async (outfitId) => {
    try {
      const { data: outfit, error: outfitError } = await db.outfits.getById(outfitId);
      if (outfitError) throw outfitError;

      // Fetch all clothing items for this outfit
      const itemPromises = outfit.clothing_item_ids.map(id =>
        db.clothing.getById(id)
      );
      const itemResults = await Promise.all(itemPromises);

      // Transform database format to frontend format
      const items = itemResults
        .map(result => result.data)
        .filter(Boolean)
        .map(item => ({
          id: item.id,
          src: item.image_url || item.src,
          alt: item.name || item.alt,
          type: item.category || item.type
        }));

      return { outfit: { ...outfit, items }, error: null };
    } catch (err) {
      return { outfit: null, error: err.message };
    }
  };

  return {
    outfits,
    loading,
    error,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    getOutfitWithItems,
    refresh: loadOutfits
  };
};
