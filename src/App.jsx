import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import OnboardingPage from './pages/user/OnboardingPage';
import CreatorOnboardingPage from './pages/creator/CreatorOnboardingPage';
import ExplorePage from './pages/public/ExplorePage';
import CreatorProfilePage from './pages/public/CreatorProfilePage';

import NotFoundPage from './pages/public/NotFoundPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import SubscriptionManagementPage from './pages/user/SubscriptionManagementPage';
import DeliverySettingsPage from './pages/user/DeliverySettingsPage';
import ProfileSettingsPage from './pages/user/ProfileSettingsPage';
import BillingSettingsPage from './pages/user/BillingSettingsPage';
import SecuritySettingsPage from './pages/user/SecuritySettingsPage';
import SupportPage from './pages/user/SupportPage';

// Creator Pages
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorEditor from './pages/creator/CreatorEditor';
import CreatorNewsletters from './pages/creator/CreatorNewsletters';
import CreatorSubscribers from './pages/creator/CreatorSubscribers';
import CreatorSettings from './pages/creator/CreatorSettings';
import CreatorSupportPage from './pages/creator/CreatorSupportPage';

// Placeholders for now
const AboutPage = () => <div className="p-10 text-center">About Page (Coming Soon)</div>;
const PricingPage = () => <div className="p-10 text-center">Pricing Page (Coming Soon)</div>;
// const CreatorEditor = () => <div className="p-10 text-center">Newsletter Editor (Coming Soon)</div>;

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
        <Route path="/creator-onboarding" element={<CreatorOnboardingPage />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/subscriptions" element={<SubscriptionManagementPage />} />
          <Route path="/user/settings" element={<Navigate to="/user/settings/profile" replace />} />
          <Route path="/user/settings/profile" element={<ProfileSettingsPage />} />
          <Route path="/user/settings/delivery" element={<DeliverySettingsPage />} />
          <Route path="/user/settings/billing" element={<BillingSettingsPage />} />
          <Route path="/user/settings/security" element={<SecuritySettingsPage />} />
          <Route path="/user/support" element={<SupportPage />} />
        </Route>

        {/* Protected Creator Routes */}
        <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/editor" element={<CreatorEditor />} />
          <Route path="/creator/newsletters" element={<CreatorNewsletters />} />
          <Route path="/creator/subscribers" element={<CreatorSubscribers />} />
          <Route path="/creator/settings" element={<CreatorSettings />} />
          <Route path="/creator/support" element={<CreatorSupportPage />} />
        </Route>
        
         {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AnimatedRoutes />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
