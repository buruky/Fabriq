import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OutfitCreator from '../components/outfits/OutfitCreator';
import { getWardrobe } from '../util/storage';
import { useAuth } from '../hooks/useAuth';

const OutfitCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadClothingItems();
    }
  }, [user]);

  const loadClothingItems = async () => {
    try {
      const items = await getWardrobe(user.id);
      setClothingItems(items || []);
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
          userId={user?.id}
          clothingItems={clothingItems}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default OutfitCreate;
