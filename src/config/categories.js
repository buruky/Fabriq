// Shared clothing categories configuration
// Used across wardrobe and outfit creation features

export const CLOTHING_CATEGORIES = [
  {
    id: 'hats',
    name: 'Hats',
    icon: '🎩',
    color: 'from-indigo-500 to-indigo-600',
    order: 1,
  },
  {
    id: 'tops',
    name: 'Tops',
    icon: '👕',
    color: 'from-blue-500 to-blue-600',
    order: 2,
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    icon: '🧥',
    color: 'from-orange-500 to-orange-600',
    order: 3,
  },
  {
    id: 'bottoms',
    name: 'Bottoms',
    icon: '👖',
    color: 'from-purple-500 to-purple-600',
    order: 4,
  },
  {
    id: 'dresses',
    name: 'Dresses',
    icon: '👗',
    color: 'from-pink-500 to-pink-600',
    order: 5,
  },
  {
    id: 'shoes',
    name: 'Shoes',
    icon: '👟',
    color: 'from-green-500 to-green-600',
    order: 6,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: '👜',
    color: 'from-yellow-500 to-yellow-600',
    order: 7,
  },
];

// Helper to get category by name (case-insensitive, handles legacy names)
export const getCategoryByName = (name) => {
  if (!name) return CLOTHING_CATEGORIES.find(c => c.id === 'accessories'); // default

  const normalized = name.toLowerCase();

  // Direct match
  let category = CLOTHING_CATEGORIES.find(c => c.name.toLowerCase() === normalized);
  if (category) return category;

  // Legacy mappings
  const legacyMap = {
    'shirts': 'tops',
    'jackets': 'outerwear',
    'pants': 'bottoms',
    'shorts': 'bottoms',
    'other': 'accessories',
  };

  const mappedId = legacyMap[normalized];
  if (mappedId) {
    return CLOTHING_CATEGORIES.find(c => c.id === mappedId);
  }

  // Fallback
  return CLOTHING_CATEGORIES.find(c => c.id === 'accessories');
};

// Get sorted categories for display
export const getSortedCategories = () => {
  return [...CLOTHING_CATEGORIES].sort((a, b) => a.order - b.order);
};

// Get category names only (for backwards compatibility)
export const getCategoryNames = () => {
  return CLOTHING_CATEGORIES.map(c => c.name);
};
