import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client instance.
 *
 * Future API queries (e.g. searchConnections, loadFavorites) will use hooks
 * like `useQuery` / `useMutation` defined in feature `api/` or `hooks/` folders.
 * Those hooks call functions from `shared/api/` and are consumed by components.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});
