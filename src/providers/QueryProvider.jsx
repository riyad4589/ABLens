import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache par défaut (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Temps de cache en mémoire (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry automatique en cas d'échec
      retry: 3,
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: true,
      // Refetch automatique quand la connexion reprend
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automatique pour les mutations
      retry: 1,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-left"
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
