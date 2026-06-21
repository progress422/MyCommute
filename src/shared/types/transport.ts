export interface Station {
  id: string;
  name: string;
  coord?: [number, number]; // [latitude, longitude]
}

export interface StationSearchParams {
  query: string;
}

export interface CommuteSearchParams {
  from: string;
  to: string;
  /** ISO date-time string for departure. Defaults to now. */
  departureTime?: string;
}

export interface CommuteLeg {
  kind: 'walk' | 'transit';
  line?: string;
  lineLabel?: string;
  productName?: string;
  productClass?: TransportProductClass;
  direction?: string;
  origin: Station;
  destination: Station;
  departureTime: string;
  arrivalTime: string;
  departureTimeEstimated?: string;
  arrivalTimeEstimated?: string;
  delayMinutes?: number;
  platform?: string;
  stopSequence?: Station[];
}

export type TransportProductClass =
  | 'ubahn'
  | 'tram'
  | 'bus'
  | 'train'
  | 'walk'
  | 'other';

export interface TripLineBadge {
  label: string;
  productName: string;
  productClass: TransportProductClass;
}

export interface CommuteOption {
  id: string;
  /** Planned journey start (first leg). */
  departureTime: string;
  /** Planned journey end (last leg). */
  arrivalTime: string;
  /** Real-time journey start when available. */
  departureTimeEstimated?: string;
  /** Real-time journey end when available. */
  arrivalTimeEstimated?: string;
  /** Planned boarding time for the first transit leg. */
  boardingDepartureTime: string;
  /** Real-time boarding time for the first transit leg. */
  boardingDepartureTimeEstimated?: string;
  boardingPlatform?: string;
  direction?: string;
  durationMinutes: number;
  transfers: number;
  delayMinutes?: number;
  lines: TripLineBadge[];
  hasDisruptionInfo: boolean;
  legs: CommuteLeg[];
}

export interface CommuteRoute {
  id: string;
  durationMinutes: number;
  transfers: number;
  legs: CommuteLeg[];
}

export interface Departure {
  line: string;
  direction: string;
  plannedTime: string;
  realTime?: string;
  platform?: string;
  delayMinutes?: number;
  productName?: string;
  productClass?: TransportProductClass;
}

export interface TripSegmentOptions {
  from: Station;
  to: Station;
  legIndex: number;
  options: CommuteOption[];
}

export interface CommuteWithTimetables {
  from: string;
  to: string;
  /** ISO string of the departure time used for the search. */
  departureTime: string;
  options: CommuteOption[];
  route: CommuteRoute;
  segments: TripSegmentOptions[];
}

/** @deprecated Use CommuteSearchParams instead */
export interface ConnectionSearchParams {
  from: string;
  to: string;
  departureTime?: string;
}

/** @deprecated Use CommuteRoute instead */
export interface ConnectionSearchResult {
  id: string;
  summary: string;
  durationMinutes: number;
}

export interface FavoriteRoute {
  id: string;
  label: string;
  from: string;
  to: string;
}

export interface RouteHistoryEntry {
  id: string;
  searchedAt: string;
  from: string;
  to: string;
}

export interface UserSettings {
  departureLocation: string;
  destination: string;
}
