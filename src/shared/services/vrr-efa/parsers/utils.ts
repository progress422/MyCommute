import type { EfaDateTime, EfaLocation, EfaStopFinderPoint } from '../efaTypes';
import type { TransportProductClass } from '../../../types/transport';

export function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function efaDateTimeToIso(dateTime?: EfaDateTime): string | undefined {
  if (!dateTime) {
    return undefined;
  }

  const year = Number(dateTime.year);
  const month = Number(dateTime.month);
  const day = Number(dateTime.day);
  const hour = Number(dateTime.hour ?? 0);
  const minute = Number(dateTime.minute ?? 0);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day, hour, minute);
  return date.toISOString();
}

export function parseEfaTime(
  point?: EfaLocation,
  kind: 'departure' | 'arrival' = 'departure',
  useEstimated = false,
): string | undefined {
  if (!point) {
    return undefined;
  }

  const plannedKey =
    kind === 'departure' ? 'departureTimePlanned' : 'arrivalTimePlanned';
  const estimatedKey =
    kind === 'departure' ? 'departureTimeEstimated' : 'arrivalTimeEstimated';

  if (useEstimated && point[estimatedKey]) {
    return point[estimatedKey];
  }

  if (point[estimatedKey]) {
    return point[estimatedKey];
  }

  if (point[plannedKey]) {
    return point[plannedKey];
  }

  const legacy = kind === 'departure' ? point.dateTime : undefined;
  return efaDateTimeToIso(legacy ?? point.dateTime);
}

export function parseEfaTimePlanned(
  point?: EfaLocation,
  kind: 'departure' | 'arrival' = 'departure',
): string | undefined {
  if (!point) {
    return undefined;
  }

  const plannedKey =
    kind === 'departure' ? 'departureTimePlanned' : 'arrivalTimePlanned';

  if (point[plannedKey]) {
    return point[plannedKey];
  }

  return efaDateTimeToIso(point.dateTime);
}

export function delayMinutes(
  planned?: string,
  real?: string,
): number | undefined {
  if (!planned || !real) {
    return undefined;
  }

  const diff = Math.round(
    (new Date(real).getTime() - new Date(planned).getTime()) / 60_000,
  );
  return diff === 0 ? undefined : diff;
}

export function secondsToMinutes(seconds?: number): number | undefined {
  if (seconds == null) {
    return undefined;
  }
  return Math.max(1, Math.round(seconds / 60));
}

export function extractStopFinderPoints(
  points: unknown,
): EfaStopFinderPoint[] {
  if (!points || typeof points !== 'object') {
    return [];
  }

  const record = points as Record<string, unknown>;

  if ('point' in record) {
    return asArray(record.point as EfaStopFinderPoint | EfaStopFinderPoint[]);
  }

  return asArray(points as EfaStopFinderPoint | EfaStopFinderPoint[]);
}

export function formatStationName(point: EfaStopFinderPoint): string {
  const parent = point.parent?.name;
  if (parent && point.name) {
    return `${parent} ${point.name}`;
  }
  return point.name ?? 'Unknown stop';
}

export function formatLocationDisplayName(location?: EfaLocation): string {
  if (!location) {
    return 'Unknown stop';
  }

  const stop = location.parent?.type === 'stop' ? location.parent : location;
  const stopName =
    stop.disassembledName ??
    stop.name?.replace(/^Essen,?\s*/i, '').replace(/^Essen\s+/i, '') ??
    stop.name ??
    'Unknown stop';
  const locality =
    stop.parent?.name ??
    location.parent?.parent?.name ??
    extractLocalityFromName(location.name);

  if (locality && !stopName.includes(locality)) {
    return `${stopName}, ${locality}`;
  }

  return stopName;
}

function extractLocalityFromName(name?: string): string | undefined {
  if (!name?.includes(',')) {
    return undefined;
  }
  return name.split(',').pop()?.trim();
}

export function resolveStopId(location?: EfaLocation): string {
  const stop = location?.parent?.properties?.stopId
    ? location.parent
    : location?.properties?.stopId
      ? location
      : location?.parent;

  const stopId =
    stop?.properties?.stopId ??
    location?.parent?.properties?.stopId ??
    location?.properties?.stopId ??
    location?.id;

  return String(stopId ?? formatLocationDisplayName(location));
}

export function parsePlatform(point?: EfaLocation): string | undefined {
  if (!point) {
    return undefined;
  }

  const properties = point.properties;

  if (properties?.platformName) {
    return properties.platformName;
  }

  if (properties?.plannedPlatformName) {
    return properties.plannedPlatformName;
  }

  if (properties?.stoppingPointPlanned) {
    return properties.stoppingPointPlanned;
  }

  if (properties?.platform) {
    return properties.platform.startsWith('Gleis')
      ? properties.platform
      : `Gleis ${properties.platform}`;
  }

  if (point.rtPlatform) {
    return point.rtPlatform;
  }

  if (point.platform) {
    return point.platform;
  }

  const name = point.disassembledName;
  if (name && (/^gleis/i.test(name) || /^\d/.test(name))) {
    return name;
  }

  return undefined;
}

export function mapProductClass(classId?: number): TransportProductClass {
  switch (classId) {
    case 2:
      return 'ubahn';
    case 4:
      return 'tram';
    case 5:
    case 6:
    case 7:
    case 8:
      return 'bus';
    case 0:
    case 1:
    case 13:
    case 15:
    case 16:
      return 'train';
    case 100:
      return 'walk';
    default:
      return 'other';
  }
}
