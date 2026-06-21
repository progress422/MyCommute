import type { Station } from '../../../types/transport';
import type {
  EfaStopFinderAssignedStop,
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
  const sourceLocations = asArray(locations);

  const ordered = [
    ...sourceLocations.filter((location) => location.isBest),
    ...sourceLocations.filter((location) => !location.isBest),
  ];

  const seen = new Set<string>();

  return ordered
    .flatMap((location) => stationsFromLocation(location))
    .filter((station): station is Station => {
      if (seen.has(station.id)) {
        return false;
      }
      seen.add(station.id);
      return true;
    });
}

function stationsFromLocation(location: EfaStopFinderLocation): Station[] {
  const assignedStops = extractAssignedStops(location.assignedStops)
    .map((stop) => stationFromAssignedStop(stop))
    .filter((station): station is Station => station != null);

  if (assignedStops.length > 0) {
    return assignedStops;
  }

  const locationType = location.type ?? '';
  const supportedType = locationType === 'stop' || locationType === 'coord';

  if (!supportedType || !resolveLocationStopId(location)) {
    return [];
  }

  return [stationFromLocation(location)];
}

function extractAssignedStops(
  assignedStops: EfaStopFinderLocation['assignedStops'],
): EfaStopFinderAssignedStop[] {
  if (!assignedStops) {
    return [];
  }

  if (Array.isArray(assignedStops)) {
    return assignedStops;
  }

  if (
    typeof assignedStops === 'object' &&
    'assignedStop' in assignedStops
  ) {
    const wrapped = assignedStops as {
      assignedStop?: EfaStopFinderAssignedStop | EfaStopFinderAssignedStop[];
    };
    return asArray(wrapped.assignedStop);
  }

  return [assignedStops as EfaStopFinderAssignedStop];
}

function stationFromLocation(location: EfaStopFinderLocation): Station {
  const coord = parseLocationCoord(location.coord);

  return {
    id: resolveLocationStopId(location)!,
    name: formatLocationName(location),
    ...(coord ? { coord } : {}),
  };
}

function stationFromLegacyPoint(point: EfaStopFinderPoint): Station {
  return {
    id: String(point.id),
    name: formatStationName(point),
  };
}

function stationFromAssignedStop(
  stop: EfaStopFinderAssignedStop,
): Station | undefined {
  const id = resolveAssignedStopId(stop);
  if (!id) {
    return undefined;
  }

  const coord = parseLocationCoord(stop.coord);

  return {
    id,
    name: formatAssignedStopName(stop),
    ...(coord ? { coord } : {}),
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

function resolveAssignedStopId(stop: EfaStopFinderAssignedStop): string | undefined {
  const stopId = stop.properties?.stopId ?? stop.id;

  if (stopId == null || stopId === '') {
    return undefined;
  }

  return String(stopId);
}

function formatAssignedStopName(stop: EfaStopFinderAssignedStop): string {
  const parent = stop.parent?.name;
  const name = stop.disassembledName ?? stop.name;

  if (parent && name && !name.startsWith(parent)) {
    return `${parent} ${name}`;
  }

  return name ?? 'Unknown stop';
}

function parseLocationCoord(
  coord: EfaStopFinderLocation['coord'],
): [number, number] | undefined {
  if (!coord) {
    return undefined;
  }

  if (Array.isArray(coord) && coord.length === 2) {
    const lat = Number(coord[0]);
    const lon = Number(coord[1]);
    return Number.isFinite(lat) && Number.isFinite(lon)
      ? [lat, lon]
      : undefined;
  }

  if (typeof coord === 'object') {
    const coordObject = coord as { x?: number; y?: number };
    const lat = Number(coordObject.y);
    const lon = Number(coordObject.x);
    return Number.isFinite(lat) && Number.isFinite(lon)
      ? [lat, lon]
      : undefined;
  }

  return undefined;
}
