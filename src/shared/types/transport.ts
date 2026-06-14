export interface Station {
  id: string;
  name: string;
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
  direction?: string;
  origin: Station;
  destination: Station;
  departureTime: string;
  arrivalTime: string;
  stopSequence?: Station[];
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
}

export interface StopTimetable {
  stop: Station;
  legIndex: number;
  departures: Departure[];
}

export interface CommuteWithTimetables {
  route: CommuteRoute;
  timetables: StopTimetable[];
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
