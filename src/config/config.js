/**
 * Configuration globale de l'application ABLENS Ticket System
 * Contient les URLs, paramètres de base de données, JWT et informations de l'app
 */
export const config = {
  // URL de l'API backend - utilise une variable d'environnement ou valeur par défaut
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Configuration de la base de données PostgreSQL (pour référence)
  DATABASE: {
    HOST: 'localhost',
    PORT: 5432,
    NAME: 'ablens_ticket_system',
    USERNAME: 'postgres',
    PASSWORD: 'root'
  },
  
  // Configuration JWT pour l'authentification
  JWT: {
    SECRET: '58b52386831f7d569930363b8ad8e9acc62d8f6dd135888cea32a9a2cb891a6e',
    ACCESS_TOKEN_EXPIRATION: 86400000, // 24h en millisecondes
    REFRESH_TOKEN_EXPIRATION: 172800000 // 48h en millisecondes
  },
  
  // Informations générales de l'application
  APP: {
    NAME: 'ABLENS Ticket System',
    VERSION: '1.0.0'
  }
};
