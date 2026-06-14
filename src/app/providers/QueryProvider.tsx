import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from './query-client';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with TanStack Query context.
 * In Vue terms, this is similar to providing a global data-fetching plugin.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
