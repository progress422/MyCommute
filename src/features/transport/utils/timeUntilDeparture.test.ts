import { describe, expect, it } from 'vitest';
import { formatTimeUntilDeparture } from './timeUntilDeparture';

describe('formatTimeUntilDeparture', () => {
  const now = Date.parse('2026-08-24T12:00:00.000Z');

  it('returns now when departure is due or past', () => {
    expect(formatTimeUntilDeparture('2026-08-24T12:00:00.000Z', now)).toBe(
      'now',
    );
    expect(formatTimeUntilDeparture('2026-08-24T11:59:00.000Z', now)).toBe(
      'now',
    );
  });

  it('returns minutes until departure', () => {
    expect(formatTimeUntilDeparture('2026-08-24T12:05:00.000Z', now)).toBe(
      'in 5 min',
    );
  });

  it('returns hours and minutes for longer waits', () => {
    expect(formatTimeUntilDeparture('2026-08-24T13:10:00.000Z', now)).toBe(
      'in 1 h 10 min',
    );
    expect(formatTimeUntilDeparture('2026-08-24T14:00:00.000Z', now)).toBe(
      'in 2 h',
    );
  });
});
