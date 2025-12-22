import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Navbar from './components/shared/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import OutfitCreate from './pages/OutfitCreate';
import Profile from './pages/Profile';
import GeneratedOutfit from './pages/GeneratedOutfit';

// Auth (will integrate with Supabase later)
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  // TODO: Replace with actual Supabase auth check
  // For now, we'll allow access to see the design
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    // TODO: Implement Supabase logout
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-neutral-background">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wardrobe"
            element={
              <ProtectedRoute>
                <Wardrobe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits"
            element={
              <ProtectedRoute>
                <Outfits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits/create"
            element={
              <ProtectedRoute>
                <OutfitCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generated-outfit"
            element={
              <ProtectedRoute>
                <GeneratedOutfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;