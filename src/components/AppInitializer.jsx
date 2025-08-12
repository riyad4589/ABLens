import React, { useEffect } from 'react';
import { clearTokensOnStartup } from '../utils/authUtils';

/**
 * Composant d'initialisation de l'application
 * S'assure que l'utilisateur est toujours redirigé vers la page de login au démarrage
 */
export default function AppInitializer({ children }) {
  useEffect(() => {
    // Nettoyer les tokens au montage du composant
    clearTokensOnStartup();
    
    // Vérifier si on est sur une route protégée et rediriger si nécessaire
    const currentPath = window.location.pathname;
    const publicRoutes = ['/', '/login'];
    
    if (!publicRoutes.includes(currentPath)) {
      // Si on n'est pas sur une route publique, rediriger vers login
      window.location.href = '/login';
    }
  }, []);

  return <>{children}</>;
}
