import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOutfits } from '../hooks/useOutfits';
import { getWardrobe } from '../util/storage';
import OutfitCreator from '../components/outfits/OutfitCreator';
import { getSortedCategories } from '../config/categories';
import backgroundImage from '../assets/background.jpg';

const OutfitDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getOutfitWithItems, deleteOutfit } = useOutfits(user?.id);

  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [loadingClothingItems, setLoadingClothingItems] = useState(true);

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

  useEffect(() => {
    if (user?.id) {
      loadOutfit();
      loadClothingItems();
    }
  }, [id, user?.id]);

  const loadOutfit = async () => {
    try {
      setLoading(true);
      const { outfit: outfitData, error: err } = await getOutfitWithItems(id);
      if (err) throw new Error(err);
      setOutfit(outfitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClothingItems = async () => {
    if (!user?.id) {
      setLoadingClothingItems(false);
      return;
    }

    try {
      setLoadingClothingItems(true);
      const items = await getWardrobe(user.id);
      setClothingItems(items || []);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoadingClothingItems(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: err } = await deleteOutfit(id);
      if (err) throw new Error(err);
      navigate('/outfits');
    } catch (err) {
      alert('Failed to delete outfit: ' + err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdateSuccess = async () => {
    setIsEditing(false);
    await loadOutfit(); // Reload to get fresh data
  };

  // Group items by category for display
  const getItemsByCategory = () => {
    if (!outfit?.items) return {};

    const grouped = {};
    outfit.items.forEach((item) => {
      const category = item.type;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  };

  if (loading) {
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
            <p className="text-white/80 tracking-[0.1em] text-sm">Loading outfit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <p className="text-red-300 mb-4 tracking-[0.05em]">{error || 'Outfit not found'}</p>
            <Link to="/outfits" className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm">
              Back to Outfits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If editing, show the OutfitCreator component
  if (isEditing) {
    if (loadingClothingItems) {
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
              <p className="text-white/80 tracking-[0.1em] text-sm">Loading wardrobe items...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-light text-white">Edit Outfit</h1>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors tracking-[0.05em]"
              >
                Cancel
              </button>
            </div>
            {clothingItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4 tracking-[0.05em]">No clothing items found in your wardrobe.</p>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm"
                >
                  Back to Outfit
                </button>
              </div>
            ) : (
              <OutfitCreator
                userId={user?.id}
                clothingItems={clothingItems}
                onSuccess={handleUpdateSuccess}
                initialSelectedItems={outfit.clothing_item_ids || []}
                initialName={outfit.name || ''}
                initialNotes={outfit.notes || ''}
                isEditMode={true}
                outfitId={outfit.id}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const itemsByCategory = getItemsByCategory();

  return (
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

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/outfits"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors tracking-[0.05em]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Outfits
          </Link>

          {/* Outfit Card */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl mb-4 text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
                {outfit.name}
              </h1>
              {outfit.notes && (
                <p className="text-white/60 text-lg mb-2 tracking-[0.02em]">{outfit.notes}</p>
              )}
              <p className="text-sm text-white/40 tracking-[0.05em]">
                Created {new Date(outfit.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Outfit Visual Preview */}
            <div className="mb-8">
              {Object.keys(itemsByCategory).length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-6xl mb-4">👔</div>
                  <p className="text-white/60 tracking-[0.05em]">No items in this outfit</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getSortedCategories().map((category) => {
                    const items = itemsByCategory[category.name];
                    if (!items || items.length === 0) return null;

                    return (
                      <div key={category.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20`}>
                            <span className="text-xl">{category.icon}</span>
                          </div>
                          <h3 className="text-xl font-light text-white">{category.name}</h3>
                          <span className="text-sm text-white/60">
                            ({items.length})
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all transform hover:scale-105"
                            >
                              <div className="relative">
                                <img
                                  src={item.src}
                                  alt={item.alt}
                                  className="w-full aspect-square object-cover bg-white"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                  <p className="text-sm font-medium text-white truncate">
                                    {item.alt}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons at Bottom */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2 text-lg font-medium tracking-[0.05em]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Outfit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 px-6 py-4 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all border border-red-500/30 flex items-center justify-center gap-2 text-lg font-medium tracking-[0.05em]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Outfit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-light text-white mb-4">Delete Outfit?</h3>
            <p className="text-white/60 mb-6 tracking-[0.02em]">
              Are you sure you want to delete "{outfit.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 disabled:opacity-50 tracking-[0.05em]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500/30 text-red-300 rounded-xl hover:bg-red-500/40 transition-all border border-red-500/40 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[0.05em]"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitDetail;
