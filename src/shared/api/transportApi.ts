import type {
  ConnectionSearchParams,
  ConnectionSearchResult,
  Station,
  StationSearchParams,
} from '../types';

/**
 * Transport API boundary.
 *
 * These functions will initially return mock data for local development,
 * then be replaced with calls to a real public transport provider.
 *
 * Feature-specific query hooks (e.g. `useSearchConnections`) should wrap
 * these functions and live in each feature's `hooks/` folder.
 */

export async function searchConnections(
  params: ConnectionSearchParams,
): Promise<ConnectionSearchResult[]> {
  void params;
  // TODO: Return mock connection results during early development.
  // TODO: Replace with real transport API integration.
  throw new Error('Not implemented');
}

export async function searchStations(
  params: StationSearchParams,
): Promise<Station[]> {
  void params;
  // TODO: Return mock station list during early development.
  // TODO: Replace with real station search endpoint.
  throw new Error('Not implemented');
}
