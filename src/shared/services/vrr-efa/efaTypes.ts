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
  disassembledName?: string;
  type?: string;
  parent?: EfaLocation;
  properties?: {
    stopId?: string | number;
    platform?: string;
    platformName?: string;
    plannedPlatformName?: string;
    stoppingPointPlanned?: string;
  };
  coord?: number[] | { x?: number; y?: number };
  departureTimePlanned?: string;
  departureTimeEstimated?: string;
  arrivalTimePlanned?: string;
  arrivalTimeEstimated?: string;
  dateTime?: EfaDateTime;
  rtDateTime?: EfaDateTime;
  platform?: string;
  rtPlatform?: string;
  location?: EfaLocation;
}

export interface EfaTransportation {
  disassembledName?: string;
  number?: string;
  name?: string;
  line?: string | number;
  product?: {
    class?: number;
    name?: string;
    iconId?: number;
  };
  destination?: { name?: string };
}

export interface EfaLeg {
  duration?: number;
  dist?: number;
  pathDescription?: string;
  pathDescriptions?: unknown[];
  isRealtimeControlled?: boolean;
  realtimeStatus?: string[];
  transportation?: EfaTransportation;
  origin?: EfaLocation;
  destination?: EfaLocation;
  stopSequence?: EfaLocation[];
  footPathInfo?: unknown;
  infos?: { type?: string; infoLinks?: { title?: string; content?: string }[] }[];
}

export interface EfaJourney {
  interchanges?: number;
  duration?: number;
  rating?: number;
  isAdditional?: boolean;
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

export interface EfaStopFinderLocation {
  id?: string;
  name?: string;
  disassembledName?: string;
  type?: string;
  isBest?: boolean;
  parent?: { name?: string };
  properties?: {
    stopId?: string | number;
  };
}

export interface EfaStopFinderResponse {
  stopFinder?: {
    points?: EfaStopFinderPoint | EfaStopFinderPoint[] | { point?: EfaStopFinderPoint | EfaStopFinderPoint[] };
  };
  locations?: EfaStopFinderLocation | EfaStopFinderLocation[];
  error?: { code?: string; text?: string };
}

export interface EfaStopEvent {
  departureTimePlanned?: string;
  departureTimeEstimated?: string;
  dateTime?: EfaDateTime;
  realDateTime?: EfaDateTime;
  location?: EfaLocation;
  transportation?: EfaTransportation;
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
  stopEvents?: EfaStopEvent | EfaStopEvent[];
  locations?: EfaLocation | EfaLocation[];
  error?: { code?: string; text?: string };
}
