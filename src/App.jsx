import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

// Creator Pages
import CreatorDashboard from './pages/creator/CreatorDashboard';

// Placeholders for now
const ExplorePage = () => <div className="p-10 text-center">Explore Page (Coming Soon)</div>;
const AboutPage = () => <div className="p-10 text-center">About Page (Coming Soon)</div>;
const PricingPage = () => <div className="p-10 text-center">Pricing Page (Coming Soon)</div>;
const CreatorEditor = () => <div className="p-10 text-center">Newsletter Editor (Coming Soon)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Protected Creator Routes */}
          <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/editor" element={<CreatorEditor />} />
          </Route>
          
           {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
