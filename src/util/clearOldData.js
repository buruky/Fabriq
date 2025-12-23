// Utility to clear old localStorage and IndexedDB data
// Run this once to start fresh with the new Supabase system

import { clear } from 'idb-keyval';

export const clearOldWardrobeData = async () => {
  try {
    console.log('Clearing old wardrobe data from IndexedDB...');

    // Clear all IndexedDB data (idb-keyval)
    await clear();

    console.log('✅ Successfully cleared old wardrobe data!');
    console.log('You can now use the new Supabase-powered wardrobe system.');

    return true;
  } catch (error) {
    console.error('Error clearing old data:', error);
    return false;
  }
};

// Auto-run on import (one-time cleanup)
// Comment this out after first run
clearOldWardrobeData();
