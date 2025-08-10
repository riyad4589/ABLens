/**
 * Hook personnalisé pour gérer l'authentification des utilisateurs
 * Gère la connexion, déconnexion et vérification du statut d'authentification
 */
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAuth = () => {
  // État de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // Statut d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // État de chargement
  const [loading, setLoading] = useState(true);

  /**
   * Vérifie l'authentification au chargement de l'application
   * Teste la validité du token JWT stocké dans le localStorage
   */
  useEffect(() => {
    const checkAuth = async () => {
      // Récupérer les informations d'authentification du localStorage
      const token = localStorage.getItem('accessToken');
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('userRole');
      
      if (token) {
        // Vérifier si le token est encore valide en testant un endpoint
        try {
          const testResponse = await fetch('http://localhost:8080/api/ticket', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (testResponse.ok) {
            // Token valide - authentifier l'utilisateur
            setIsAuthenticated(true);
            setUser({ 
              token,
              username: username || 'Utilisateur',
              role: role || 'USER'
            });
          } else {
            // Token invalide - nettoyer le localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          // Erreur de connexion - déconnecter l'utilisateur
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Aucun token - utilisateur non authentifié
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
    
    // Écouter les changements dans localStorage pour synchroniser l'état
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'username' || e.key === 'userRole') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Authentifie un utilisateur avec le backend
   * @param {Object} credentials - {username, password}
   * @returns {Object} {success: boolean, message?: string}
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.accessToken) {
        // Connexion réussie - mettre à jour l'état et le localStorage
        setIsAuthenticated(true);
        
        // Stocker les informations utilisateur dans le localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('userRole', response.role || 'USER');
        
        setUser({ 
          token: response.accessToken,
          username: credentials.username,
          role: response.role || 'USER'
        });
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur et nettoie le localStorage
   */
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Ignorer les erreurs de déconnexion
    } finally {
      // Mettre à jour l'état local
      setIsAuthenticated(false);
      setUser(null);
      
      // Nettoyer le localStorage
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
