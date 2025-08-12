import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthQuery';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStatus();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
