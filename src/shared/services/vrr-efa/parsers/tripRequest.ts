import type {
  CommuteLeg,
  CommuteOption,
  CommuteRoute,
  Station,
  TripLineBadge,
} from '../../../types/transport';
import type { EfaJourney, EfaLeg, EfaLocation, EfaTripResponse } from '../efaTypes';
import { VrrEfaError } from '../efaTypes';
import {
  asArray,
  delayMinutes,
  formatLocationDisplayName,
  mapProductClass,
  parseEfaTime,
  parseEfaTimePlanned,
  parsePlatform,
  resolveStopId,
} from './utils';

export interface BoardingStop {
  stop: Station;
  legIndex: number;
  departureTime: Date;
}

export interface TripSegmentRequest {
  from: Station;
  to: Station;
  departureTime: Date;
  legIndex: number;
}

export function extractTripSegments(
  fromStop: Station,
  toStop: Station,
  route: CommuteRoute,
  fallbackDepartureTime: Date,
): TripSegmentRequest[] {
  const boardingStops = extractBoardingStops(route);

  if (boardingStops.length === 0) {
    return [
      {
        from: fromStop,
        to: toStop,
        departureTime: fallbackDepartureTime,
        legIndex: 0,
      },
    ];
  }

  return boardingStops.map((board, index) => {
    const transitLeg = route.legs[board.legIndex];
    const isLast = index === boardingStops.length - 1;

    let to: Station;
    if (isLast) {
      to = toStop;
    } else if (transitLeg?.kind === 'transit') {
      to = transitLeg.destination;
    } else {
      to = board.stop;
    }

    return {
      from: index === 0 ? fromStop : board.stop,
      to,
      departureTime: board.departureTime,
      legIndex: board.legIndex,
    };
  });
}

export function sortTripOptionsByBoarding(
  options: CommuteOption[],
): CommuteOption[] {
  return [...options].sort((a, b) => {
    const aTime = new Date(
      a.boardingDepartureTimeEstimated ?? a.boardingDepartureTime,
    ).getTime();
    const bTime = new Date(
      b.boardingDepartureTimeEstimated ?? b.boardingDepartureTime,
    ).getTime();
    return aTime - bTime;
  });
}

export function boardingDepartureTime(option: CommuteOption): Date {
  return new Date(
    option.boardingDepartureTimeEstimated ?? option.boardingDepartureTime,
  );
}

export function dedupeTripOptions(options: CommuteOption[]): CommuteOption[] {
  const seen = new Set<string>();
  const deduped: CommuteOption[] = [];

  for (const option of options) {
    const key = [
      option.boardingDepartureTimeEstimated ?? option.boardingDepartureTime,
      option.lines.map((line) => line.label).join(','),
    ].join('|');

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(option);
  }

  return deduped;
}

export function parseTripOptionsLenient(
  response: EfaTripResponse,
): CommuteOption[] {
  const journeys = asArray(response.journeys);
  if (journeys.length === 0) {
    return [];
  }

  return journeys
    .map((journey, index) => parseJourneyOption(journey, index))
    .filter((option): option is CommuteOption => option != null);
}

export function parseTripOptions(
  response: EfaTripResponse,
  minDepartureTime?: Date,
): CommuteOption[] {
  const options = parseTripOptionsLenient(response);

  if (options.length === 0) {
    throw new VrrEfaError('No journeys found for this connection');
  }

  if (!minDepartureTime) {
    return options;
  }

  return filterOptionsByDeparture(options, minDepartureTime);
}

export function filterOptionsByDeparture(
  options: CommuteOption[],
  minDepartureTime: Date,
): CommuteOption[] {
  const minTime = minDepartureTime.getTime() - 60_000;

  return options.filter((option) => {
    const departure = new Date(
      option.boardingDepartureTimeEstimated ?? option.boardingDepartureTime,
    ).getTime();
    return departure >= minTime;
  });
}

export function parseTripResponse(
  response: EfaTripResponse,
  journeyIndex = 0,
  minDepartureTime?: Date,
): CommuteRoute {
  const options = parseTripOptions(response, minDepartureTime);
  const option = options[journeyIndex];

  if (!option) {
    throw new VrrEfaError(`Journey index ${journeyIndex} is out of range`);
  }

  return {
    id: option.id,
    durationMinutes: option.durationMinutes,
    transfers: option.transfers,
    legs: option.legs,
  };
}

export function extractBoardingStops(route: CommuteRoute): BoardingStop[] {
  const seen = new Set<string>();
  const boardingStops: BoardingStop[] = [];

  route.legs.forEach((leg, legIndex) => {
    if (leg.kind !== 'transit') {
      return;
    }

    if (seen.has(leg.origin.id)) {
      return;
    }

    seen.add(leg.origin.id);
    boardingStops.push({
      stop: leg.origin,
      legIndex,
      departureTime: new Date(leg.departureTimeEstimated ?? leg.departureTime),
    });
  });

  return boardingStops;
}

function parseJourneyOption(
  journey: EfaJourney,
  index: number,
): CommuteOption | null {
  const legs = asArray(journey.legs).map(parseLeg);

  if (legs.length === 0 || legs.every((leg) => leg.kind === 'walk')) {
    return null;
  }

  const transitLegs = legs.filter((leg) => leg.kind === 'transit');
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  if (!firstLeg || !lastLeg) {
    return null;
  }

  const firstTransitLeg = transitLegs[0];
  const departureTimePlanned = firstLeg.departureTime;
  const arrivalTimePlanned = lastLeg.arrivalTime;
  const departureTimeEstimated =
    firstLeg.departureTimeEstimated ?? firstLeg.departureTime;
  const arrivalTimeEstimated =
    lastLeg.arrivalTimeEstimated ?? lastLeg.arrivalTime;
  const boardingDepartureTime =
    firstTransitLeg?.departureTime ?? departureTimePlanned;
  const boardingDepartureTimeEstimated =
    firstTransitLeg?.departureTimeEstimated ?? boardingDepartureTime;
  const legDurationTotal = asArray(journey.legs).reduce(
    (total, leg) => total + (leg.duration ?? 0),
    0,
  );

  const durationMinutes =
    legDurationTotal >= 60
      ? Math.max(1, Math.round(legDurationTotal / 60))
      : journey.duration != null && journey.duration > 0
        ? journey.duration
        : legDurationTotal > 0
          ? legDurationTotal
          : Math.max(
              1,
              Math.round(
                (new Date(arrivalTimeEstimated).getTime() -
                  new Date(departureTimeEstimated).getTime()) /
                  60_000,
              ),
            );

  const hasDisruptionInfo = asArray(journey.legs).some(
    (leg) => asArray(leg.infos).length > 0,
  );

  return {
    id: `journey-${index}`,
    departureTime: departureTimePlanned,
    arrivalTime: arrivalTimePlanned,
    departureTimeEstimated:
      departureTimeEstimated !== departureTimePlanned
        ? departureTimeEstimated
        : undefined,
    arrivalTimeEstimated:
      arrivalTimeEstimated !== arrivalTimePlanned
        ? arrivalTimeEstimated
        : undefined,
    boardingDepartureTime,
    boardingDepartureTimeEstimated:
      boardingDepartureTimeEstimated !== boardingDepartureTime
        ? boardingDepartureTimeEstimated
        : undefined,
    boardingPlatform: firstTransitLeg?.platform,
    direction: firstTransitLeg?.direction,
    durationMinutes,
    transfers: journey.interchanges ?? Math.max(0, transitLegs.length - 1),
    delayMinutes: delayMinutes(
      boardingDepartureTime,
      boardingDepartureTimeEstimated,
    ),
    lines: transitLegs
      .map((leg) => legToBadge(leg))
      .filter((badge): badge is TripLineBadge => badge != null),
    hasDisruptionInfo,
    legs,
  };
}

function parseLeg(leg: EfaLeg): CommuteLeg {
  const isWalk = isWalkLeg(leg);
  const origin = parseStopPoint(leg.origin, 'Origin');
  const destination = parseStopPoint(leg.destination, 'Destination');
  const departurePlanned =
    parseEfaTimePlanned(leg.origin, 'departure') ?? new Date().toISOString();
  const departureEstimated = parseEfaTime(leg.origin, 'departure');
  const arrivalPlanned =
    parseEfaTimePlanned(leg.destination, 'arrival') ?? departurePlanned;
  const arrivalEstimated = parseEfaTime(leg.destination, 'arrival');
  const productClass = mapProductClass(leg.transportation?.product?.class);
  const lineLabel = leg.transportation?.disassembledName ?? leg.transportation?.number;

  return {
    kind: isWalk ? 'walk' : 'transit',
    line: isWalk ? undefined : formatLine(leg),
    lineLabel: lineLabel != null ? String(lineLabel) : undefined,
    productName: leg.transportation?.product?.name,
    productClass,
    direction: leg.transportation?.destination?.name,
    origin,
    destination,
    departureTime: departurePlanned,
    arrivalTime: arrivalPlanned,
    departureTimeEstimated: departureEstimated,
    arrivalTimeEstimated: arrivalEstimated,
    delayMinutes: delayMinutes(departurePlanned, departureEstimated),
    platform: parsePlatform(leg.origin),
    stopSequence: isWalk
      ? undefined
      : asArray(leg.stopSequence)
          .map((stop) => parseLocation(stop))
          .filter((station): station is Station => station != null),
  };
}

function legToBadge(leg: CommuteLeg): TripLineBadge | null {
  if (!leg.lineLabel) {
    return null;
  }

  return {
    label: leg.lineLabel,
    productName: leg.productName ?? 'Transit',
    productClass: leg.productClass ?? 'other',
  };
}

function isWalkLeg(leg: EfaLeg): boolean {
  if (leg.footPathInfo || leg.pathDescriptions?.length) {
    return true;
  }

  const productName = leg.transportation?.product?.name?.toLowerCase() ?? '';
  const productClass = leg.transportation?.product?.class;

  if (productClass === 100 || productName.includes('foot') || productName === 'walk') {
    return true;
  }

  return !leg.transportation?.product && !leg.transportation?.line;
}

function formatLine(leg: EfaLeg): string | undefined {
  if (leg.transportation?.disassembledName) {
    return leg.transportation.disassembledName;
  }

  const product = leg.transportation?.product?.name;
  const line = leg.transportation?.line ?? leg.transportation?.number;

  if (product && line) {
    return `${product} ${line}`.trim();
  }

  return product ?? (line != null ? String(line) : undefined);
}

function parseStopPoint(
  point: EfaLeg['origin'],
  fallbackName: string,
): Station {
  const resolved = point?.location ?? point;
  const station = parseLocation(resolved);
  return (
    station ?? {
      id: fallbackName,
      name: fallbackName,
    }
  );
}

function parseLocation(location?: EfaLocation): Station | undefined {
  const resolved = location?.location ?? location;

  if (!resolved?.id && !resolved?.name) {
    return undefined;
  }

  return {
    id: resolveStopId(resolved),
    name: formatLocationDisplayName(resolved),
  };
}
