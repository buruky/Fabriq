import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/supabase';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOutfits: 0,
    itemsByCategory: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { user: currentUser } = await auth.getCurrentUser();
      setUser(currentUser);

      // TODO: Load stats
      // const { data, error } = await fetch stats from API
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Redirect to landing page
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Your <span className="text-gradient-primary">Profile</span>
          </h1>
          <p className="text-neutral-text-muted text-lg">Manage your account and preferences</p>
        </div>

        {/* User Info Card */}
        <div className="glass rounded-2xl p-8 mb-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary/20">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-neutral-background-light rounded-full"></div>
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-neutral-text mb-1">
                {user?.user_metadata?.username || 'Fabriq User'}
              </h2>
              <p className="text-neutral-text-muted mb-4">{user?.email || 'user@example.com'}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="badge badge-primary">
                  Free Account
                </span>
                <span className="badge badge-success">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass rounded-2xl p-8 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-6 text-neutral-text">Wardrobe Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Total Items */}
            <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="text-3xl mb-2">👕</div>
              <p className="text-neutral-text-muted text-sm font-medium mb-1">Total Items</p>
              <p className="text-3xl font-bold text-neutral-text">{stats.totalItems}</p>
            </div>

            {/* Total Outfits */}
            <div className="text-center p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-neutral-text-muted text-sm font-medium mb-1">Total Outfits</p>
              <p className="text-3xl font-bold text-neutral-text">{stats.totalOutfits}</p>
            </div>

            {/* Member Since */}
            <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 col-span-2 md:col-span-1">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-neutral-text-muted text-sm font-medium mb-1">Member Since</p>
              <p className="text-lg font-bold text-neutral-text">2024</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="glass rounded-2xl p-8 mb-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-6 text-neutral-text">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full text-left px-6 py-4 bg-neutral-background-light hover:bg-neutral-background rounded-xl border border-neutral-border transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-text">Edit Profile</p>
                  <p className="text-sm text-neutral-text-muted">Update your name and photo</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-neutral-text-muted group-hover:text-neutral-text transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full text-left px-6 py-4 bg-neutral-background-light hover:bg-neutral-background rounded-xl border border-neutral-border transition-all duration-200 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-text">Change Password</p>
                  <p className="text-sm text-neutral-text-muted">Update your password</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-neutral-text-muted group-hover:text-neutral-text transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full px-6 py-4 bg-neutral-background-light border-2 border-red-500/30 text-red-400 rounded-xl font-semibold hover:bg-red-950/20 hover:border-red-500/50 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
