import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageTransition from './components/ui/PageTransition';
import ErrorBoundary from './components/ui/ErrorBoundary';

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
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><ExplorePage /></PageTransition>} />
        <Route path="/creator/:id" element={<PageTransition><CreatorProfilePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><OnboardingPage /></PageTransition>} />
        <Route path="/creator-onboarding" element={<PageTransition><CreatorOnboardingPage /></PageTransition>} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
          <Route path="/user/subscriptions" element={<PageTransition><SubscriptionManagementPage /></PageTransition>} />
          <Route path="/user/settings" element={<Navigate to="/user/settings/profile" replace />} />
          <Route path="/user/settings/profile" element={<PageTransition><ProfileSettingsPage /></PageTransition>} />
          <Route path="/user/settings/delivery" element={<PageTransition><DeliverySettingsPage /></PageTransition>} />
          <Route path="/user/settings/billing" element={<PageTransition><BillingSettingsPage /></PageTransition>} />
          <Route path="/user/settings/security" element={<PageTransition><SecuritySettingsPage /></PageTransition>} />
          <Route path="/user/support" element={<PageTransition><SupportPage /></PageTransition>} />
        </Route>

        {/* Protected Creator Routes */}
        <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
          <Route path="/creator/dashboard" element={<PageTransition><CreatorDashboard /></PageTransition>} />
          <Route path="/creator/editor" element={<PageTransition><CreatorEditor /></PageTransition>} />
          <Route path="/creator/newsletters" element={<PageTransition><CreatorNewsletters /></PageTransition>} />
          <Route path="/creator/subscribers" element={<PageTransition><CreatorSubscribers /></PageTransition>} />
          <Route path="/creator/settings" element={<PageTransition><CreatorSettings /></PageTransition>} />
          <Route path="/creator/support" element={<PageTransition><CreatorSupportPage /></PageTransition>} />
        </Route>
        
         {/* Catch all - 404 */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <AnimatedRoutes />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App
