/**
 * Service API pour communiquer avec le backend Spring Boot
 * Gère toutes les requêtes HTTP vers l'API backend
 */
import { config } from '../config/config';
import data from '../data/data.json';
import { clearTokensOnAuthError } from '../utils/authUtils';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');
  }

  /**
   * Met à jour le token d'authentification depuis le localStorage
   */
  updateToken() {
    this.token = localStorage.getItem('accessToken');
  }

  /**
   * Génère les headers HTTP pour les requêtes authentifiées
   * Inclut le token JWT si disponible
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const currentToken = localStorage.getItem('accessToken');
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    
    return headers;
  }

  /**
   * Gère les réponses HTTP et les erreurs communes
   * Nettoie automatiquement les tokens si le token est expiré (401)
   */
  handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré - nettoyer complètement le localStorage
        clearTokensOnAuthError();
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Authentifie un utilisateur avec le backend
   * @param {Object} credentials - {username, password}
   * @returns {Object} Réponse du serveur avec token JWT
   */
  async login(credentials) {
    try {
      console.log("🌐 Tentative de connexion à:", `${this.baseURL}/auth/login`);
      console.log("📤 Données envoyées:", { username: credentials.username, password: '***' });
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log("📥 Statut de la réponse:", response.status, response.statusText);

      if (!response.ok) {
        console.log("❌ Erreur HTTP:", response.status);
        if (response.status === 401) {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        } else if (response.status === 400) {
          throw new Error('Données de connexion invalides');
        } else if (response.status === 500) {
          throw new Error('Erreur serveur - Veuillez réessayer plus tard');
        } else if (response.status === 0 || response.status === 503) {
          throw new Error('Impossible de se connecter au serveur - Vérifiez que le backend Spring Boot est démarré sur http://localhost:8080');
        } else {
          throw new Error(`Erreur de connexion (${response.status}) - Vérifiez que le backend est démarré`);
        }
      }

      const data = await response.json();
      console.log("📨 Données reçues:", data);
      
      if (data.accessToken) {
        this.token = data.accessToken;
        console.log("🔑 Token stocké dans apiService");
      }
      
      return data;
    } catch (error) {
      console.error("💥 Erreur dans apiService.login:", error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur en invalidant le token côté serveur
   */
  async logout() {
    try {
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch (error) {
      // Ignorer les erreurs de déconnexion
    }
  }

  /**
   * Récupère tous les tickets depuis le backend
   * @returns {Array} Liste des tickets normalisés
   */
  async getTickets() {
    try {
      const response = await fetch(`${this.baseURL}/ticket`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Erreur serveur 500 - Problème de sérialisation JPA');
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const tickets = await response.json();
      
      // Normaliser les données pour s'assurer qu'elles ont la bonne structure
      const normalizedTickets = this.normalizeTickets(tickets);
      
      return normalizedTickets;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tickets: ${error.message}`);
    }
  }

  /**
   * Normalise les données des tickets pour assurer une structure cohérente
   * @param {Array} tickets - Liste des tickets à normaliser
   * @returns {Array} Tickets normalisés avec valeurs par défaut
   */
  normalizeTickets(tickets) {
    if (!Array.isArray(tickets)) {
      return tickets;
    }

    return tickets.map(ticket => {
      // S'assurer que les objets imbriqués existent avec des valeurs par défaut
      const normalizedTicket = {
        id: ticket.id,
        subject: ticket.subject || 'N/A',
        claim: ticket.claim || '',
        orderNumber: ticket.orderNumber || '',
        priority: ticket.priority || 'NORMAL',
        status: ticket.status || 'OPEN',
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        resolvedAt: ticket.resolvedAt,
        type: ticket.type,
        tags: ticket.tags || [],
        // Normaliser les objets imbriqués
        createdBy: ticket.createdBy ? {
          id: ticket.createdBy.id,
          username: ticket.createdBy.username || 'N/A'
        } : { id: 0, username: 'N/A' },
        assignedDepartment: ticket.assignedDepartment ? {
          id: ticket.assignedDepartment.id,
          name: ticket.assignedDepartment.name || 'N/A'
        } : { id: 0, name: 'N/A' },
        assignedAgent: ticket.assignedAgent ? {
          id: ticket.assignedAgent.id,
          username: ticket.assignedAgent.username || 'N/A'
        } : null,
        issue: ticket.issue ? {
          id: ticket.issue.id,
          name: ticket.issue.name || 'N/A'
        } : { id: 0, name: 'N/A' },
        source: ticket.source ? {
          id: ticket.source.id,
          name: ticket.source.name || 'N/A'
        } : { id: 0, name: 'N/A' },
        comments: ticket.comments || [],
        history: ticket.history || []
      };

      return normalizedTicket;
    });
  }



  /**
   * Récupère un ticket spécifique par son ID
   * @param {number} id - ID du ticket à récupérer
   * @returns {Object} Ticket normalisé
   */
  async getTicketById(id) {
    try {
      const response = await fetch(`${this.baseURL}/ticket/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Erreur serveur 500 - L\'endpoint /ticket/{id} nécessite une correction dans le backend');
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else if (response.status === 403) {
          throw new Error('Accès refusé - Vous n\'avez pas les permissions pour voir ce ticket');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const ticket = await response.json();
      
      // Normaliser le ticket
      const normalizedTicket = this.normalizeTickets([ticket])[0];
      
      return normalizedTicket;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du ticket: ${error.message}`);
    }
  }



  /**
   * Crée un nouveau ticket dans le backend
   * @param {Object} ticketData - Données du ticket à créer
   * @returns {Object} Ticket créé
   */
  async createTicket(ticketData) {
    try {
      const response = await fetch(`${this.baseURL}/ticket`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(ticketData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du ticket');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error('Erreur lors de la création du ticket');
    }
  }



  /**
   * Ferme un ticket en changeant son statut
   * @param {number} id - ID du ticket à fermer
   * @returns {Object} Ticket mis à jour
   */
  async closeTicket(id) {
    const response = await fetch(`${this.baseURL}/ticket/${id}/close`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse(response);
  }



  /**
   * Récupère les messages d'un ticket
   * @param {number} ticketId - ID du ticket
   * @returns {Array} Liste des messages
   */
  async getTicketMessages(ticketId) {
    try {
      const response = await fetch(`${this.baseURL}/ticket/${ticketId}/messages`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Si l'endpoint n'existe pas encore, retourner un tableau vide
          return [];
        }
        throw new Error(`Erreur lors de la récupération des messages: ${response.status}`);
      }
      
      const messages = await response.json();
      return messages || [];
    } catch (error) {
      console.warn('Messages non disponibles:', error.message);
      return [];
    }
  }

  /**
   * Envoie un message sur un ticket
   * @param {number} ticketId - ID du ticket
   * @param {string} message - Contenu du message
   * @returns {Object} Message créé
   */
  async sendTicketMessage(ticketId, message) {
    try {
      const response = await fetch(`${this.baseURL}/ticket/${ticketId}/messages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Si l'endpoint n'existe pas encore, simuler une réponse
          return {
            id: Date.now(),
            text: message,
            createdAt: new Date().toISOString(),
            createdBy: {
              username: localStorage.getItem('username') || 'Utilisateur',
              role: localStorage.getItem('userRole') || 'USER',
            },
          };
        }
        throw new Error(`Erreur lors de l'envoi du message: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Envoi de message non disponible:', error.message);
      // Retourner un message simulé en cas d'erreur
      return {
        id: Date.now(),
        text: message,
        createdAt: new Date().toISOString(),
        createdBy: {
          username: localStorage.getItem('username') || 'Utilisateur',
          role: localStorage.getItem('userRole') || 'USER',
        },
      };
    }
  }

  /**
   * Rafraîchit le token JWT d'accès avec le refresh token
   * Nettoie automatiquement les tokens si le refresh échoue
   * @returns {Object} Nouveau token d'accès
   */
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

      if (!response.ok) {
        throw new Error('Échec du refresh token');
      }

      const responseData = await response.json();
      
      if (responseData.accessToken) {
        localStorage.setItem('accessToken', responseData.accessToken);
        this.token = responseData.accessToken;
      }
      
      return responseData;
    } catch (error) {
      // Nettoyer complètement le localStorage en cas d'échec
      clearTokensOnAuthError();
      window.location.href = '/login';
      throw error;
    }
  }

  /**
   * Récupère la liste des types de problèmes depuis les données locales
   * @returns {Array} Liste des problèmes avec ID, nom, description, etc.
   */
  async getIssues() {
    return data.issues.map((issue, index) => ({
      id: index + 1,
      name: issue.name,
      description: issue.description,
      enabled: issue.enabled,
      departmentId: issue.departmentId
    }));
  }

  /**
   * Récupère la liste des sources de tickets depuis les données locales
   * @returns {Array} Liste des sources avec ID, nom, description, type
   */
  async getSources() {
    return data.sources.map((source, index) => ({
      id: index + 1,
      name: source.name,
      description: source.description,
      enabled: source.enabled,
      type: source.type
    }));
  }

  /**
   * Récupère la liste des départements depuis les données locales
   * @returns {Array} Liste des départements avec ID, nom, description
   */
  async getDepartments() {
    return data.departments.map((department, index) => ({
      id: index + 1,
      name: department.name,
      description: department.description,
      enabled: department.enabled === "true" || department.enabled === true
    }));
  }

  /**
   * Récupère la stratégie d'affectation pour un département
   * @param {number} departmentId - ID du département
   * @returns {Object} Stratégie d'affectation avec nom et description
   */
  async getAssignmentStrategy(departmentId) {
    const strategies = {
      1: { strategy: 'ROUND_ROBIN', name: 'Round-Robin', description: 'Affectation alternée entre les agents' },
      2: { strategy: 'LEAST_BUSY', name: 'Least-Busy', description: 'Affectation à l\'agent ayant le moins de tickets' }
    };
    
    return strategies[departmentId] || { strategy: 'ROUND_ROBIN', name: 'Round-Robin', description: 'Stratégie par défaut' };
  }

  /**
   * Met à jour la stratégie d'affectation des tickets
   * @param {string} strategy - Nouvelle stratégie (ROUND_ROBIN, LEAST_BUSY)
   * @returns {boolean} True si la mise à jour réussit
   */
  async updateAssignmentStrategy(strategy) {
    try {
      const response = await fetch(`${this.baseURL}/admin/settings/assignment-strategy`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ value: strategy }),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint de mise à jour de stratégie non disponible');
        } else if (response.status === 500) {
          throw new Error('Erreur serveur 500 - Problème de mise à jour de la stratégie');
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère la liste des rôles utilisateurs depuis le backend
   * @returns {Array} Liste des rôles normalisés
   */
  async getRoles() {
    try {
      const response = await fetch(`${this.baseURL}/roles`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Erreur serveur 500 - Problème de récupération des rôles');
        } else if (response.status === 401) {
          throw new Error('Session expirée - Veuillez vous reconnecter');
        } else {
          throw new Error(`Erreur serveur (${response.status}) - Vérifiez les logs du backend`);
        }
      }
      
      const roles = await response.json();
      
      // Normaliser les données pour s'assurer qu'elles ont la bonne structure
      const normalizedRoles = this.normalizeRoles(roles);
      
      return normalizedRoles;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des rôles: ${error.message}`);
    }
  }

  /**
   * Normalise les données des rôles pour assurer une structure cohérente
   * @param {Array} roles - Liste des rôles à normaliser
   * @returns {Array} Rôles normalisés avec valeurs par défaut
   */
  normalizeRoles(roles) {
    if (!Array.isArray(roles)) {
      return roles;
    }

    return roles.map(role => {
      // S'assurer que tous les champs requis existent avec des valeurs par défaut
      const normalizedRole = {
        id: role.id,
        name: role.name || role.roleName || 'N/A',
        description: role.description || 'Aucune description',
        permissions: role.permissions || role.permissionList || [],
        isDefault: role.isDefault !== undefined ? role.isDefault : false,
        enabled: role.enabled !== undefined ? role.enabled : true
      };

      return normalizedRole;
    });
  }


}

// Instance unique du service API pour toute l'application
const apiService = new ApiService();
export default apiService;
