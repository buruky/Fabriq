import React, { useState } from 'react';
import { db } from '../../services/supabase';
import Modal from '../shared/Modal';

const EditItemModal = ({ item, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(item);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await db.clothing.update(item.id, formData);
      if (error) throw error;
      onUpdate && onUpdate(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await db.clothing.delete(item.id);
      if (error) throw error;
      onClose();
      onUpdate && onUpdate(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TODO: Add form fields */}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItemModal;
