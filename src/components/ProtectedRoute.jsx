import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('admin_token');
  const isAdminPath = location.pathname.startsWith('/admin');

  // Redirect to admin login if accessing admin routes without token
  if (isAdminPath && !token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Redirect to regular login if accessing protected non-admin routes without token
  if (!isAdminPath && !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;