import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';
import { useMemo } from 'react';

// Clés de cache pour React Query
export const ticketKeys = {
  all: ['tickets'],
  lists: () => [...ticketKeys.all, 'list'],
  list: (filters) => [...ticketKeys.lists(), { filters }],
  details: () => [...ticketKeys.all, 'detail'],
  detail: (id) => [...ticketKeys.details(), id],
};

/**
 * Hook pour récupérer tous les tickets
 */
export const useTickets = () => {
  return useQuery({
    queryKey: ticketKeys.lists(),
    queryFn: () => apiService.getTickets(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer un ticket spécifique par ID
 */
export const useTicketById = (id) => {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => apiService.getTicketById(id),
    enabled: !!id, // Ne s'exécute que si l'ID existe
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour créer un nouveau ticket
 */
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketData) => apiService.createTicket(ticketData),
    onSuccess: (newTicket) => {
      // Invalider et refetch la liste des tickets
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      
      // Ajouter le nouveau ticket au cache
      queryClient.setQueryData(ticketKeys.lists(), (oldData) => {
        if (!oldData) return [newTicket];
        return [newTicket, ...oldData];
      });
      
      // Mettre en cache le nouveau ticket individuellement
      queryClient.setQueryData(ticketKeys.detail(newTicket.id), newTicket);
    },
    onError: (error) => {
      console.error('Erreur lors de la création du ticket:', error);
    },
  });
};

/**
 * Hook pour fermer un ticket
 */
export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => apiService.closeTicket(id),
    onSuccess: (updatedTicket, variables) => {
      // Invalider et refetch la liste des tickets
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      
      // Mettre à jour le ticket dans le cache
      queryClient.setQueryData(ticketKeys.detail(variables.id), updatedTicket);
      
      // Mettre à jour le ticket dans la liste
      queryClient.setQueryData(ticketKeys.lists(), (oldData) => {
        if (!oldData) return [updatedTicket];
        return oldData.map(ticket => 
          ticket.id === variables.id ? updatedTicket : ticket
        );
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la fermeture du ticket:', error);
    },
  });
};



/**
 * Hook pour rafraîchir manuellement les tickets
 */
export const useRefreshTickets = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
  };
};

/**
 * Hook pour récupérer les messages d'un ticket
 */
export const useTicketMessages = (ticketId) => {
  return useQuery({
    queryKey: ['tickets', ticketId, 'messages'],
    queryFn: () => apiService.getTicketMessages(ticketId),
    enabled: !!ticketId,
    staleTime: 30 * 1000, // 30 secondes
  });
};

/**
 * Hook pour envoyer un message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, message }) => apiService.sendTicketMessage(ticketId, message),
    onSuccess: (newMessage, { ticketId }) => {
      // Optimistic update - ajouter le message au cache immédiatement
      queryClient.setQueryData(
        ['tickets', ticketId, 'messages'],
        (oldMessages = []) => [...oldMessages, newMessage]
      );
      
      // Invalider les messages pour forcer un refresh
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'messages'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
    },
  });
};

/**
 * Hook pour ajouter un message au cache (optimistic update)
 */
export const useAddMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, message }) => {
      // Créer un message temporaire
      const tempMessage = {
        id: Date.now(), // ID temporaire
        text: message,
        createdAt: new Date().toISOString(),
        createdBy: {
          username: localStorage.getItem('username') || 'Utilisateur',
          role: localStorage.getItem('userRole') || 'USER',
        },
        isOptimistic: true, // Marquer comme optimiste
      };
      
      // Ajouter au cache immédiatement
      queryClient.setQueryData(
        ['tickets', ticketId, 'messages'],
        (oldMessages = []) => [...oldMessages, tempMessage]
      );
      
      return tempMessage;
    },
  });
};

/**
 * Hook pour générer la timeline d'un ticket basée sur ses données
 */
export const useTicketTimeline = (ticket) => {
  const generateTimeline = () => {
    if (!ticket) return [];
    
    const timeline = [];
    
    // Création du ticket
    if (ticket.createdAt) {
      timeline.push({
        id: 'created',
        text: 'Ticket créé',
        detail: `Créé par ${ticket.createdBy?.username || 'Utilisateur'}`,
        time: new Date(ticket.createdAt).toLocaleString('fr-FR'),
        icon: '📝',
        color: '#2176bd'
      });
    }
    
    // Assignation à un département
    if (ticket.assignedDepartment?.name) {
      timeline.push({
        id: 'assigned',
        text: 'Ticket assigné',
        detail: `Assigné au département ${ticket.assignedDepartment.name}`,
        time: ticket.assignedAt ? new Date(ticket.assignedAt).toLocaleString('fr-FR') : 'Récemment',
        icon: '👥',
        color: '#28a745'
      });
    }
    
    // Changement de statut
    if (ticket.status) {
      const statusText = {
        'OPEN': 'Ticket ouvert',
        'ASSIGNED': 'Ticket assigné',
        'ON_HOLD': 'Ticket en attente',
        'CANCELLED': 'Ticket annulé',
        'RESOLVED': 'Ticket résolu',
        'CLOSED': 'Ticket fermé'
      };
      
      timeline.push({
        id: 'status',
        text: statusText[ticket.status] || `Statut: ${ticket.status}`,
        detail: `Statut actuel: ${ticket.status}`,
        time: ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString('fr-FR') : 'Récemment',
        icon: '🔄',
        color: ticket.status === 'CLOSED' ? '#dc3545' : '#ffc107'
      });
    }
    
    // Priorité définie
    if (ticket.priority && ticket.priority !== 'NORMAL') {
      timeline.push({
        id: 'priority',
        text: `Priorité définie: ${ticket.priority}`,
        detail: `Priorité ${ticket.priority.toLowerCase()}`,
        time: 'Récemment',
        icon: '⚡',
        color: ticket.priority === 'URGENT' ? '#dc3545' : '#fd7e14'
      });
    }
    
    // Tri par date (plus récent en premier)
    return timeline.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateB - dateA;
    });
  };
  
  return useMemo(() => generateTimeline(), [ticket]);
};

/**
 * Hook pour ajouter un événement à la timeline
 */
export const useAddTimelineEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, event }) => {
      // Créer un événement temporaire
      const timelineEvent = {
        id: `event_${Date.now()}`,
        text: event.text,
        detail: event.detail,
        time: new Date().toLocaleString('fr-FR'),
        icon: event.icon || '📝',
        color: event.color || '#2176bd',
        isOptimistic: true,
      };
      
      // Ajouter au cache immédiatement
      queryClient.setQueryData(
        ['tickets', ticketId, 'timeline'],
        (oldEvents = []) => [timelineEvent, ...oldEvents]
      );
      
      return timelineEvent;
    },
  });
};
