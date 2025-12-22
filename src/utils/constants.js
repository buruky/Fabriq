// Application constants

// Clothing categories and subcategories
export const CATEGORIES = {
  tops: ['t-shirt', 'blouse', 'sweater', 'tank-top', 'dress-shirt', 'hoodie'],
  bottoms: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
  shoes: ['sneakers', 'boots', 'heels', 'sandals', 'flats'],
  outerwear: ['jacket', 'coat', 'blazer', 'cardigan', 'vest'],
  accessories: ['hat', 'bag', 'scarf', 'belt', 'jewelry', 'sunglasses']
};

// Seasons
export const SEASONS = ['spring', 'summer', 'fall', 'winter', 'all-season'];

// Color palette (for color picker)
export const COLORS = [
  { name: 'black', hex: '#000000' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'gray', hex: '#808080' },
  { name: 'red', hex: '#FF0000' },
  { name: 'blue', hex: '#0000FF' },
  { name: 'green', hex: '#008000' },
  { name: 'yellow', hex: '#FFFF00' },
  { name: 'orange', hex: '#FFA500' },
  { name: 'purple', hex: '#800080' },
  { name: 'pink', hex: '#FFC0CB' },
  { name: 'brown', hex: '#A52A2A' },
  { name: 'beige', hex: '#F5F5DC' },
  { name: 'navy', hex: '#000080' },
  { name: 'burgundy', hex: '#800020' }
];

// Theme colors (matching project spec)
export const THEME_COLORS = {
  primary: '#992A8B',
  secondary: '#BF7587',
  accent: '#E68057',
  background: '#F9FAFB',
  textDark: '#111827',
  textLight: '#6B7280',
  border: '#E5E7EB'
};

// Image upload constraints
export const IMAGE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB in bytes
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
};

// Pagination
export const ITEMS_PER_PAGE = 20;

// Local storage keys
export const STORAGE_KEYS = {
  user: 'fabriq_user',
  theme: 'fabriq_theme'
};

// API endpoints (if using custom backend)
export const API_ENDPOINTS = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    logout: '/auth/logout',
    user: '/auth/user'
  },
  clothing: {
    getAll: '/clothing',
    getById: (id) => `/clothing/${id}`,
    create: '/clothing',
    update: (id) => `/clothing/${id}`,
    delete: (id) => `/clothing/${id}`
  },
  outfits: {
    getAll: '/outfits',
    getById: (id) => `/outfits/${id}`,
    create: '/outfits',
    update: (id) => `/outfits/${id}`,
    delete: (id) => `/outfits/${id}`
  },
  profile: {
    get: '/user/profile',
    update: '/user/profile',
    stats: '/user/stats'
  }
};

// Error messages
export const ERROR_MESSAGES = {
  network: 'Unable to connect. Check your internet connection.',
  upload: 'Upload failed. Try a smaller image.',
  notFound: 'Item not found. It may have been deleted.',
  validation: 'Please fill in all required fields.',
  generic: 'Something went wrong. Please try again.',
  unauthorized: 'Please log in to continue.',
  forbidden: 'You do not have permission to do this.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  itemAdded: 'Item added to wardrobe!',
  itemUpdated: 'Item updated successfully!',
  itemDeleted: 'Item deleted successfully!',
  outfitCreated: 'Outfit created!',
  outfitUpdated: 'Outfit updated successfully!',
  outfitDeleted: 'Outfit deleted successfully!',
  profileUpdated: 'Profile updated successfully!'
};
