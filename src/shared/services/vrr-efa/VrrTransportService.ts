import type {
  CommuteSearchParams,
  CommuteWithTimetables,
  Station,
  StationSearchParams,
  StopTimetable,
} from '../../types/transport';
import type { VrrEfaClient } from './VrrEfaClient';
import { VrrEfaClient as DefaultVrrEfaClient } from './VrrEfaClient';
import { parseDepartureResponse } from './parsers/departureMonitor';
import { parseStopFinderResponse } from './parsers/stopFinder';
import {
  extractBoardingStops,
  parseTripResponse,
} from './parsers/tripRequest';

export class VrrTransportService {
  constructor(private readonly client: VrrEfaClient = new DefaultVrrEfaClient()) {}

  async searchStations(params: StationSearchParams): Promise<Station[]> {
    const response = await this.client.stopFinder(params.query.trim());
    return parseStopFinderResponse(response);
  }

  async getCommuteWithTimetables(
    params: CommuteSearchParams,
  ): Promise<CommuteWithTimetables> {
    const departureTime = params.departureTime
      ? new Date(params.departureTime)
      : new Date();

    const tripResponse = await this.client.tripRequest({
      from: params.from.trim(),
      to: params.to.trim(),
      departureTime,
      results: 1,
    });

    const route = parseTripResponse(tripResponse, 0);
    const boardingStops = extractBoardingStops(route);

    const timetables = await Promise.all(
      boardingStops.map(async ({ stop, legIndex, departureTime: at }) => {
        const response = await this.client.departureMonitor({
          stopId: stop.id,
          at,
          limit: 10,
        });

        return {
          stop,
          legIndex,
          departures: parseDepartureResponse(response),
        } satisfies StopTimetable;
      }),
    );

    return { route, timetables };
  }
}

export const vrrTransportService = new VrrTransportService();
