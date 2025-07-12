import React, { useState } from 'react';

const clothingTypes = ['Shirts', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Accessories'];

const EditClothingModal = ({ item, onClose, onSave }) => {
  const [name, setName] = useState(item.alt);
  const [type, setType] = useState(item.type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated = {
      ...item,
      alt: name.trim(),
      type,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Edit Clothing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <img src={item.src} alt="preview" className="w-full h-32 object-contain border" />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Item Name"
          />

          <select
            className="w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {clothingTypes.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>

          <div className="flex justify-between">
            <button
                type="submit"
                className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
              >
                Add
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClothingModal;
