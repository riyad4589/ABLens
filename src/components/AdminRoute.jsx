import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthQuery';
import { Alert, Text, Button } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons-react';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStatus();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === 'ADMIN';
  if (!isAdmin) {
    return (
      <div style={{ 
        background: '#f7f9fb', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Alert
          icon={<IconShieldLock size={16} />}
          title="Accès refusé"
          color="red"
          variant="light"
          style={{ maxWidth: 500 }}
        >
          <Text size="sm" mb={16}>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
            Cette section est réservée aux administrateurs.
          </Text>
          <Button 
            size="sm" 
            onClick={() => window.history.back()}
            style={{ background: '#194898' }}
          >
            Retour
          </Button>
        </Alert>
      </div>
    );
  }
  return children;
}
