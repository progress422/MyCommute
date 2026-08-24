import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeCommuteOption } from '../test/fixtures';
import { TripOptionCard } from './TripOptionCard';

describe('TripOptionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-24T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows time until departure at the top right and duration in small text', () => {
    render(
      <TripOptionCard
        option={makeCommuteOption()}
        interactive={false}
      />,
    );

    const timeUntil = screen.getByText('in 5 min');
    const duration = screen.getByText('32 min');

    expect(timeUntil).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(duration.className).toContain('text-xs');
    expect(timeUntil.compareDocumentPosition(duration)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
