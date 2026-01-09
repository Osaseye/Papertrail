import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import OnboardingPage from './pages/user/OnboardingPage';
import ExplorePage from './pages/public/ExplorePage';
import CreatorProfilePage from './pages/public/CreatorProfilePage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';

// Creator Pages
import CreatorDashboard from './pages/creator/CreatorDashboard';

// Placeholders for now
const AboutPage = () => <div className="p-10 text-center">About Page (Coming Soon)</div>;
const PricingPage = () => <div className="p-10 text-center">Pricing Page (Coming Soon)</div>;
const CreatorEditor = () => <div className="p-10 text-center">Newsletter Editor (Coming Soon)</div>;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes - No Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/creator/:id" element={<CreatorProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

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
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App
