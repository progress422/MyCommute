/**
 * Shared domain types used across features.
 * Feature-specific types should live in each feature's `types/` folder.
 */

export interface Station {
  id: string;
  name: string;
}

export interface StationSearchParams {
  query: string;
}

export interface ConnectionSearchParams {
  from: string;
  to: string;
  /** ISO date-time string for departure. */
  departureTime?: string;
}

export interface ConnectionSearchResult {
  id: string;
  summary: string;
  durationMinutes: number;
}

export interface UserSettings {
  departureLocation: string;
  destination: string;
}
