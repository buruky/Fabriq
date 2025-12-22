// Authentication service
// This wraps the Supabase auth functions for easier use throughout the app
import { auth as supabaseAuth } from './supabase';

export const authService = {
  // Sign up a new user
  async signUp(email, password, username) {
    try {
      const { data, error } = await supabaseAuth.signUp(email, password, username);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    try {
      const { data, error } = await supabaseAuth.signIn(email, password);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Sign out current user
  async signOut() {
    try {
      const { error } = await supabaseAuth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { user, error } = await supabaseAuth.getCurrentUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabaseAuth.onAuthStateChange(callback);
  }
};
