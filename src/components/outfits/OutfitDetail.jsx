import React, { useState, useEffect } from 'react';
import { db } from '../../services/supabase';

const OutfitDetail = ({ outfitId }) => {
  const [outfit, setOutfit] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOutfit();
  }, [outfitId]);

  const loadOutfit = async () => {
    try {
      const { data, error } = await db.outfits.getById(outfitId);
      if (error) throw error;
      setOutfit(data);
      // TODO: Load clothing items based on clothing_item_ids
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!outfit) return <div>Outfit not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{outfit.name}</h2>
        {outfit.notes && <p className="text-gray-600 mt-2">{outfit.notes}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={item.image_url} alt={item.name} className="w-full aspect-square object-cover" />
            <div className="p-2">
              <p className="text-sm font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitDetail;
