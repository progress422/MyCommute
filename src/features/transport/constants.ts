export const DEFAULT_COMMUTE_FROM = 'Essen Hauptbahnhof';
export const DEFAULT_COMMUTE_TO = 'Mülheim a.d. Ruhr Feldmann';

/** Fixed set of stations selectable on the Settings page. */
export const STATION_OPTIONS = [
  'Mülheim Hbf, Mülheim a.d. Ruhr',
  'Mülheim a.d. Ruhr Feldmann',
  'Essen Hauptbahnhof',
  'Rüttenscheider Stern, Essen',
] as const;

export type StationOption = (typeof STATION_OPTIONS)[number];
