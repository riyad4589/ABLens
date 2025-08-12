import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import apiService from '../services/api';

// Clés de cache pour les données de référence
export const referenceKeys = {
  all: ['reference'],
  departments: () => [...referenceKeys.all, 'departments'],
  issues: () => [...referenceKeys.all, 'issues'],
  sources: () => [...referenceKeys.all, 'sources'],
  roles: () => [...referenceKeys.all, 'roles'],
  assignmentStrategy: (departmentId) => [...referenceKeys.all, 'assignmentStrategy', departmentId],
};

/**
 * Hook pour récupérer les départements
 */
export const useDepartments = () => {
  return useQuery({
    queryKey: referenceKeys.departments(),
    queryFn: () => apiService.getDepartments(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook pour récupérer les motifs (issues)
 */
export const useIssues = () => {
  return useQuery({
    queryKey: referenceKeys.issues(),
    queryFn: () => apiService.getIssues(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook pour récupérer les sources
 */
export const useSources = () => {
  return useQuery({
    queryKey: referenceKeys.sources(),
    queryFn: () => apiService.getSources(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook pour récupérer les rôles
 */
export const useRoles = () => {
  return useQuery({
    queryKey: referenceKeys.roles(),
    queryFn: () => apiService.getRoles(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook pour récupérer la stratégie d'affectation d'un département
 */
export const useAssignmentStrategy = (departmentId) => {
  return useQuery({
    queryKey: referenceKeys.assignmentStrategy(departmentId),
    queryFn: () => apiService.getAssignmentStrategy(departmentId),
    enabled: !!departmentId, // Ne s'exécute que si departmentId existe
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook pour mettre à jour la stratégie d'affectation
 */
export const useUpdateAssignmentStrategy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ strategy }) => apiService.updateAssignmentStrategy(strategy),
    onSuccess: (_, variables) => {
      // Invalider toutes les stratégies d'affectation
      queryClient.invalidateQueries({ queryKey: referenceKeys.all });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la stratégie:', error);
    },
  });
};
