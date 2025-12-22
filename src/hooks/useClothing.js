import { useState, useEffect } from 'react';
import { db } from '../services/supabase';

export const useClothing = (userId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadItems();
    }
  }, [userId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.clothing.getAll(userId);
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      const { data, error } = await db.clothing.create({
        ...item,
        user_id: userId
      });
      if (error) throw error;
      setItems((prev) => [data[0], ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const { data, error } = await db.clothing.update(id, updates);
      if (error) throw error;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? data[0] : item))
      );
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await db.clothing.delete(id);
      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refresh: loadItems
  };
};
