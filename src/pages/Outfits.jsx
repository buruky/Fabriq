import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOutfits } from '../hooks/useOutfits';
import backgroundImage from '../assets/background.jpg';

const Outfits = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { outfits, loading } = useOutfits(user?.id);

  const navItems = [
    { name: 'HOME', path: '/dashboard' },
    { name: 'WARDROBE', path: '/wardrobe' },
    { name: 'OUTFITS', path: '/outfits' },
    { name: 'PROFILE', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/60 mx-auto mb-4"></div>
            <p className="text-white/80 tracking-[0.1em] text-sm">Loading your outfits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Top Left Navigation */}
        <nav className="fixed left-8 top-8 z-20">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] ${
                    isActive(item.path)
                      ? 'text-white font-medium'
                      : 'text-white/60'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Separator Line */}
            <li className="py-2">
              <div className="w-full h-px bg-white/20"></div>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="block text-sm tracking-[0.2em] transition-all duration-300 hover:text-white hover:tracking-[0.3em] text-white/60"
              >
                LOGOUT
              </button>
            </li>
          </ul>
        </nav>

        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <h1 className="text-4xl md:text-5xl text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
                Your Outfits
              </h1>
              <Link to="/outfits/create" className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Outfit
              </Link>
            </div>
            <p className="text-white/60 text-lg tracking-[0.05em]">Browse and manage your saved outfit combinations</p>
          </div>

          {/* Filter/Sort Options */}
          {outfits.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <label htmlFor="sortBy" className="text-sm font-medium text-white/80 tracking-[0.1em]">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  className="px-4 py-2.5 rounded-xl border border-white/20 bg-black/30 backdrop-blur-md text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
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
              {outfits.map((outfit) => (
                <Link
                  key={outfit.id}
                  to={`/outfits/${outfit.id}`}
                  className="block group"
                >
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-black/40 hover:border-white/20 transition-all">
                    <h3 className="text-lg font-medium text-white mb-2">{outfit.name}</h3>
                    {outfit.notes && (
                      <p className="text-sm text-white/60 mb-2 tracking-[0.02em]">{outfit.notes}</p>
                    )}
                    <p className="text-xs text-white/50 tracking-[0.05em]">
                      {outfit.clothing_item_ids?.length || 0} items
                    </p>
                    <p className="text-xs text-white/50 mt-1 tracking-[0.05em]">
                      Created {new Date(outfit.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-16 text-center">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">✨</div>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">No Outfits Created Yet</h3>
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 max-w-md mx-auto px-4 tracking-[0.05em]">
                Start creating outfit combinations from your wardrobe items. Mix and match to discover your perfect looks!
              </p>
              <Link
                to="/outfits/create"
                className="inline-block px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 tracking-[0.1em] text-sm"
              >
                Create Your First Outfit
              </Link>
            </div>
          )}

          {/* Feature Cards */}
          <div className="mt-16">
            <h2 className="text-2xl font-light mb-6 text-white">Get Started</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-black/40 hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Mix & Match</h3>
                <p className="text-white/60 text-sm tracking-[0.02em]">
                  Combine items from your wardrobe to create unique outfit combinations
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-black/40 hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Save Favorites</h3>
                <p className="text-white/60 text-sm tracking-[0.02em]">
                  Keep track of your best looks and quickly access them when you need them
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-black/40 hover:border-white/20 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">AI Suggestions</h3>
                <p className="text-white/60 text-sm tracking-[0.02em]">
                  Get smart outfit recommendations based on weather, occasion, and your style
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
