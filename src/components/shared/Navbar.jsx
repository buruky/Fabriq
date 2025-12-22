import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div className="text-2xl font-bold text-gradient-primary">
              Fabriq
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/wardrobe"
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive('/wardrobe')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Wardrobe
                </Link>
                <Link
                  to="/outfits"
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive('/outfits')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Outfits
                </Link>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive('/profile')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Profile
                </Link>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  Log Out
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-primary rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/wardrobe"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/wardrobe')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wardrobe
              </Link>
              <Link
                to="/outfits"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/outfits')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Outfits
              </Link>
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
