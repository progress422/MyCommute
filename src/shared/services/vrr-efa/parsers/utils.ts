import type { EfaDateTime, EfaStopFinderPoint } from '../efaTypes';

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
