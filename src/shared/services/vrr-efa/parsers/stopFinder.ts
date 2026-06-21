import type { Station } from '../../../types/transport';
import type {
  EfaStopFinderLocation,
  EfaStopFinderPoint,
  EfaStopFinderResponse,
} from '../efaTypes';
import { VrrEfaError } from '../efaTypes';
import { asArray, extractStopFinderPoints, formatStationName } from './utils';

export function parseStopFinderResponse(
  response: EfaStopFinderResponse,
): Station[] {
  const fromLocations = parseStopFinderLocations(response.locations);
  if (fromLocations.length > 0) {
    return fromLocations;
  }

  const points = extractStopFinderPoints(response.stopFinder?.points);

  return points
    .filter((point) => point.id != null)
    .map((point) => stationFromLegacyPoint(point));
}

export function resolveBestStop(response: EfaStopFinderResponse): Station | undefined {
  const stops = parseStopFinderResponse(response);
  return stops[0];
}

export function resolveBestStopOrThrow(
  response: EfaStopFinderResponse,
  query: string,
): Station {
  const stop = resolveBestStop(response);

  if (!stop) {
    throw new VrrEfaError(`No stop found for "${query}"`);
  }

  return stop;
}

function parseStopFinderLocations(
  locations: EfaStopFinderResponse['locations'],
): Station[] {
  const stopLocations = asArray(locations).filter(
    (location) => location.type === 'stop' && resolveLocationStopId(location),
  );

  const ordered = [
    ...stopLocations.filter((location) => location.isBest),
    ...stopLocations.filter((location) => !location.isBest),
  ];

  const seen = new Set<string>();

  return ordered
    .map((location) => stationFromLocation(location))
    .filter((station): station is Station => {
      if (seen.has(station.id)) {
        return false;
      }
      seen.add(station.id);
      return true;
    });
}

function stationFromLocation(location: EfaStopFinderLocation): Station {
  return {
    id: resolveLocationStopId(location)!,
    name: formatLocationName(location),
  };
}

function stationFromLegacyPoint(point: EfaStopFinderPoint): Station {
  return {
    id: String(point.id),
    name: formatStationName(point),
  };
}

function resolveLocationStopId(location: EfaStopFinderLocation): string | undefined {
  const stopId = location.properties?.stopId ?? location.id;

  if (stopId == null || stopId === '') {
    return undefined;
  }

  return String(stopId);
}

function formatLocationName(location: EfaStopFinderLocation): string {
  const parent = location.parent?.name;
  const name = location.disassembledName ?? location.name;

  if (parent && name && !name.startsWith(parent)) {
    return `${parent} ${name}`;
  }

  return name ?? 'Unknown stop';
}
