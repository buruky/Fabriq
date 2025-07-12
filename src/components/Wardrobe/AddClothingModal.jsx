import React, { useState } from 'react';

const clothingTypes = ['Shirts', 'Jackets', 'Pants', 'Shorts', 'Shoes', 'Accessories'];

const AddClothingModal = ({ onClose, onAdd }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState(clothingTypes[0]);
  const [name, setName] = useState(''); // NEW

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Base64 string
      };
      reader.readAsDataURL(uploaded);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !type || !name.trim()) return;

    const newItem = {
      src: file,
      alt: name.trim(), // ← set alt as user input
      type,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Add Clothing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="image/*" onChange={handleFileChange} required />

          {file && (
            <img
              src={file}
              alt="preview"
              className="w-full h-32 object-contain border rounded"
            />
          )}

          {/* New Input: Item Name */}
          <input
            type="text"
            placeholder="Item name (e.g. Red Hoodie)"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Clothing Type Selector */}
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

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClothingModal;

