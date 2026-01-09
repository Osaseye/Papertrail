import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if role doesn't match
    if (user.role === 'creator') return <Navigate to="/creator/dashboard" replace />;
    if (user.role === 'user') return <Navigate to="/user/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
