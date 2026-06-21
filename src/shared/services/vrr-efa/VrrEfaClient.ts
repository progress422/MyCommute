import type {
  EfaDepartureResponse,
  EfaStopFinderResponse,
  EfaTripResponse,
} from './efaTypes';
import { VrrEfaError } from './efaTypes';
import { buildTripRoutingParams } from './tripRequestParams';

const DEFAULT_BASE_URL = '/api/vrr';

export interface TripRequestParams {
  fromStopId: string;
  toStopId: string;
  departureTime?: Date;
  results?: number;
}

export interface DepartureMonitorParams {
  stopId: string;
  at?: Date;
  limit?: number;
}

export class VrrEfaClient {
  private readonly baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_VRR_EFA_BASE_URL ?? DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async stopFinder(query: string): Promise<EfaStopFinderResponse> {
    return this.request<EfaStopFinderResponse>('XML_STOPFINDER_REQUEST', {
      type_sf: 'any',
      name_sf: query,
    });
  }

  async stopFinderByCoords(lat: number, lon: number, limit = 15): Promise<EfaStopFinderResponse> {
    console.log(`VrrEfaClient.stopFinderByCoords: lat=${lat}, lon=${lon}, limit=${limit}`);
    return this.request<EfaStopFinderResponse>('XML_STOPFINDER_REQUEST', {
      convertAddressesITKernel2LocationServer: '1',
      convertCoord2LocationServer: '1',
      convertCrossingsITKernel2LocationServer: '1',
      convertPOIsITKernel2LocationServer: '1',
      convertStopsPTKernel2LocationServer: '1',
      coordOutputFormat: 'WGS84[dd.ddddd]',
      doNotSearchForStops_sf: '1',
      locationInfoActive: '1',
      locationServerActive: '1',
      name_sf: `${lon}:${lat}:WGS84[dd.ddddd]`,
      outputFormat: 'rapidJSON',
      serverInfo: '1',
      type_sf: 'coord',
      version: '11.0.6.72',
      vrrStopFinderMacro: '1',
      limit: String(limit),
      language: 'en',
    });
  }

  async tripRequest(params: TripRequestParams): Promise<EfaTripResponse> {
    const departure = params.departureTime ?? new Date();

    return this.request<EfaTripResponse>('XML_TRIP_REQUEST2', {
      type_origin: 'any',
      name_origin: params.fromStopId,
      type_destination: 'any',
      name_destination: params.toStopId,
      ptOptionsActive: '1',
      itOptionsActive: '1',
      calcNumberOfTrips: String(params.results ?? 3),
      itdTripDateTimeDepArr: 'dep',
      itdDateDay: String(departure.getDate()),
      itdDateMonth: String(departure.getMonth() + 1),
      itdDateYear: String(departure.getFullYear()),
      itdTimeHour: String(departure.getHours()),
      itdTimeMinute: String(departure.getMinutes()),
      ...buildTripRoutingParams(),
    });
  }

  async departureMonitor(
    params: DepartureMonitorParams,
  ): Promise<EfaDepartureResponse> {
    const at = params.at ?? new Date();

    return this.request<EfaDepartureResponse>('XML_DM_REQUEST', {
      type_dm: 'stopId',
      name_dm: params.stopId,
      mode: 'direct',
      limit: String(params.limit ?? 10),
      itdDateDay: String(at.getDate()),
      itdDateMonth: String(at.getMonth() + 1),
      itdDateYear: String(at.getFullYear()),
      itdTimeHour: String(at.getHours()),
      itdTimeMinute: String(at.getMinutes()),
    });
  }

  private commonParams(): Record<string, string> {
    return {
      outputFormat: 'rapidJSON',
      stateless: '1',
      locationServerActive: '1',
      language: 'en',
      useRealtime: '1',
      coordOutputFormat: 'WGS84[dd.ddddd]',
    };
  }

  private buildRequestUrl(endpoint: string): URL {
    const path = `${this.baseUrl}/${endpoint}`;

    if (/^https?:\/\//i.test(this.baseUrl)) {
      return new URL(path);
    }

    return new URL(path, window.location.origin);
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<T> {
    const url = this.buildRequestUrl(endpoint);
    const searchParams = { ...this.commonParams(), ...params };

    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }

    console.log(`VrrEfaClient.request: ${endpoint} with URL:`, url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new VrrEfaError(
        `VRR EFA request failed: ${response.status} ${response.statusText}`,
        String(response.status),
      );
    }

    const text = await response.text();
    let data: T;

    try {
      data = JSON.parse(text) as T;
    } catch {
      throw new VrrEfaError('VRR EFA returned invalid JSON');
    }

    console.log(`VrrEfaClient.request: ${endpoint} response:`, data);

    const errorResponse = data as { error?: { code?: string; text?: string } };
    if (errorResponse.error?.text) {
      throw new VrrEfaError(
        errorResponse.error.text,
        errorResponse.error.code,
      );
    }

    return data;
  }
}
