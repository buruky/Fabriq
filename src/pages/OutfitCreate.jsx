import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import OutfitCreator from '../components/outfits/OutfitCreator';
import { getWardrobe } from '../util/storage';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/background.jpg';

const OutfitCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user?.id) {
      loadClothingItems();
    }
  }, [user]);

  const loadClothingItems = async () => {
    try {
      const items = await getWardrobe(user.id);
      setClothingItems(items || []);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/outfits');
  };

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

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl mb-8 text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '500' }}>Create New Outfit</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/60 mx-auto mb-4"></div>
              <p className="text-white/80 tracking-[0.1em] text-sm">Loading your wardrobe...</p>
            </div>
          ) : clothingItems.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-16 text-center">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">👔</div>
              <h3 className="text-xl sm:text-2xl font-light text-white mb-2">No Items in Wardrobe</h3>
              <p className="text-sm sm:text-base text-white/60 mb-6 sm:mb-8 max-w-md mx-auto px-4 tracking-[0.05em]">
                You need to add clothing items first before creating an outfit!
              </p>
              <button
                onClick={() => navigate('/wardrobe')}
                className="px-6 py-3 bg-[#A8B5A4] text-white rounded-xl hover:bg-[#8B9688] transition-all shadow-lg shadow-[#A8B5A4]/30 hover:shadow-xl hover:shadow-[#A8B5A4]/40 tracking-[0.1em] text-sm font-semibold"
              >
                Go to Wardrobe
              </button>
            </div>
          ) : (
            <OutfitCreator
              userId={user?.id}
              clothingItems={clothingItems}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitCreate;
