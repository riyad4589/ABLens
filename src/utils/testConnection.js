// Utilitaire pour tester la connexion au backend
// Utilisé pour diagnostiquer les problèmes de connectivité

import apiService from '../services/api';

export async function testBackendConnection() {
  const results = {
    auth: '❌ Erreur',
    tickets: '❌ Erreur',
    ticketWithToken: '❌ Erreur',
    ticketById: '❌ Erreur'
  };

  try {
    // Test endpoint auth
    console.log('🔍 Test endpoint auth...');
    const authResponse = await fetch(`${apiService.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin1234' })
    });
    results.auth = authResponse.ok ? '✅ OK' : `❌ Erreur ${authResponse.status}`;
    console.log('Auth endpoint:', results.auth);

    if (authResponse.ok) {
      const authData = await authResponse.json();
      const token = authData.accessToken;
      
      // Test endpoint tickets avec token
      console.log('🔍 Test endpoint tickets avec token...');
      const ticketsResponse = await fetch(`${apiService.baseURL}/ticket`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      results.ticketWithToken = ticketsResponse.ok ? '✅ OK' : `❌ Erreur ${ticketsResponse.status}`;
      console.log('Tickets avec token:', results.ticketWithToken);

      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json();
        if (ticketsData.length > 0) {
          const firstTicketId = ticketsData[0].id;
          console.log('🔍 Test endpoint ticket by ID...');
          console.log('🆔 ID du premier ticket:', firstTicketId);
          
          const ticketByIdResponse = await fetch(`${apiService.baseURL}/ticket/${firstTicketId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          results.ticketById = ticketByIdResponse.ok ? '✅ OK' : `❌ Erreur ${ticketByIdResponse.status}`;
          console.log('Ticket by ID:', results.ticketById);
          
          if (!ticketByIdResponse.ok) {
            try {
              const errorData = await ticketByIdResponse.text();
              console.error('❌ Détails de l\'erreur ticket by ID:', errorData);
            } catch (e) {
              console.error('❌ Impossible de lire l\'erreur');
            }
          }
        } else {
          results.ticketById = '⚠️ Aucun ticket disponible pour le test';
        }
      }
    }

    // Test endpoint tickets sans token
    console.log('🔍 Test endpoint tickets sans token...');
    const ticketsNoAuthResponse = await fetch(`${apiService.baseURL}/ticket`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    results.tickets = ticketsNoAuthResponse.ok ? '✅ OK' : `❌ Erreur ${ticketsNoAuthResponse.status}`;
    console.log('Tickets sans token:', results.tickets);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }

  return results;
}

// Fonction pour tester un endpoint spécifique
export const testEndpoint = async (endpoint) => {
  const baseURL = config.API_BASE_URL;
  const url = `${baseURL}${endpoint}`;
  
  console.log(`🔍 Test de l'endpoint: ${endpoint}`);
  console.log(`📍 URL complète: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`📡 Statut: ${response.status}`);
    console.log(`📡 Headers:`, response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Données reçues:', data);
      return { success: true, data };
    } else {
      console.log('❌ Erreur:', response.status, response.statusText);
      return { success: false, status: response.status, statusText: response.statusText };
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return { success: false, error: error.message };
  }
};
