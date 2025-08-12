import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { clearTokensOnStartup, clearTokensOnLogout } from '../utils/authUtils';

// Clés de cache pour l'authentification
export const authKeys = {
  all: ['auth'],
  user: () => [...authKeys.all, 'user'],
  login: () => [...authKeys.all, 'login'],
  logout: () => [...authKeys.all, 'logout'],
};

/**
 * Hook pour la connexion utilisateur
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => apiService.login(credentials),
    onSuccess: (response, credentials) => {
      if (response.accessToken) {
        // Stocker les informations utilisateur dans le localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('userRole', response.role || 'USER');
        
        const userData = {
          token: response.accessToken,
          username: credentials.username,
          role: response.role || 'USER',
          isAuthenticated: true,
        };
        
        // Mettre à jour le cache avec les informations utilisateur dans le bon format
        queryClient.setQueryData(authKeys.user(), {
          isAuthenticated: true,
          user: userData,
        });
        
        // Invalider les requêtes qui nécessitent une authentification
        queryClient.invalidateQueries({ queryKey: ['tickets'] });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la connexion:', error);
    },
  });
};

/**
 * Hook pour la déconnexion utilisateur
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      // Nettoyer le localStorage
      clearTokensOnLogout();
      
      // Réinitialiser le cache utilisateur
      queryClient.setQueryData(authKeys.user(), {
        isAuthenticated: false,
        user: null,
      });
      
      // Invalider toutes les requêtes authentifiées
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.clear(); // Vider tout le cache
    },
    onError: (error) => {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, nettoyer côté client
      clearTokensOnLogout();
      queryClient.clear();
    },
  });
};

/**
 * Hook pour vérifier l'état d'authentification
 */
export const useAuthStatus = () => {
  const queryClient = useQueryClient();
  
  // Récupérer l'état d'authentification depuis le cache
  const userData = queryClient.getQueryData(authKeys.user());
  
  // Si pas de données en cache, vérifier le localStorage
  if (!userData) {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    
    // Au démarrage, forcer l'état non authentifié pour rediriger vers login
    // Même si des tokens sont présents, on considère l'utilisateur comme non connecté
    const defaultUser = {
      isAuthenticated: false,
      user: null,
    };
    
    // Nettoyer les tokens au démarrage
    clearTokensOnStartup();
    
    // Mettre en cache l'état non authentifié
    queryClient.setQueryData(authKeys.user(), defaultUser);
    return defaultUser;
  }
  
  // Si on a des données en cache, s'assurer qu'elles ont la bonne structure
  if (userData.isAuthenticated && userData.user) {
    return userData;
  } else if (userData.token) {
    // Ancien format, le convertir
    const convertedUser = {
      isAuthenticated: true,
      user: userData,
    };
    queryClient.setQueryData(authKeys.user(), convertedUser);
    return convertedUser;
  }
  
  return userData;
};
