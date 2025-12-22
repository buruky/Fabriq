import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Your <span className="text-gradient-primary">Dashboard</span>
          </h1>
          <p className="text-neutral-text-muted text-lg">Welcome back! Here's your wardrobe overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Total Items Card */}
          <div className="group relative bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white text-2xl">👕</span>
              </div>
              <div className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                +0%
              </div>
            </div>
            <h3 className="text-neutral-text-muted text-sm font-medium mb-1">Total Items</h3>
            <p className="text-4xl font-bold text-neutral-text">0</p>
            <p className="text-xs text-neutral-text-muted mt-2">Clothing items in wardrobe</p>
          </div>

          {/* Total Outfits Card */}
          <div className="group relative bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm rounded-2xl p-6 border border-secondary/20 hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <span className="text-white text-2xl">✨</span>
              </div>
              <div className="text-xs text-secondary font-semibold bg-secondary/10 px-3 py-1 rounded-full">
                +0%
              </div>
            </div>
            <h3 className="text-neutral-text-muted text-sm font-medium mb-1">Total Outfits</h3>
            <p className="text-4xl font-bold text-neutral-text">0</p>
            <p className="text-xs text-neutral-text-muted mt-2">Saved outfit combinations</p>
          </div>

          {/* Categories Card */}
          <div className="group relative bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm rounded-2xl p-6 border border-accent/20 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white text-2xl">📂</span>
              </div>
              <div className="text-xs text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full">
                All
              </div>
            </div>
            <h3 className="text-neutral-text-muted text-sm font-medium mb-1">Categories</h3>
            <p className="text-4xl font-bold text-neutral-text">0</p>
            <p className="text-xs text-neutral-text-muted mt-2">Different item types</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-neutral-text">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Clothing Item */}
            <Link
              to="/wardrobe/add"
              className="group relative glass rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">➕</div>
                <h3 className="text-2xl font-bold text-neutral-text mb-2">Add Clothing Item</h3>
                <p className="text-neutral-text-muted">Upload photos and organize your wardrobe</p>
              </div>
            </Link>

            {/* Create Outfit */}
            <Link
              to="/outfits/create"
              className="group relative glass rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
                <h3 className="text-2xl font-bold text-neutral-text mb-2">Create Outfit</h3>
                <p className="text-neutral-text-muted">Mix and match items to create new looks</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section (Placeholder) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-neutral-text">Recent Activity</h2>
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">📊</div>
            <p className="text-neutral-text-muted">Your recent wardrobe activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
