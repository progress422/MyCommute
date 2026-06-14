import { describe, expect, it, vi } from 'vitest';
import stopfinderFixture from './fixtures/stopfinder.json';
import departuresFixture from './fixtures/departures.json';
import tripFixture from './fixtures/trip.json';
import { parseStopFinderResponse } from '../parsers/stopFinder';
import { parseDepartureResponse } from '../parsers/departureMonitor';
import {
  extractBoardingStops,
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
});

describe('parseTripResponse', () => {
  it('parses journey legs and classifies walk vs transit', () => {
    const route = parseTripResponse(tripFixture as EfaTripResponse);

    expect(route.durationMinutes).toBe(52);
    expect(route.transfers).toBe(1);
    expect(route.legs).toHaveLength(3);
    expect(route.legs[0]?.kind).toBe('transit');
    expect(route.legs[1]?.kind).toBe('walk');
    expect(route.legs[2]?.kind).toBe('transit');
    expect(route.legs[0]?.line).toBe('RE 1');
  });

  it('extracts unique boarding stops for transit legs', () => {
    const route = parseTripResponse(tripFixture as EfaTripResponse);
    const boardingStops = extractBoardingStops(route);

    expect(boardingStops).toHaveLength(2);
    expect(boardingStops[0]?.stop.id).toBe('20018235');
    expect(boardingStops[1]?.stop.id).toBe('20001012');
  });
});

describe('parseDepartureResponse', () => {
  it('maps departures with delay information', () => {
    const departures = parseDepartureResponse(
      departuresFixture as EfaDepartureResponse,
    );

    expect(departures).toHaveLength(2);
    expect(departures[0]?.line).toBe('RE1');
    expect(departures[0]?.delayMinutes).toBe(2);
    expect(departures[1]?.delayMinutes).toBeUndefined();
  });
});

describe('VrrTransportService', () => {
  it('fetches one trip and departure boards for each boarding stop', async () => {
    const tripSpy = vi.fn().mockResolvedValue(tripFixture);
    const dmSpy = vi.fn().mockResolvedValue(departuresFixture);

    const client = {
      stopFinder: vi.fn(),
      tripRequest: tripSpy,
      departureMonitor: dmSpy,
    } as unknown as VrrEfaClient;

    const service = new VrrTransportService(client);
    const result = await service.getCommuteWithTimetables({
      from: 'Düsseldorf Hbf',
      to: 'Essen Hbf',
      departureTime: '2026-06-14T08:00:00.000Z',
    });

    expect(tripSpy).toHaveBeenCalledOnce();
    expect(dmSpy).toHaveBeenCalledTimes(2);
    expect(result.route.legs).toHaveLength(3);
    expect(result.timetables).toHaveLength(2);
    expect(result.timetables[0]?.departures[0]?.line).toBe('RE1');
  });
});
