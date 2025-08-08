import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      // En mode développement, permettre la connexion normale
      if (process.env.NODE_ENV === 'development') {
        console.log('Mode développement détecté - vérification du localStorage...');
        
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('userRole');
        
        if (token) {
          console.log('Token trouvé dans localStorage:', token ? 'Oui' : 'Non');
          console.log('Username trouvé:', username);
          console.log('Rôle trouvé:', role);
          
          setIsAuthenticated(true);
          setUser({ 
            token,
            username: username || 'Utilisateur',
            role: role || 'USER'
          });
          console.log('Utilisateur authentifié avec token');
        } else {
          console.log('Aucun token trouvé, utilisateur non authentifié');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Nettoyer le localStorage au démarrage de l'application (production)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        
        console.log('localStorage nettoyé au démarrage (production)');
        
        setIsAuthenticated(false);
        setUser(null);
        console.log('Utilisateur non authentifié - localStorage vidé');
      }
      setLoading(false);
    };

    checkAuth();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'username' || e.key === 'userRole') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.accessToken) {
        setIsAuthenticated(true);
        
        // Stocker les informations utilisateur
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('userRole', response.role || 'USER');
        
        setUser({ 
          token: response.accessToken,
          username: credentials.username,
          role: response.role || 'USER'
        });
        
        console.log('Connexion réussie pour:', credentials.username, 'avec rôle:', response.role);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      
      // Nettoyer localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
