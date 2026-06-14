import type { CommuteLeg, CommuteRoute, Station } from '../../../types/transport';
import type { EfaLeg, EfaLocation, EfaTripResponse } from '../efaTypes';
import { VrrEfaError } from '../efaTypes';
import { asArray, efaDateTimeToIso } from './utils';

export interface BoardingStop {
  stop: Station;
  legIndex: number;
  departureTime: Date;
}

export function parseTripResponse(
  response: EfaTripResponse,
  journeyIndex = 0,
): CommuteRoute {
  const journeys = asArray(response.journeys);

  if (journeys.length === 0) {
    throw new VrrEfaError('No journeys found for this connection');
  }

  const journey = journeys[journeyIndex];
  if (!journey) {
    throw new VrrEfaError(`Journey index ${journeyIndex} is out of range`);
  }

  const legs = asArray(journey.legs).map(parseLeg);

  return {
    id: `journey-${journeyIndex}`,
    durationMinutes: journey.duration ?? sumLegDurations(legs),
    transfers: journey.interchanges ?? countTransfers(legs),
    legs,
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
      departureTime: new Date(leg.departureTime),
    });
  });

  return boardingStops;
}

function parseLeg(leg: EfaLeg): CommuteLeg {
  const isWalk = isWalkLeg(leg);
  const origin = parseStopPoint(leg.origin, 'Origin');
  const destination = parseStopPoint(leg.destination, 'Destination');

  return {
    kind: isWalk ? 'walk' : 'transit',
    line: isWalk ? undefined : formatLine(leg),
    direction: leg.transportation?.destination?.name,
    origin,
    destination,
    departureTime:
      efaDateTimeToIso(leg.origin?.dateTime) ?? new Date().toISOString(),
    arrivalTime:
      efaDateTimeToIso(leg.destination?.dateTime) ?? new Date().toISOString(),
    stopSequence: isWalk
      ? undefined
      : asArray(leg.stopSequence)
          .map((stop) => parseLocation(stop.location))
          .filter((station): station is Station => station != null),
  };
}

function isWalkLeg(leg: EfaLeg): boolean {
  if (leg.footPathInfo) {
    return true;
  }

  const productName = leg.transportation?.product?.name?.toLowerCase() ?? '';
  if (productName.includes('foot') || productName === 'walk') {
    return true;
  }

  return !leg.transportation?.product && !leg.transportation?.line;
}

function formatLine(leg: EfaLeg): string | undefined {
  const product = leg.transportation?.product?.name;
  const line = leg.transportation?.line ?? leg.transportation?.product?.num;

  if (product && line) {
    return `${product} ${line}`.trim();
  }

  return product ?? (line != null ? String(line) : undefined);
}

function parseStopPoint(
  point: EfaLeg['origin'],
  fallbackName: string,
): Station {
  const station = parseLocation(point?.location);
  return (
    station ?? {
      id: fallbackName,
      name: fallbackName,
    }
  );
}

function parseLocation(location?: EfaLocation): Station | undefined {
  if (!location?.id && !location?.name) {
    return undefined;
  }

  const parent = location.parent?.name;
  const name = parent && location.name
    ? `${parent} ${location.name}`
    : (location.name ?? String(location.id));

  return {
    id: String(location.id ?? name),
    name,
  };
}

function sumLegDurations(legs: CommuteLeg[]): number {
  return legs.reduce((total, leg) => {
    const start = new Date(leg.departureTime).getTime();
    const end = new Date(leg.arrivalTime).getTime();
    return total + Math.max(0, Math.round((end - start) / 60_000));
  }, 0);
}

function countTransfers(legs: CommuteLeg[]): number {
  return Math.max(0, legs.filter((leg) => leg.kind === 'transit').length - 1);
}
