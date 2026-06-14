import type { Departure } from '../../../types/transport';
import type { EfaDepartureEntry, EfaDepartureResponse } from '../efaTypes';
import { asArray, delayMinutes, efaDateTimeToIso } from './utils';

export function parseDepartureResponse(
  response: EfaDepartureResponse,
): Departure[] {
  return asArray(response.departureList).map(parseDepartureEntry);
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
