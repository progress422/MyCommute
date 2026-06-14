export class VrrEfaError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'VrrEfaError';
  }
}

export interface EfaDateTime {
  year?: string | number;
  month?: string | number;
  day?: string | number;
  hour?: string | number;
  minute?: string | number;
}

export interface EfaLocation {
  id?: string;
  name?: string;
  type?: string;
  parent?: { name?: string };
  coord?: { x?: number; y?: number };
}

export interface EfaStopPoint {
  location?: EfaLocation;
  dateTime?: EfaDateTime;
  rtDateTime?: EfaDateTime;
  platform?: string;
  rtPlatform?: string;
}

export interface EfaLeg {
  duration?: number;
  dist?: number;
  pathDescription?: string;
  transportation?: {
    product?: { name?: string; num?: string | number };
    destination?: { name?: string };
    line?: string | number;
  };
  origin?: EfaStopPoint;
  destination?: EfaStopPoint;
  stopSequence?: { location?: EfaLocation }[];
  footPathInfo?: unknown;
}

export interface EfaJourney {
  interchanges?: number;
  duration?: number;
  legs?: EfaLeg[];
}

export interface EfaTripResponse {
  journeys?: EfaJourney[];
  error?: { code?: string; text?: string };
}

export interface EfaStopFinderPoint {
  name?: string;
  id?: string | number;
  type?: string;
  parent?: { name?: string };
}

export interface EfaStopFinderResponse {
  stopFinder?: {
    points?: EfaStopFinderPoint | EfaStopFinderPoint[] | { point?: EfaStopFinderPoint | EfaStopFinderPoint[] };
  };
  error?: { code?: string; text?: string };
}

export interface EfaDepartureEntry {
  stopName?: string;
  stopID?: string | number;
  dateTime?: EfaDateTime;
  realDateTime?: EfaDateTime;
  platform?: string;
  rtPlatform?: string;
  servingLine?: {
    lineNumber?: string;
    direction?: string;
    directionTo?: string;
  };
}

export interface EfaDepartureResponse {
  departureList?: EfaDepartureEntry | EfaDepartureEntry[];
  error?: { code?: string; text?: string };
}
