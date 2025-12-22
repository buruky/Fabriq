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
      <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Your <span className="text-gradient-primary">Wardrobe</span>
            </h1>
            <p className="text-neutral-text-muted text-lg">Manage and organize your clothing collection</p>
          </div>

          {/* Filter + Upload Row */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            {/* Type filter */}
            <div className="flex items-center gap-3">
              <label htmlFor="typeFilter" className="text-sm font-semibold text-neutral-text">
                Filter:
              </label>
              <select
                id="typeFilter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-neutral-border bg-neutral-background-light text-neutral-text font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                {allTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Upload button */}
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Item
            </button>
          </div>

          {/* Grouped wardrobe display */}
          {preferredOrder
            .filter((type) => filteredGroups[type])
            .map((type) => (
              <div key={type} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neutral-text flex items-center gap-3">
                  <span>{type}</span>
                  <span className="text-sm font-medium text-neutral-text-muted bg-neutral-background-light px-3 py-1 rounded-full border border-neutral-border">
                    {filteredGroups[type].length}
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredGroups[type].map((item, idx) => (
                    <div key={idx} className="group card-hover relative overflow-hidden">
                      {/* Image Container */}
                      <div className="relative aspect-square bg-neutral-background rounded-xl overflow-hidden mb-3">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="px-2">
                        <p className="text-center text-base font-semibold text-neutral-text mb-1 truncate">{item.alt}</p>
                        <p className="text-center text-sm text-neutral-text-muted mb-3">{item.type}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(wardrobe.indexOf(item))}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-neutral-background-light text-neutral-text hover:bg-neutral-background transition-colors flex items-center justify-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(wardrobe.indexOf(item))}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-950/20 text-red-400 hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* Empty-wardrobe fallback */}
          {wardrobe.length === 0 && (
            <div className="glass rounded-2xl p-16 text-center">
              <div className="text-7xl mb-6">👔</div>
              <h3 className="text-2xl font-bold text-neutral-text mb-2">No Items Yet</h3>
              <p className="text-neutral-text-muted mb-8 max-w-md mx-auto">
                Start building your digital wardrobe by uploading your first clothing item
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                Add Your First Item
              </button>
            </div>
          )}
        </div>
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
