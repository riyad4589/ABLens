import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Tentative de récupération des tickets...');
      const data = await apiService.getTickets();
      console.log('Données reçues:', data);
      setTickets(data || []);
      // Si on a des données, pas d'erreur
      if (data && data.length > 0) {
        setError(null);
        console.log(`${data.length} tickets récupérés avec succès`);
      } else {
        console.log('Aucun ticket trouvé dans la base de données');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un ticket par ID
  const fetchTicketById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord l'endpoint backend
      try {
        const ticket = await apiService.getTicketById(id);
        return ticket;
      } catch (backendError) {
        console.warn('⚠️ Endpoint backend échoué, utilisation des données locales:', backendError.message);
        
        // Fallback : chercher dans la liste locale des tickets
        const localTicket = tickets.find(t => t.id === parseInt(id));
        if (localTicket) {
          console.log('✅ Ticket trouvé dans la liste locale:', localTicket);
          return localTicket;
        } else {
          throw new Error(`Ticket avec l'ID ${id} non trouvé dans la liste locale`);
        }
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau ticket
  const createTicket = async (ticketData) => {
    try {
      setLoading(true);
      setError(null);
      const newTicket = await apiService.createTicket(ticketData);
      setTickets(prev => [...prev, newTicket]);
      return newTicket;
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la création du ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fermer un ticket
  const closeTicket = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTicket = await apiService.closeTicket(id);
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? updatedTicket : ticket
      ));
      return updatedTicket;
    } catch (err) {
      setError(err.message);
      console.error(`Erreur lors de la fermeture du ticket ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les tickets au montage du composant
  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchTicketById,
    createTicket,
    closeTicket,
  };
};
