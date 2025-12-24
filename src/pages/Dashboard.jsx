import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/background.jpg';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
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

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            {/* Main Title */}
            <h1
              className="text-[clamp(4rem,15vw,12rem)] tracking-tight leading-none mb-8"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: '600',
                letterSpacing: '0.05em',
                color: 'white'
              }}
            >
              FABRIQ.
            </h1>

            {/* Tagline */}
            <p className="text-white/80 text-sm md:text-base tracking-[0.3em] font-light">
              Curate your style, one piece at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
