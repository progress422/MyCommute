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

  it('shows the essential info on the compact tile: line, departure time, platform, and time left', () => {
    render(
      <TripOptionCard
        option={makeCommuteOption({ boardingPlatform: 'Gleis 2' })}
        interactive={false}
      />,
    );

    expect(screen.getByText('in 5 min')).toBeInTheDocument();
    expect(screen.getByText('U11')).toBeInTheDocument();
    expect(screen.getByText('Gleis 2')).toBeInTheDocument();
  });

  it('hides secondary info like duration and transfer count from the tile', () => {
    render(
      <TripOptionCard
        option={makeCommuteOption()}
        interactive={false}
      />,
    );

    expect(screen.queryByText('32 min')).not.toBeInTheDocument();
    expect(screen.queryByText(/transfer/)).not.toBeInTheDocument();
  });
});
