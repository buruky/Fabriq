import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOutfits } from '../hooks/useOutfits';
import { getWardrobe } from '../util/storage';
import OutfitCreator from '../components/outfits/OutfitCreator';
import { getSortedCategories } from '../config/categories';

const OutfitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOutfitWithItems, deleteOutfit, updateOutfit } = useOutfits(user?.id);

  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);

  useEffect(() => {
    loadOutfit();
    loadClothingItems();
  }, [id]);

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
    try {
      const items = await getWardrobe(user.id);
      setClothingItems(items || []);
    } catch (err) {
      console.error('Error loading items:', err);
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

  const handleUpdateSuccess = async (updatedOutfit) => {
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">Loading outfit...</div>
        </div>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Outfit not found'}</p>
            <Link to="/outfits" className="btn-primary">
              Back to Outfits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If editing, show the OutfitCreator component
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Outfit</h1>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-neutral-text-muted hover:text-neutral-text"
            >
              Cancel
            </button>
          </div>
          <OutfitCreatorEdit
            userId={user?.id}
            clothingItems={clothingItems}
            initialOutfit={outfit}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  const itemsByCategory = getItemsByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/outfits"
          className="inline-flex items-center gap-2 text-neutral-text-muted hover:text-neutral-text mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Outfits
        </Link>

        {/* Outfit Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">{outfit.name}</span>
            </h1>
            {outfit.notes && (
              <p className="text-neutral-text-muted text-lg mb-2">{outfit.notes}</p>
            )}
            <p className="text-sm text-neutral-text-muted">
              Created {new Date(outfit.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Outfit Visual Preview */}
          <div className="mb-8">
            {Object.keys(itemsByCategory).length === 0 ? (
              <div className="text-center py-16 bg-neutral-background-light rounded-2xl">
                <div className="text-6xl mb-4">👔</div>
                <p className="text-neutral-text-muted">No items in this outfit</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getSortedCategories().map((category) => {
                  const items = itemsByCategory[category.name];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category.name} className="bg-neutral-background-light rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <span className="text-xl">{category.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-text">{category.name}</h3>
                        <span className="text-sm text-neutral-text-muted">
                          ({items.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl overflow-hidden ring-2 ring-primary/30 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
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
              className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Outfit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Outfit
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-background rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-neutral-text mb-4">Delete Outfit?</h3>
            <p className="text-neutral-text-muted mb-6">
              Are you sure you want to delete "{outfit.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-neutral-background-light text-neutral-text rounded-xl hover:bg-neutral-border transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

// Edit mode wrapper component that uses OutfitCreator logic
const OutfitCreatorEdit = ({ userId, clothingItems, initialOutfit, onSuccess, onCancel }) => {
  const [selectedItems, setSelectedItems] = useState(initialOutfit.clothing_item_ids || []);
  const [outfitName, setOutfitName] = useState(initialOutfit.name || '');
  const [notes, setNotes] = useState(initialOutfit.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateOutfit } = useOutfits(userId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setError('Please select at least one item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: err } = await updateOutfit(initialOutfit.id, {
        name: outfitName,
        clothing_item_ids: selectedItems,
        notes
      });

      if (err) throw new Error(err);
      onSuccess && onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <OutfitCreator
        userId={userId}
        clothingItems={clothingItems}
        onSuccess={onSuccess}
        initialSelectedItems={selectedItems}
        initialName={outfitName}
        initialNotes={notes}
        isEditMode={true}
        outfitId={initialOutfit.id}
      />
    </div>
  );
};

export default OutfitDetail;
