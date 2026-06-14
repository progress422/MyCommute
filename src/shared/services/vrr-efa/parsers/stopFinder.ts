import type { Station } from '../../../types/transport';
import type { EfaStopFinderResponse } from '../efaTypes';
import { extractStopFinderPoints, formatStationName } from './utils';

export function parseStopFinderResponse(
  response: EfaStopFinderResponse,
): Station[] {
  const points = extractStopFinderPoints(response.stopFinder?.points);

  return points
    .filter((point) => point.id != null)
    .map((point) => ({
      id: String(point.id),
      name: formatStationName(point),
    }));
}
