import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for auth
export const auth = {
  // Sign up new user
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: username
        }
      }
    })
    return { data, error }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Helper functions for database
export const db = {
  // Clothing items
  clothing: {
    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    getByIds: async (ids) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .in('id', ids)
      return { data, error }
    },

    create: async (item) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .insert([item])
        .select()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('clothing_items')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Outfits
  outfits: {
    getAll: async (userId) => {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    },

    create: async (outfit) => {
      const { data, error } = await supabase
        .from('outfits')
        .insert([outfit])
        .select()
      return { data, error }
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('outfits')
        .update(updates)
        .eq('id', id)
        .select()
      return { data, error }
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id)
      return { error }
    }
  },

  // Profile
  profile: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
      return { data, error }
    }
  }
}
