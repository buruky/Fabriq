// src/pages/Wardrobe.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AddClothingModal from '../components/Wardrobe/AddClothingModal';
import EditClothingModal from '../components/Wardrobe/EditClothingModal';
import { getSortedCategories, getCategoryByName } from '../config/categories';
import backgroundImage from '../assets/background.jpg';

import {
  getWardrobe,
  addToWardrobe,
  deleteItemFromWardrobe,
  updateItemInWardrobe,
} from '../util/storage';








const Wardrobe = () => {
  /* ----------------------  STATE & CONTEXT  ---------------------- */
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [itemToEdit, setItemToEdit] = useState(null);

  const [wardrobe,     setWardrobe]     = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [showModal,    setShowModal]    = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const navItems = [
    { name: 'HOME', path: '/dashboard' },
    { name: 'WARDROBE', path: '/wardrobe' },
    { name: 'OUTFITS', path: '/outfits' },
    { name: 'PROFILE', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  /* ---------------------  INITIAL LOAD / SYNC  -------------------- */
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getWardrobe(user.id)
      .then(setWardrobe)
      .catch(err => {
        console.error('Failed to load wardrobe:', err);
        setError('Failed to load your wardrobe. Please try refreshing the page.');
      })
      .finally(() => setLoading(false));
  }, [user?.id, authLoading]);


  /* ----------------------  ADD NEW CLOTHING  ---------------------- */
  const handleAddClothing = async (item) => {
    if (!user?.id) {
      alert('You must be logged in to add items.');
      return;
    }

    try {
      const newItem = await addToWardrobe(user.id, item);
      setWardrobe((prev) => [...prev, newItem]);
    } catch (err) {
      console.error('Failed to add clothing:', err);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleDelete = async (item) => {
    if (!user?.id) return;
    if (!item.id) {
      console.error('Cannot delete item without ID');
      return;
    }

    // Confirm deletion
    if (!window.confirm(`Delete "${item.alt}"?`)) {
      return;
    }

    try {
      await deleteItemFromWardrobe(user.id, item.id);
      setWardrobe((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error('Failed to delete clothing:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setItemToEdit({ ...item }); // Pass the whole item with its ID
  };

  const handleSaveEdit = async (updatedItem) => {
    if (!user?.id) return;
    if (!updatedItem.id) {
      console.error('Cannot update item without ID');
      return;
    }

    try {
      const updated = await updateItemInWardrobe(user.id, updatedItem.id, updatedItem);
      setWardrobe((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      console.error('Failed to update clothing:', err);
      alert('Failed to update item. Please try again.');
    }
  };



  /* ----------------------  GROUP & FILTERING  ---------------------- */
  const grouped = wardrobe.reduce((acc, item) => {
    // Normalize category name using the shared config
    const category = getCategoryByName(item.type);
    const type = category.name;
    (acc[type] ||= []).push(item);
    return acc;
  }, {});

  const allTypes = ['All', ...getSortedCategories().map(c => c.name).filter(name => grouped[name])];
  const filteredGroups = selectedType === 'All'
    ? grouped
    : { [selectedType]: grouped[selectedType] || [] };

  /* ----------------------------  JSX  ----------------------------- */

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/60 mx-auto mb-4"></div>
            <p className="text-white/80 tracking-[0.1em] text-sm">Loading your wardrobe...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-light text-white mb-2">Error Loading Wardrobe</h3>
            <p className="text-white/60 mb-6 text-sm tracking-[0.05em]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main page */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 min-h-screen">
          {/* Top Left Navigation */}
          <nav className="fixed left-8 top-8 z-20">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] ${
                      isActive(item.path)
                        ? 'text-white font-medium'
                        : 'text-white/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* Separator Line */}
              <li className="py-2">
                <div className="w-full h-px bg-white/20"></div>
              </li>

              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  className="block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] text-white/60"
                >
                  LOGOUT
                </button>
              </li>
            </ul>
          </nav>

          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
                Your Wardrobe
              </h1>
              <p className="text-white/60 text-base sm:text-lg tracking-[0.05em]">Manage and organize your clothing collection</p>
            </div>

          {/* Filter + Upload Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            {/* Type filter */}
            <div className="flex items-center gap-3">
              <label htmlFor="typeFilter" className="text-sm font-medium text-white/80 whitespace-nowrap tracking-[0.1em]">
                Filter:
              </label>
              <select
                id="typeFilter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 bg-black/30 backdrop-blur-md text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              >
                {allTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Upload button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Item
            </button>
          </div>

          {/* Grouped wardrobe display */}
          {getSortedCategories()
            .map(c => c.name)
            .filter((type) => filteredGroups[type])
            .map((type) => (
              <div key={type} className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-light mb-4 sm:mb-6 text-white flex items-center gap-2 sm:gap-3">
                  <span>{type}</span>
                  <span className="text-xs sm:text-sm font-medium text-white/60 bg-black/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-white/20">
                    {filteredGroups[type].length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredGroups[type].map((item, idx) => (
                    <div key={idx} className="group relative overflow-hidden w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl hover:bg-black/40 hover:border-white/20 transition-all">
                      {/* Image Container */}
                      <div className="relative aspect-square bg-white/5 rounded-t-xl overflow-hidden mb-3">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="w-full px-3 pb-3">
                        <p className="text-center text-sm sm:text-base font-medium text-white mb-1 truncate">{item.alt}</p>
                        <p className="text-center text-xs sm:text-sm text-white/60 mb-3 tracking-[0.05em]">{item.type}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-1 border border-white/10"
                          >
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1 border border-red-500/30"
                          >
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
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
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-16 text-center">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">👔</div>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">No Items Yet</h3>
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 max-w-md mx-auto px-4 tracking-[0.05em]">
                Start building your digital wardrobe by uploading your first clothing item
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm w-full sm:w-auto"
              >
                Add Your First Item
              </button>
            </div>
          )}
          </div>
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
