import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { auth, db } from '../services/supabase';
import { getWardrobe } from '../util/storage';
import backgroundImage from '../assets/background.jpg';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOutfits: 0,
    itemsByCategory: {}
  });
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: 'HOME', path: '/dashboard' },
    { name: 'WARDROBE', path: '/wardrobe' },
    { name: 'OUTFITS', path: '/outfits' },
    { name: 'PROFILE', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await handleSignOut();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { user: currentUser } = await auth.getCurrentUser();
      setUser(currentUser);

      // Load real stats from wardrobe and outfits
      if (currentUser?.id) {
        const wardrobeItems = await getWardrobe(currentUser.id);
        const { data: outfits } = await db.outfits.getAll(currentUser.id);

        // Calculate items by category
        const itemsByCategory = wardrobeItems.reduce((acc, item) => {
          const category = item.type || 'Other';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalItems: wardrobeItems.length,
          totalOutfits: (outfits || []).length,
          itemsByCategory
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
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
            <div className="w-16 h-16 border-4 border-white/60 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80 tracking-[0.1em] text-sm">Loading your profile...</p>
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
                  className={`block text-sm tracking-[0.2em] transition-all duration-300 hover:text-[#A8B5A4] hover:tracking-[0.3em] relative ${
                    isActive(item.path)
                      ? 'text-[#A8B5A4] font-medium'
                      : 'text-white/60'
                  }`}
                >
                  {isActive(item.path) && (
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A8B5A4] rounded-full"></span>
                  )}
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

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl mb-3 text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>
              Your Profile
            </h1>
            <p className="text-white/60 text-lg tracking-[0.05em]">Manage your account and preferences</p>
          </div>

          {/* User Info Card */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 hover:bg-black/40 hover:border-white/20 transition-all">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-4xl font-light text-white">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-black/30 rounded-full"></div>
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-light text-white mb-1">
                  {user?.user_metadata?.username || 'Fabriq User'}
                </h2>
                <p className="text-white/60 mb-4 tracking-[0.05em]">{user?.email || 'user@example.com'}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs backdrop-blur-sm border border-white/20 tracking-[0.1em]">
                    Free Account
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs backdrop-blur-sm border border-green-500/30 tracking-[0.1em]">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 hover:bg-black/40 hover:border-white/20 transition-all">
            <h3 className="text-2xl font-light mb-6 text-white">Wardrobe Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Total Items */}
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl mb-2">👕</div>
                <p className="text-white/60 text-sm font-medium mb-1 tracking-[0.05em]">Total Items</p>
                <p className="text-3xl font-light text-white">{stats.totalItems}</p>
              </div>

              {/* Total Outfits */}
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-white/60 text-sm font-medium mb-1 tracking-[0.05em]">Total Outfits</p>
                <p className="text-3xl font-light text-white">{stats.totalOutfits}</p>
              </div>

              {/* Member Since */}
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm col-span-2 md:col-span-1">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-white/60 text-sm font-medium mb-1 tracking-[0.05em]">Member Since</p>
                <p className="text-lg font-light text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2024'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 hover:bg-black/40 hover:border-white/20 transition-all">
            <h3 className="text-2xl font-light mb-6 text-white">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/80 backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Edit Profile</p>
                    <p className="text-sm text-white/60 tracking-[0.02em]">Update your name and photo</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full text-left px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/80 backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Change Password</p>
                    <p className="text-sm text-white/60 tracking-[0.02em]">Update your password</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
