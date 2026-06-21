import type {
  CommuteSearchParams,
  CommuteWithTimetables,
  CommuteOption,
  Station,
  StationSearchParams,
  TripSegmentOptions,
} from '../../types/transport';
import type { VrrEfaClient } from './VrrEfaClient';
import { VrrEfaClient as DefaultVrrEfaClient } from './VrrEfaClient';
import {
  parseStopFinderResponse,
  resolveBestStopOrThrow,
} from './parsers/stopFinder';
import {
  boardingDepartureTime,
  dedupeTripOptions,
  extractTripSegments,
  parseTripOptions,
  parseTripOptionsLenient,
  parseTripResponse,
  sortTripOptionsByBoarding,
  type TripSegmentRequest,
} from './parsers/tripRequest';
import {
  SEGMENT_TRIP_FETCH_MAX_ATTEMPTS,
  SEGMENT_TRIP_RESULT_COUNT,
} from './tripRequestParams';
import { VrrEfaError } from './efaTypes';

export class VrrTransportService {
  constructor(private readonly client: VrrEfaClient = new DefaultVrrEfaClient()) {}

  async searchStations(params: StationSearchParams): Promise<Station[]> {
    const response = await this.client.stopFinder(params.query.trim());
    return parseStopFinderResponse(response);
  }

  private async resolveStop(query: string): Promise<Station> {
    const response = await this.client.stopFinder(query);
    return resolveBestStopOrThrow(response, query);
  }

  async getCommuteWithTimetables(
    params: CommuteSearchParams,
  ): Promise<CommuteWithTimetables> {
    const from = params.from.trim();
    const to = params.to.trim();
    const departureTime = params.departureTime
      ? new Date(params.departureTime)
      : new Date();

    const [fromStop, toStop] = await Promise.all([
      this.resolveStop(from),
      this.resolveStop(to),
    ]);

    const tripResponse = await this.client.tripRequest({
      fromStopId: fromStop.id,
      toStopId: toStop.id,
      departureTime,
      results: 1,
    });

    const options = parseTripOptions(tripResponse, departureTime);

    if (options.length === 0) {
      throw new VrrEfaError(
        'No upcoming public transport routes found for this departure time',
      );
    }

    const route = parseTripResponse(tripResponse, 0, departureTime);
    const segmentRequests = extractTripSegments(
      fromStop,
      toStop,
      route,
      departureTime,
    );

    const segments = await Promise.all(
      segmentRequests.map(async (segment) => {
        const segmentOptions = await this.fetchSegmentOptions(segment);

        return {
          from: segment.from,
          to: segment.to,
          legIndex: segment.legIndex,
          options: segmentOptions,
        } satisfies TripSegmentOptions;
      }),
    );

    return {
      from,
      to,
      departureTime: departureTime.toISOString(),
      options,
      route,
      segments,
    };
  }

  private async fetchSegmentOptions(
    segment: TripSegmentRequest,
  ): Promise<CommuteOption[]> {
    let options: CommuteOption[] = [];
    let departureTime = segment.departureTime;

    for (
      let attempt = 0;
      attempt < SEGMENT_TRIP_FETCH_MAX_ATTEMPTS &&
      options.length < SEGMENT_TRIP_RESULT_COUNT;
      attempt++
    ) {
      const batch = await this.requestSegmentTripOptions(
        segment.from.id,
        segment.to.id,
        departureTime,
        SEGMENT_TRIP_RESULT_COUNT,
      );

      if (batch.length === 0) {
        break;
      }

      const merged = sortTripOptionsByBoarding(
        dedupeTripOptions([...options, ...batch]),
      );

      if (merged.length === options.length) {
        break;
      }

      options = merged;

      const lastOption = options[options.length - 1];
      if (!lastOption) {
        break;
      }

      const nextDeparture = boardingDepartureTime(lastOption);
      nextDeparture.setSeconds(nextDeparture.getSeconds() + 1);
      departureTime = nextDeparture;
    }

    return options.slice(0, SEGMENT_TRIP_RESULT_COUNT);
  }

  private async requestSegmentTripOptions(
    fromStopId: string,
    toStopId: string,
    departureTime: Date,
    results: number,
  ): Promise<CommuteOption[]> {
    const response = await this.client.tripRequest({
      fromStopId,
      toStopId,
      departureTime,
      results,
    });

    return parseTripOptionsLenient(response);
  }
}

export const vrrTransportService = new VrrTransportService();
