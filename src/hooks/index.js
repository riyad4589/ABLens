// Hooks React Query pour les tickets
export {
  useTickets,
  useTicketById,
  useCreateTicket,
  useCloseTicket,
  useRefreshTickets,
  useTicketMessages,
  useSendMessage,
  useAddMessage,
  useTicketTimeline,
  useAddTimelineEvent,
  ticketKeys,
} from './useTicketsQuery';

// Hooks React Query pour l'authentification
export {
  useLogin,
  useLogout,
  useAuthStatus,
  authKeys,
} from './useAuthQuery';

// Hooks React Query pour les données de référence
export {
  useDepartments,
  useIssues,
  useSources,
  useRoles,
  useAssignmentStrategy,
  useUpdateAssignmentStrategy,
  referenceKeys,
} from './useReferenceData';
