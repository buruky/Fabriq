import React, { useState } from 'react';
import { db } from '../../services/supabase';
import { CATEGORIES } from '../../utils/constants';

const AddItemForm = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    colors: [],
    brand: '',
    description: '',
    season: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Upload image to Cloudinary
      const imageUrl = ''; // Replace with actual image URL

      const { data, error } = await db.clothing.create({
        user_id: userId,
        ...formData,
        image_url: imageUrl
      });

      if (error) throw error;
      onSuccess && onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select category</option>
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* TODO: Add more fields */}

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddItemForm;
