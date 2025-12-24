import { useState, useMemo } from 'react';
import { db } from '../../services/supabase';
import { CLOTHING_CATEGORIES, getCategoryByName, getSortedCategories } from '../../config/categories';

const OutfitCreator = ({
  userId,
  clothingItems,
  onSuccess,
  initialSelectedItems = [],
  initialName = '',
  initialNotes = '',
  isEditMode = false,
  outfitId = null
}) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [outfitName, setOutfitName] = useState(initialName);
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // Group items by category using the shared config
  const itemsByCategory = useMemo(() => {
    const grouped = {};

    // Initialize all categories
    CLOTHING_CATEGORIES.forEach(cat => {
      grouped[cat.name] = [];
    });

    // Group items, mapping legacy names to new categories
    clothingItems.forEach((item) => {
      const category = getCategoryByName(item.type); // Use 'type' from wardrobe schema
      if (category && grouped[category.name]) {
        grouped[category.name].push(item);
      }
    });

    // Remove empty categories
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }, [clothingItems]);

  // Get selected items with their full data
  const selectedItemsData = useMemo(() => {
    return clothingItems.filter(item => selectedItems.includes(item.id));
  }, [selectedItems, clothingItems]);

  // Group selected items by category for outfit preview
  const selectedByCategory = useMemo(() => {
    const grouped = {};
    selectedItemsData.forEach(item => {
      const category = getCategoryByName(item.type); // Use 'type' from wardrobe schema
      const catName = category.name;
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(item);
    });
    return grouped;
  }, [selectedItemsData]);

  const toggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getSelectedCountForCategory = (categoryName) => {
    const categoryItemIds = itemsByCategory[categoryName]?.map(item => item.id) || [];
    return selectedItems.filter(id => categoryItemIds.includes(id)).length;
  };

  const getCategoryInfo = (categoryName) => {
    return CLOTHING_CATEGORIES.find(c => c.name === categoryName) || CLOTHING_CATEGORIES[CLOTHING_CATEGORIES.length - 1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setError('Please select at least one item');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let data, error;

      if (isEditMode && outfitId) {
        // Update existing outfit
        const result = await db.outfits.update(outfitId, {
          name: outfitName,
          clothing_item_ids: selectedItems,
          notes
        });
        data = result.data;
        error = result.error;
      } else {
        // Create new outfit
        const result = await db.outfits.create({
          user_id: userId,
          name: outfitName,
          clothing_item_ids: selectedItems,
          notes
        });
        data = result.data;
        error = result.error;
      }

      if (error) throw error;
      onSuccess && onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Category Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Instructions */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-neutral-text mb-2">
              Build Your Outfit by Category
            </h2>
            <p className="text-neutral-text-muted">
              Click on a category to select items. Selected items will appear in your outfit preview.
              {selectedItems.length > 0 && (
                <span className="ml-2 text-primary font-semibold">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(itemsByCategory).sort((a, b) => {
              const orderA = getCategoryInfo(a).order;
              const orderB = getCategoryInfo(b).order;
              return orderA - orderB;
            }).map((categoryName) => {
              const info = getCategoryInfo(categoryName);
              const itemCount = itemsByCategory[categoryName].length;
              const selectedCount = getSelectedCountForCategory(categoryName);

              return (
                <button
                  key={categoryName}
                  onClick={() => setActiveCategory(categoryName)}
                  className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-left"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <span className="text-4xl">{info.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-text mb-1">{categoryName}</h3>
                  <p className="text-sm text-neutral-text-muted">
                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                  </p>
                  {selectedCount > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-semibold">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {selectedCount} selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column - Outfit Preview */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-text mb-4">Outfit Preview</h2>

            {selectedItems.length === 0 ? (
              <div className="text-center py-12 text-neutral-text-muted">
                <div className="text-6xl mb-4">👔</div>
                <p className="text-sm">Select items to preview your outfit</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getSortedCategories().map((category) => {
                  const items = selectedByCategory[category.name];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{category.icon}</span>
                        <h3 className="text-sm font-semibold text-neutral-text">{category.name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="relative group rounded-xl overflow-hidden ring-2 ring-primary/50"
                          >
                            <img
                              src={item.src}
                              alt={item.alt}
                              className="w-full aspect-square object-cover bg-white"
                            />
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-xs text-white truncate">{item.alt}</p>
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
        </div>
      </div>

      {/* Outfit Form - Full Width Below */}
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-neutral-text mb-4">Outfit Details</h2>

          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Outfit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              required
              placeholder="e.g., Casual Friday, Date Night, Summer Vibes"
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-border bg-neutral-background text-neutral-text placeholder-neutral-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this outfit, like occasion, season, or styling tips..."
              className="w-full px-4 py-3 rounded-xl border-2 border-neutral-border bg-neutral-background text-neutral-text placeholder-neutral-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              rows="4"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || selectedItems.length === 0}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEditMode ? 'Update Outfit' : 'Create Outfit'}
              </>
            )}
          </button>

          {selectedItems.length === 0 && (
            <p className="text-center text-sm text-neutral-text-muted">
              Please select at least one item to create an outfit
            </p>
          )}
        </form>
      </div>

      {/* Category Modal */}
      {activeCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-background rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="glass border-b border-neutral-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryInfo(activeCategory).color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">{getCategoryInfo(activeCategory).icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-text">{activeCategory}</h2>
                  <p className="text-sm text-neutral-text-muted">
                    {getSelectedCountForCategory(activeCategory)} of {itemsByCategory[activeCategory].length} selected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-neutral-text-muted hover:text-neutral-text transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {itemsByCategory[activeCategory].map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? 'ring-4 ring-primary shadow-xl shadow-primary/30'
                          : 'ring-2 ring-neutral-border hover:ring-primary/50'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full aspect-square object-cover bg-white"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-neutral-background-light">
                        <p className="text-xs font-medium text-neutral-text truncate">{item.alt}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="glass border-t border-neutral-border p-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="w-full btn-primary py-3 text-lg font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OutfitCreator;
