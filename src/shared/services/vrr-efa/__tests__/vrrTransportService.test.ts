import { describe, expect, it, vi } from 'vitest';
import stopfinderFixture from './fixtures/stopfinder.json';
import stopfinderLocationsFixture from './fixtures/stopfinder-locations.json';
import departuresFixture from './fixtures/departures.json';
import departuresStopEventsFixture from './fixtures/departures-stop-events.json';
import tripFixture from './fixtures/trip.json';
import essenTripFixture from './fixtures/essen-trip.json';
import { parseStopFinderResponse, resolveBestStop } from '../parsers/stopFinder';
import { parseDepartureResponse, parseDepartureMonitorStopName } from '../parsers/departureMonitor';
import {
  dedupeTripOptions,
  extractBoardingStops,
  extractTripSegments,
  parseTripOptions,
  parseTripOptionsLenient,
  parseTripResponse,
} from '../parsers/tripRequest';
import type { EfaDepartureResponse, EfaStopFinderResponse, EfaTripResponse } from '../efaTypes';
import { VrrTransportService } from '../VrrTransportService';
import type { VrrEfaClient } from '../VrrEfaClient';

describe('parseStopFinderResponse', () => {
  it('maps stop finder points to stations', () => {
    const stations = parseStopFinderResponse(
      stopfinderFixture as EfaStopFinderResponse,
    );

    expect(stations).toEqual([
      { id: '20018235', name: 'Düsseldorf Hbf' },
    ]);
  });

  it('maps rapidJSON locations using provider stop IDs', () => {
    const stations = parseStopFinderResponse(
      stopfinderLocationsFixture as EfaStopFinderResponse,
    );

    expect(stations).toEqual([
      { id: '20009530', name: 'Essen Rüttenscheider Stern' },
    ]);
  });

  it('prefers the best stop match', () => {
    const stop = resolveBestStop(
      stopfinderLocationsFixture as EfaStopFinderResponse,
    );

    expect(stop).toEqual({
      id: '20009530',
      name: 'Essen Rüttenscheider Stern',
    });
  });
});

describe('parseTripResponse', () => {
  it('parses legacy journey legs and classifies walk vs transit', () => {
    const route = parseTripResponse(tripFixture as EfaTripResponse);

    expect(route.durationMinutes).toBe(52);
    expect(route.transfers).toBe(1);
    expect(route.legs).toHaveLength(3);
    expect(route.legs[0]?.kind).toBe('transit');
    expect(route.legs[1]?.kind).toBe('walk');
    expect(route.legs[2]?.kind).toBe('transit');
    expect(route.legs[0]?.line).toBe('RE 1');
  });

  it('parses rapidJSON journey options like the VRR app', () => {
    const options = parseTripOptions(essenTripFixture as EfaTripResponse);

    expect(options).toHaveLength(2);
    expect(options[0]?.lines[0]?.label).toBe('U11');
    expect(options[0]?.lines[0]?.productClass).toBe('ubahn');
    expect(options[0]?.durationMinutes).toBe(3);
    expect(options[0]?.delayMinutes).toBe(1);
    expect(options[0]?.hasDisruptionInfo).toBe(true);
    expect(options[0]?.boardingPlatform).toBe('Gleis 1a');
    expect(options[0]?.direction).toBe('Gelsenkirchen Buerer Str.');
    expect(options[0]?.boardingDepartureTimeEstimated).toBeDefined();
    expect(options[1]?.lines[0]?.label).toBe('106');
    expect(options[1]?.lines[0]?.productClass).toBe('tram');
    expect(options[1]?.boardingPlatform).toBe('Gleis 2');
    expect(options[1]?.direction).toBe('Essen Altenessen Bf');
  });

  it('filters out journeys that depart before the requested time', () => {
    const allOptions = parseTripOptions(essenTripFixture as EfaTripResponse);
    const laterOptions = parseTripOptions(
      essenTripFixture as EfaTripResponse,
      new Date('2026-06-21T07:00:00Z'),
    );

    expect(allOptions.length).toBeGreaterThan(laterOptions.length);
    expect(laterOptions).toHaveLength(0);
  });

  it('extracts unique boarding stops using VRR stop IDs', () => {
    const route = parseTripResponse(essenTripFixture as EfaTripResponse);
    const boardingStops = extractBoardingStops(route);

    expect(boardingStops).toHaveLength(1);
    expect(boardingStops[0]?.stop.id).toBe('20009530');
  });

  it('builds trip segments for each leg of the journey', () => {
    const route = parseTripResponse(tripFixture as EfaTripResponse);
    const segments = extractTripSegments(
      { id: '20018235', name: 'Düsseldorf Hbf' },
      { id: '20002011', name: 'Essen Hbf' },
      route,
      new Date('2026-06-14T08:00:00Z'),
    );

    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({
      from: { id: '20018235', name: 'Düsseldorf Hbf' },
      to: { id: '20001012' },
      legIndex: 0,
    });
    expect(segments[1]).toMatchObject({
      from: { id: '20001012' },
      to: { id: '20002011', name: 'Essen Hbf' },
      legIndex: 2,
    });
  });

  it('dedupes segment options by boarding time and line', () => {
    const option = parseTripOptions(tripFixture as EfaTripResponse)[0];
    expect(option).toBeDefined();

    const deduped = dedupeTripOptions([option!, option!]);
    expect(deduped).toHaveLength(1);
  });

  it('returns all API journeys for segment requests without departure filtering', () => {
    const filtered = parseTripOptions(
      tripFixture as EfaTripResponse,
      new Date('2026-06-14T08:30:00Z'),
    );
    const lenient = parseTripOptionsLenient(tripFixture as EfaTripResponse);

    expect(lenient.length).toBeGreaterThanOrEqual(filtered.length);
  });
});

describe('parseDepartureResponse', () => {
  it('maps legacy departureList entries with delay information', () => {
    const departures = parseDepartureResponse(
      departuresFixture as EfaDepartureResponse,
    );

    expect(departures).toHaveLength(2);
    expect(departures[0]?.line).toBe('RE1');
    expect(departures[0]?.delayMinutes).toBe(2);
    expect(departures[1]?.delayMinutes).toBeUndefined();
  });

  it('maps rapidJSON stopEvents from departure monitor', () => {
    const departures = parseDepartureResponse(
      departuresStopEventsFixture as EfaDepartureResponse,
    );

    expect(departures).toHaveLength(2);
    expect(departures[0]?.line).toBe('106');
    expect(departures[0]?.productClass).toBe('tram');
    expect(departures[0]?.platform).toBe('2');
    expect(departures[0]?.delayMinutes).toBe(2);
    expect(departures[1]?.line).toBe('U11');
    expect(departures[1]?.productClass).toBe('ubahn');
    expect(departures[1]?.platform).toBe('Gleis 1b');
  });

  it('reads the stop name from departure monitor locations', () => {
    expect(
      parseDepartureMonitorStopName(
        departuresStopEventsFixture as EfaDepartureResponse,
      ),
    ).toBe('Rüttenscheider Stern, Essen');
  });
});

describe('VrrTransportService', () => {
  it('fetches segment trip options instead of departure monitor boards', async () => {
    const tripSpy = vi.fn().mockResolvedValue(tripFixture);
    const stopFinderSpy = vi
      .fn()
      .mockResolvedValueOnce(stopfinderLocationsFixture)
      .mockResolvedValueOnce({
        locations: [
          {
            id: 'de:05117:15225',
            name: 'Mülheim (Ruhr) Hbf',
            disassembledName: 'Hbf',
            type: 'stop',
            isBest: true,
            parent: { name: 'Mülheim (Ruhr)' },
            properties: { stopId: '20015225' },
          },
        ],
      });

    const client = {
      stopFinder: stopFinderSpy,
      tripRequest: tripSpy,
    } as unknown as VrrEfaClient;

    const service = new VrrTransportService(client);
    const result = await service.getCommuteWithTimetables({
      from: 'Essen Rüttenscheider Stern',
      to: 'Mülheim Hbf',
      departureTime: '2026-06-14T00:00:00.000Z',
    });

    expect(stopFinderSpy).toHaveBeenCalledTimes(2);
    expect(tripSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(tripSpy).toHaveBeenNthCalledWith(1, {
      fromStopId: '20009530',
      toStopId: '20015225',
      departureTime: new Date('2026-06-14T00:00:00.000Z'),
      results: 1,
    });
    expect(tripSpy).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        fromStopId: '20009530',
        toStopId: '20001012',
        results: 5,
      }),
    );
    expect(tripSpy).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        fromStopId: '20001012',
        toStopId: '20015225',
        results: 5,
      }),
    );
    expect(result.options.length).toBeGreaterThan(0);
    expect(result.departureTime).toBe('2026-06-14T00:00:00.000Z');
    expect(result.route.legs).toHaveLength(3);
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]?.options.length).toBeGreaterThan(0);
  });
});
