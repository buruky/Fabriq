// src/pages/Wardrobe.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import AddClothingModal from '../components/Wardrobe/AddClothingModal';
import EditClothingModal from '../components/Wardrobe/EditClothingModal';

import {
  getWardrobe,
  addToWardrobe,
  deleteItemFromWardrobe,
  updateItemInWardrobe,
} from '../util/storage';








const preferredOrder = [
  'Jackets','Shirts',  'Pants', 'Shorts', 'Shoes', 'Accessories', 'Other',
];

const Wardrobe = () => {
  /* ----------------------  STATE & CONTEXT  ---------------------- */
  const { currentUser = 'guest' } = useContext(UserContext);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [wardrobe,     setWardrobe]     = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [showModal,    setShowModal]    = useState(false);

  /* ---------------------  INITIAL LOAD / SYNC  -------------------- */
  useEffect(() => {
   getWardrobe(currentUser).then(setWardrobe);
  }, [currentUser]);


  /* ----------------------  ADD NEW CLOTHING  ---------------------- */
  const handleAddClothing = async (item) => {
    await addToWardrobe(currentUser, item);
    setWardrobe((prev) => [...prev, item]);
  };
  const handleDelete = async (index) => {
    await deleteItemFromWardrobe(currentUser, index);
    setWardrobe((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
  setItemToEdit({ ...wardrobe[index], index }); // include index for saving
  };
  const handleSaveEdit = async (updatedItem) => {
    const index = updatedItem.index;
    const itemWithoutIndex = { ...updatedItem };
    delete itemWithoutIndex.index;

    await updateItemInWardrobe(currentUser, index, itemWithoutIndex);
    setWardrobe((prev) =>
      prev.map((item, i) => (i === index ? itemWithoutIndex : item))
    );
  };



  /* ----------------------  GROUP & FILTERING  ---------------------- */
  const grouped = wardrobe.reduce((acc, item) => {
    const type = item.type || 'Other';
    (acc[type] ||= []).push(item);      // Node 16+ nullish-assignment
    return acc;
  }, {});

  const allTypes       = ['All', ...Object.keys(grouped)];
  const filteredGroups = selectedType === 'All'
    ? grouped
    : { [selectedType]: grouped[selectedType] || [] };

  /* ----------------------------  JSX  ----------------------------- */
  return (
    <>
      {/* Main page */}
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-4xl font-bold mb-6 text-center">Wardrobe</h1>

        {/* Filter + Upload Row */}
        <div className="flex flex-wrap justify-between items-center mb-6 px-2 gap-4">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="typeFilter" className="text-lg font-medium">
              Filter by Type:
            </label>
            <select
              id="typeFilter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-800"
            >

              {allTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Upload button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
          >
            Upload New Item
          </button>

        </div>

        {/* Grouped wardrobe display */}
        {preferredOrder
          .filter((type) => filteredGroups[type])
          .map((type) => (
            <div key={type} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{type}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGroups[type].map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded shadow flex flex-col">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-auto object-contain"
                    />
                    <p className="mt-2 text-center text-lg font-medium">{item.alt}</p>
                    <p className="text-center text-sm text-gray-500">{item.type}</p>

                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(wardrobe.indexOf(item))}
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(wardrobe.indexOf(item))}
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition"
                      >
                        Delete
                      </button>
                    </div>


                  </div>
                ))}

              </div>
            </div>
          ))}

        {/* Empty-wardrobe fallback */}
        {wardrobe.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No wardrobe items found.
          </p>
        )}
      </div>

      {/* Modal (placed outside the main div but inside fragment) */}
      {showModal && (
        <AddClothingModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddClothing}
        />
      )}
      {itemToEdit && (
        <EditClothingModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default Wardrobe;
