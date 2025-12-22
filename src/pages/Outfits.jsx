import { Link } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState';

const Outfits = () => {
  // TODO: Replace with actual outfits data from API/state
  const outfits = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-background via-neutral-background-light to-neutral-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold">
              Your <span className="text-gradient-primary">Outfits</span>
            </h1>
            <Link to="/outfits/create" className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Outfit
            </Link>
          </div>
          <p className="text-neutral-text-muted text-lg">Browse and manage your saved outfit combinations</p>
        </div>

        {/* Filter/Sort Options */}
        {outfits.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <label htmlFor="sortBy" className="text-sm font-semibold text-neutral-text">
                Sort by:
              </label>
              <select
                id="sortBy"
                className="px-4 py-2.5 rounded-xl border border-neutral-border bg-neutral-background-light text-neutral-text font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="recent">Most Recent</option>
                <option value="favorites">Favorites</option>
                <option value="season">Season</option>
                <option value="occasion">Occasion</option>
              </select>
            </div>
          </div>
        )}

        {/* Outfits Grid */}
        {outfits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Map through outfits and display cards */}
            {outfits.map((outfit, idx) => (
              <div key={idx} className="card-hover">
                <div className="aspect-square bg-gray-100 rounded-xl mb-4"></div>
                <h3 className="text-lg font-semibold text-neutral-text mb-2">{outfit.name}</h3>
                <p className="text-sm text-neutral-text-muted">{outfit.occasion}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <EmptyState
            icon="✨"
            title="No Outfits Created Yet"
            message="Start creating outfit combinations from your wardrobe items. Mix and match to discover your perfect looks!"
            actionText="Create Your First Outfit"
            actionLink="/outfits/create"
          />
        )}

        {/* Feature Cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-neutral-text">Get Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-text mb-2">Mix & Match</h3>
              <p className="text-neutral-text-muted text-sm">
                Combine items from your wardrobe to create unique outfit combinations
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
                <span className="text-white text-2xl">📸</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-text mb-2">Save Favorites</h3>
              <p className="text-neutral-text-muted text-sm">
                Keep track of your best looks and quickly access them when you need them
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-text mb-2">AI Suggestions</h3>
              <p className="text-neutral-text-muted text-sm">
                Get smart outfit recommendations based on weather, occasion, and your style
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
