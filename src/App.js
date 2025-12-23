import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

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
import OutfitDetail from './pages/OutfitDetail';
import Profile from './pages/Profile';
import GeneratedOutfit from './pages/GeneratedOutfit';

const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { user, loading, signOut, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await signOut();
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
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wardrobe"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Wardrobe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <OutfitCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <OutfitDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfits"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <Outfits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generated-outfit"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <GeneratedOutfit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
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