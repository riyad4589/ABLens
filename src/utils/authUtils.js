/**
 * Utilitaires pour la gestion de l'authentification
 * Centralise les fonctions de nettoyage des tokens et données de session
 */

/**
 * Nettoie complètement tous les tokens et données d'authentification du localStorage
 * @param {string} reason - Raison du nettoyage (pour les logs)
 */
export const clearAllAuthTokens = (reason = 'Nettoyage manuel') => {
  // Liste complète des clés à supprimer
  const authKeys = [
    'accessToken',
    'refreshToken', 
    'username',
    'userRole',
    'user',
    'auth',
    'session',
    'token',
    'jwt',
    'loginData'
  ];

  // Supprimer chaque clé
  authKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  // Supprimer aussi les clés de session storage
  authKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });

  console.log(`🔐 Tokens d'authentification nettoyés: ${reason}`);
};

/**
 * Vérifie si des tokens d'authentification sont présents dans le localStorage
 * @returns {boolean} True si des tokens sont présents
 */
export const hasAuthTokens = () => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return !!(token || refreshToken);
};

/**
 * Nettoie automatiquement les tokens au démarrage de l'application
 * Appelé au chargement de l'app pour s'assurer qu'aucun token persistant n'existe
 * Force la redirection vers la page de login
 */
export const clearTokensOnStartup = () => {
  clearAllAuthTokens('Démarrage du serveur - Redirection vers login');
  console.log('🔄 Application redirigée vers la page de login au démarrage');
};

/**
 * Nettoie les tokens lors de la déconnexion
 * Appelé quand l'utilisateur se déconnecte manuellement
 */
export const clearTokensOnLogout = () => {
  clearAllAuthTokens('Déconnexion utilisateur');
};

/**
 * Nettoie les tokens lors d'une erreur d'authentification
 * Appelé quand une requête retourne 401 ou autre erreur d'auth
 */
export const clearTokensOnAuthError = () => {
  clearAllAuthTokens('Erreur d\'authentification');
};
