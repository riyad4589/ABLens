// Service API pour communiquer avec le backend Spring Boot
import { config } from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');
  }

  // Mettre à jour le token interne
  updateToken() {
    this.token = localStorage.getItem('accessToken');
  }

  // Configuration des headers avec token d'authentification
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Récupérer le token depuis localStorage à chaque appel
    const currentToken = localStorage.getItem('accessToken');
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    
    return headers;
  }

  // Gestion des erreurs
  handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré, rediriger vers login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  // Authentification
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Gestion spécifique des erreurs d'authentification
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        } else if (response.status === 400) {
          throw new Error('Données de connexion invalides');
        } else if (response.status === 500) {
          throw new Error('Erreur serveur - Veuillez réessayer plus tard');
        } else if (response.status === 0 || response.status === 503) {
          throw new Error('Impossible de se connecter au serveur - Vérifiez votre connexion');
        } else {
          throw new Error(`Erreur de connexion (${response.status})`);
        }
      }

      const data = await response.json();
      
      // Mettre à jour le token interne (le stockage localStorage est géré par useAuth)
      if (data.accessToken) {
        this.token = data.accessToken;
        console.log('Token mis à jour:', this.token);
        console.log('Rôle retourné par le backend:', data.role);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      // Le nettoyage localStorage est géré par useAuth
      this.token = null;
    }
  }

  // Tickets
  async getTickets() {
    try {
      const headers = this.getHeaders();
      const url = `${this.baseURL}/ticket`;
      
      console.log('🔍 Tentative de récupération des tickets...');
      console.log('📍 URL:', url);
      console.log('🔑 Headers:', headers);
      console.log('🌐 Base URL:', this.baseURL);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('📡 Statut de la réponse:', response.status);
      console.log('📡 Headers de la réponse:', response.headers);
      
      // Gestion spécifique des erreurs pour les tickets
      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ Endpoint non trouvé (404)');
          console.error('🔍 URL tentée:', url);
          console.error('🔍 Base URL configurée:', this.baseURL);
          throw new Error(`Endpoint non trouvé (404) - URL: ${url}`);
        } else if (response.status === 500) {
          // Essayer de récupérer le message d'erreur du backend
          try {
            const errorData = await response.json();
            throw new Error(`Erreur serveur 500: ${errorData.message || 'Problème de sérialisation JPA - Contactez l\'administrateur'}`);
          } catch (parseError) {
            throw new Error('Erreur serveur 500 - Problème de sérialisation JPA. Le backend nécessite une correction dans TicketRepo');
          }
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else if (response.status === 0) {
          throw new Error('Impossible de se connecter au serveur - Vérifiez que le backend est démarré');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Données reçues:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tickets:', error);
      throw error;
    }
  }

  async getTicketById(id) {
    try {
      const headers = this.getHeaders();
      const url = `${this.baseURL}/ticket/${id}`;
      
      console.log('🔍 Tentative de récupération du ticket...');
      console.log('📍 URL:', url);
      console.log('🔑 Headers:', headers);
      console.log('🆔 ID du ticket:', id);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      
      console.log('📡 Statut de la réponse:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ Ticket non trouvé (404)');
          throw new Error(`Ticket avec l'ID ${id} non trouvé`);
        } else if (response.status === 500) {
          try {
            const errorData = await response.json();
            console.error('❌ Erreur serveur 500:', errorData);
            throw new Error(`Erreur serveur 500: ${errorData.message || 'Problème de sérialisation JPA - L\'endpoint /ticket/{id} nécessite une correction dans le backend'}`);
          } catch (parseError) {
            console.error('❌ Impossible de parser l\'erreur 500');
            throw new Error('Erreur serveur 500 - L\'endpoint /ticket/{id} nécessite une correction dans le backend (TicketController ou TicketService)');
          }
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Vous n\'avez pas les permissions pour voir ce ticket');
        } else if (response.status === 0) {
          throw new Error('Impossible de se connecter au serveur - Vérifiez que le backend est démarré');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Ticket récupéré:', data);
      return data;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération du ticket ${id}:`, error);
      throw error;
    }
  }

  async createTicket(ticketData) {
    try {
      const headers = this.getHeaders();
      const url = `${this.baseURL}/ticket`;
      
      console.log('🔍 Tentative de création de ticket...');
      console.log('📍 URL:', url);
      console.log('🔑 Headers:', headers);
      console.log('📦 Données envoyées:', JSON.stringify(ticketData, null, 2));
      console.log('🌐 Base URL:', this.baseURL);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(ticketData),
      });
      
      console.log('📡 Statut de la réponse:', response.status);
      console.log('📡 Headers de la réponse:', response.headers);
      
      if (!response.ok) {
        if (response.status === 500) {
          try {
            const errorData = await response.json();
            console.error('❌ Erreur serveur 500 détaillée:', errorData);
            console.error('❌ Message d\'erreur:', errorData.message);
            console.error('❌ Erreur complète:', errorData.error);
            console.error('❌ Stack trace:', errorData.trace);
            throw new Error(`Erreur serveur 500: ${errorData.message || errorData.error || 'Problème lors de la création du ticket'}`);
          } catch (parseError) {
            console.error('❌ Impossible de parser l\'erreur 500');
            console.error('❌ Erreur de parsing:', parseError);
            // Essayer de récupérer le texte brut
            try {
              const errorText = await response.text();
              console.error('❌ Texte d\'erreur brut:', errorText);
              throw new Error(`Erreur serveur 500 - Texte brut: ${errorText}`);
            } catch (textError) {
              throw new Error('Erreur serveur 500 - Problème lors de la création du ticket. Vérifiez les logs du backend.');
            }
          }
        } else if (response.status === 400) {
          try {
            const errorData = await response.json();
            console.error('❌ Erreur 400 - Données invalides:', errorData);
            throw new Error(`Données invalides: ${errorData.message || 'Vérifiez les champs requis'}`);
          } catch (parseError) {
            throw new Error('Données invalides - Vérifiez les champs requis');
          }
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Vous n\'avez pas les permissions pour créer un ticket');
        } else if (response.status === 404) {
          throw new Error('Endpoint non trouvé - Vérifiez que l\'endpoint /ticket existe dans le backend');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Ticket créé avec succès:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du ticket:', error);
      console.error('❌ Stack trace:', error.stack);
      throw error;
    }
  }

  async closeTicket(id) {
    try {
      const headers = this.getHeaders();
      const response = await fetch(`${this.baseURL}/ticket/${id}/close`, {
        method: 'PUT',
        headers: headers,
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la fermeture du ticket:', error);
      throw error;
    }
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      const data = await this.handleResponse(response);
      
      if (data.accessToken) {
        this.token = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  // Vérifier la connexion au backend
  async checkBackendConnection() {
    try {
      console.log('Test de connexion au backend:', `${this.baseURL}/auth/login`);
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        }),
      });
      
      console.log('Statut de la réponse:', response.status);
      // Si on reçoit une réponse (même 401), le backend est accessible
      if (response.status === 401 || response.status === 400) {
        console.log('Backend accessible (endpoint auth répond)');
        return true;
      } else if (response.ok) {
        console.log('Backend accessible (connexion réussie)');
        return true;
      } else {
        console.log('Backend non accessible, statut:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Backend non accessible:', error);
      return false;
    }
  }

  // Données de référence pour les formulaires
  async getIssues() {
    try {
      const response = await fetch(`${this.baseURL}/issues`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.warn('⚠️ Endpoint /issues non disponible, utilisation des données par défaut');
        // Retourner les vraies données du backend data.json
        return [
          { id: 1, name: "Erreur Calcule", description: "", enabled: true, departmentId: 1 },
          { id: 2, name: "Défaut teinte", description: "", enabled: true, departmentId: 1 },
          { id: 3, name: "Retard livraison", description: "", enabled: true, departmentId: 1 },
          { id: 4, name: "Erreur saisie", description: "", enabled: true, departmentId: 2 },
          { id: 5, name: "Oublie validation", description: "", enabled: true, departmentId: 1 },
          { id: 6, name: "information erroné", description: "", enabled: true, departmentId: 1 }
        ];
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors de la récupération des problèmes, utilisation des données par défaut:', error);
      // Retourner les vraies données du backend data.json
      return [
        { id: 1, name: "Erreur Calcule", description: "", enabled: true, departmentId: 1 },
        { id: 2, name: "Défaut teinte", description: "", enabled: true, departmentId: 1 },
        { id: 3, name: "Retard livraison", description: "", enabled: true, departmentId: 1 },
        { id: 4, name: "Erreur saisie", description: "", enabled: true, departmentId: 2 },
        { id: 5, name: "Oublie validation", description: "", enabled: true, departmentId: 1 },
        { id: 6, name: "information erroné", description: "", enabled: true, departmentId: 1 }
      ];
    }
  }

  async getSources() {
    try {
      const response = await fetch(`${this.baseURL}/sources`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.warn('⚠️ Endpoint /sources non disponible, utilisation des données par défaut');
        // Retourner les vraies données du backend data.json
        return [
          { id: 1, name: "WhatsApp", description: "Reclamation reçu par WhatsApp", enabled: true, type: "EXTERNAL" },
          { id: 2, name: "Telephone", description: "Reclamation reçu par Telephone", enabled: true, type: "EXTERNAL" },
          { id: 3, name: "Email", description: "Reclamation reçu par Email", enabled: true, type: "EXTERNAL" },
          { id: 4, name: "Commercial", description: "Reclamation reçu a travers commercial", enabled: true, type: "EXTERNAL" },
          { id: 5, name: "Stock", description: "Reclamation reçu a travers service Stock", enabled: true, type: "INTERNAL" },
          { id: 6, name: "Montage", description: "Reclamation reçu a travers service Montage", enabled: true, type: "INTERNAL" }
        ];
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors de la récupération des sources, utilisation des données par défaut:', error);
      // Retourner les vraies données du backend data.json
      return [
        { id: 1, name: "WhatsApp", description: "Reclamation reçu par WhatsApp", enabled: true, type: "EXTERNAL" },
        { id: 2, name: "Telephone", description: "Reclamation reçu par Telephone", enabled: true, type: "EXTERNAL" },
        { id: 3, name: "Email", description: "Reclamation reçu par Email", enabled: true, type: "EXTERNAL" },
        { id: 4, name: "Commercial", description: "Reclamation reçu a travers commercial", enabled: true, type: "EXTERNAL" },
        { id: 5, name: "Stock", description: "Reclamation reçu a travers service Stock", enabled: true, type: "INTERNAL" },
        { id: 6, name: "Montage", description: "Reclamation reçu a travers service Montage", enabled: true, type: "INTERNAL" }
      ];
    }
  }

  async getDepartments() {
    try {
      const response = await fetch(`${this.baseURL}/departments`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.warn('⚠️ Endpoint /departments non disponible, utilisation des données par défaut');
        // Retourner les vraies données du backend data.json
        return [
          { id: 1, name: "Production Team", description: "lens production team", enabled: true },
          { id: 2, name: "Customer Service", description: "customer service team", enabled: true }
        ];
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors de la récupération des départements, utilisation des données par défaut:', error);
      // Retourner les vraies données du backend data.json
      return [
        { id: 1, name: "Production Team", description: "lens production team", enabled: true },
        { id: 2, name: "Customer Service", description: "customer service team", enabled: true }
      ];
    }
  }
}

// Instance singleton
const apiService = new ApiService();
export default apiService;
