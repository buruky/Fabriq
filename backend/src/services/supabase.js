const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables!');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database helper functions
const db = {
  // Clothing items
  clothing: {
    getAll: async (userId) => {
      return await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },

    getById: async (id) => {
      return await supabase
        .from('clothing_items')
        .select('*')
        .eq('id', id)
        .single();
    },

    create: async (item) => {
      return await supabase
        .from('clothing_items')
        .insert([item])
        .select();
    },

    update: async (id, updates) => {
      return await supabase
        .from('clothing_items')
        .update(updates)
        .eq('id', id)
        .select();
    },

    delete: async (id) => {
      return await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id);
    }
  },

  // Outfits
  outfits: {
    getAll: async (userId) => {
      return await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },

    getById: async (id) => {
      return await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();
    },

    create: async (outfit) => {
      return await supabase
        .from('outfits')
        .insert([outfit])
        .select();
    },

    update: async (id, updates) => {
      return await supabase
        .from('outfits')
        .update(updates)
        .eq('id', id)
        .select();
    },

    delete: async (id) => {
      return await supabase
        .from('outfits')
        .delete()
        .eq('id', id);
    }
  },

  // Profile
  profile: {
    get: async (userId) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    },

    update: async (userId, updates) => {
      return await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();
    }
  }
};

module.exports = db;
