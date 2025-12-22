import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OutfitCreator from '../components/outfits/OutfitCreator';
import { db } from '../services/supabase';

const OutfitCreate = () => {
  const navigate = useNavigate();
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClothingItems();
  }, []);

  const loadClothingItems = async () => {
    try {
      // TODO: Get current user ID
      const userId = '';
      const { data, error } = await db.clothing.getAll(userId);
      if (error) throw error;
      setClothingItems(data || []);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (outfit) => {
    navigate('/outfits');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Outfit</h1>

      {loading ? (
        <div className="text-center py-12">Loading your wardrobe...</div>
      ) : clothingItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You need to add clothing items first!</p>
          <button
            onClick={() => navigate('/wardrobe/add')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Add Items
          </button>
        </div>
      ) : (
        <OutfitCreator
          userId="" // TODO: Get current user ID
          clothingItems={clothingItems}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default OutfitCreate;
