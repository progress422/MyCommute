import type { CommuteOption, CommuteWithTimetables } from '../../../shared/types';

export function makeCommuteOption(
  overrides: Partial<CommuteOption> = {},
): CommuteOption {
  return {
    id: 'opt-1',
    departureTime: '2026-08-24T12:00:00.000Z',
    arrivalTime: '2026-08-24T12:32:00.000Z',
    boardingDepartureTime: '2026-08-24T12:05:00.000Z',
    durationMinutes: 32,
    transfers: 1,
    lines: [{ label: 'U11', productName: 'Stadtbahn', productClass: 'ubahn' }],
    hasDisruptionInfo: false,
    legs: [],
    ...overrides,
  };
}

export function makeCommuteResult(
  from: string,
  to: string,
  option: CommuteOption = makeCommuteOption(),
): CommuteWithTimetables {
  return {
    from,
    to,
    departureTime: option.departureTime,
    options: [option],
    route: {
      id: 'route-1',
      durationMinutes: option.durationMinutes,
      transfers: option.transfers,
      legs: option.legs,
    },
    segments: [],
  };
}
