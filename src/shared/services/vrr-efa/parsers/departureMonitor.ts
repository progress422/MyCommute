import type { Departure } from '../../../types/transport';
import type {
  EfaDepartureEntry,
  EfaDepartureResponse,
  EfaStopEvent,
} from '../efaTypes';
import {
  asArray,
  delayMinutes,
  efaDateTimeToIso,
  formatLocationDisplayName,
  mapProductClass,
  parsePlatform,
} from './utils';

export function parseDepartureResponse(
  response: EfaDepartureResponse,
): Departure[] {
  const stopEvents = asArray(response.stopEvents);
  if (stopEvents.length > 0) {
    return stopEvents.map(parseStopEvent);
  }

  return asArray(response.departureList).map(parseDepartureEntry);
}

export function parseDepartureMonitorStopName(
  response: EfaDepartureResponse,
): string | undefined {
  const location = asArray(response.locations)[0];
  if (!location) {
    return undefined;
  }

  return formatLocationDisplayName(location);
}

function parseStopEvent(entry: EfaStopEvent): Departure {
  const plannedTime =
    entry.departureTimePlanned ??
    efaDateTimeToIso(entry.dateTime) ??
    new Date().toISOString();
  const realTime =
    entry.departureTimeEstimated ?? efaDateTimeToIso(entry.realDateTime);
  const transportation = entry.transportation;
  const line =
    transportation?.disassembledName ??
    transportation?.number ??
    transportation?.name ??
    '—';
  const direction = transportation?.destination?.name ?? '—';
  const productClass = mapProductClass(transportation?.product?.class);

  return {
    line: String(line),
    direction,
    plannedTime,
    realTime,
    platform: parsePlatform(entry.location),
    delayMinutes: delayMinutes(plannedTime, realTime),
    productName: transportation?.product?.name,
    productClass: productClass === 'walk' ? 'other' : productClass,
  };
}

function parseDepartureEntry(entry: EfaDepartureEntry): Departure {
  const plannedTime =
    efaDateTimeToIso(entry.dateTime) ?? new Date().toISOString();
  const realTime = efaDateTimeToIso(entry.realDateTime);
  const line = entry.servingLine?.lineNumber ?? '—';
  const direction =
    entry.servingLine?.directionTo ??
    entry.servingLine?.direction ??
    '—';

  return {
    line,
    direction,
    plannedTime,
    realTime,
    platform: entry.rtPlatform ?? entry.platform,
    delayMinutes: delayMinutes(plannedTime, realTime),
  };
}
