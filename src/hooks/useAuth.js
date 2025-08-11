/**
 * Hook personnalisé pour gérer l'authentification des utilisateurs
 * Gère la connexion, déconnexion et vérification du statut d'authentification
 */
import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { clearTokensOnStartup, clearTokensOnLogout } from '../utils/authUtils';

export const useAuth = () => {
  // État de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // Statut d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // État de chargement
  const [loading, setLoading] = useState(true);

  /**
   * Vérifie l'authentification au chargement de l'application
   * Nettoie automatiquement les tokens au démarrage et teste la validité du token JWT
   */
  useEffect(() => {
  const checkAuth = async () => {

    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      setUser({
        token,
        username: localStorage.getItem('username'),
        role: localStorage.getItem('userRole')
      });
    } else {
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
      console.log("🔐 Début de la fonction login dans useAuth");
      setLoading(true);
      
      console.log("📡 Appel de apiService.login...");
      const response = await apiService.login(credentials);
      console.log("📨 Réponse de apiService.login:", response);
      
      if (response.accessToken || response.token) {
        console.log("✅ Token reçu, authentification réussie");
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
        
        console.log("💾 Informations utilisateur stockées dans localStorage");
        return { success: true };
      } else {
        console.log("❌ Pas de token dans la réponse:", response);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("💥 Erreur dans la fonction login:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
      console.log("🏁 Fin de la fonction login");
    }
  };

  /**
   * Déconnecte l'utilisateur et nettoie complètement le localStorage
   */
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      // Ignorer les erreurs de déconnexion
      console.log('Erreur lors de la déconnexion côté serveur:', error.message);
    } finally {
      // Mettre à jour l'état local
      setIsAuthenticated(false);
      setUser(null);
      
      // Nettoyer complètement le localStorage
      clearTokensOnLogout();
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
