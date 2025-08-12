import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthQuery';

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStatus();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
