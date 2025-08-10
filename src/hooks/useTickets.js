/**
 * Hook personnalisé pour gérer les tickets
 * Gère la récupération, création, modification et suppression des tickets
 */
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useTickets = () => {
  // Liste des tickets
  const [tickets, setTickets] = useState([]);
  // État de chargement
  const [loading, setLoading] = useState(true);
  // Messages d'erreur
  const [error, setError] = useState(null);

  /**
   * Récupère tous les tickets depuis le backend
   */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getTickets();
      setTickets(data || []);
      
      if (data && data.length > 0) {
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère un ticket spécifique par son ID
   * @param {number} id - ID du ticket à récupérer
   * @returns {Object} Ticket récupéré
   */
  const fetchTicketById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const ticket = await apiService.getTicketById(id);
      return ticket;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crée un nouveau ticket
   * @param {Object} ticketData - Données du ticket à créer
   * @returns {Object} Ticket créé
   */
  const createTicket = async (ticketData) => {
  try {
    setLoading(true);
    setError(null);

    const newTicket = await apiService.createTicket(ticketData);
    // Ajouter le nouveau ticket à la liste locale
    setTickets(prev => [...prev, newTicket]);

    return newTicket;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  /**
   * Ferme un ticket en changeant son statut
   * @param {number} id - ID du ticket à fermer
   * @returns {Object} Ticket mis à jour
   */
  const closeTicket = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTicket = await apiService.closeTicket(id);
      // Mettre à jour le ticket dans la liste locale
      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? updatedTicket : ticket
      ));
      return updatedTicket;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge automatiquement les tickets au montage du composant
   */
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
