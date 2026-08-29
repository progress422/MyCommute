import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCommuteWithTimetables } from '../../../shared/api/transportApi';
import {
  DEFAULT_COMMUTE_FROM,
  DEFAULT_COMMUTE_TO,
} from '../constants';
import { useCommuteSettingsStore } from '../../../stores/useCommuteSettingsStore';
import { TransportPage } from './TransportPage';
import { makeCommuteResult } from '../test/fixtures';

vi.mock('../../../shared/api/transportApi', () => ({
  getCommuteWithTimetables: vi.fn(),
}));

const getCommute = vi.mocked(getCommuteWithTimetables);

function renderPage() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return render(<TransportPage />, { wrapper });
}

describe('TransportPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useCommuteSettingsStore.setState({
      from: DEFAULT_COMMUTE_FROM,
      to: DEFAULT_COMMUTE_TO,
    });
    getCommute.mockReset();
    getCommute.mockImplementation(async (params) =>
      makeCommuteResult(params.from, params.to),
    );
  });

  it('requests timetables immediately when the page opens', async () => {
    renderPage();

    await waitFor(() => {
      expect(getCommute).toHaveBeenCalledTimes(1);
    });

    expect(getCommute).toHaveBeenCalledWith(
      expect.objectContaining({
        from: DEFAULT_COMMUTE_FROM,
        to: DEFAULT_COMMUTE_TO,
      }),
    );
    expect(screen.queryByRole('button', { name: 'Search commute' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Departure time')).toBeInTheDocument();
    expect(screen.queryByLabelText('From')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('To')).not.toBeInTheDocument();
  });

  it('requests timetables again when departure time changes', async () => {
    renderPage();

    await waitFor(() => {
      expect(getCommute).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(screen.getByLabelText('Departure time'), {
      target: { value: '15:30' },
    });

    await waitFor(() => {
      expect(getCommute).toHaveBeenCalledTimes(2);
    });

    const now = new Date();
    const expectedDepartureTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      15,
      30,
    );

    expect(getCommute).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: DEFAULT_COMMUTE_FROM,
        to: DEFAULT_COMMUTE_TO,
        departureTime: expectedDepartureTime.toISOString(),
      }),
    );
  });

  it('swaps destinations and requests the return commute', async () => {
    renderPage();

    await waitFor(() => {
      expect(getCommute).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Switch destinations' }));

    await waitFor(() => {
      expect(getCommute).toHaveBeenCalledTimes(2);
    });

    expect(getCommute).toHaveBeenLastCalledWith(
      expect.objectContaining({
        from: DEFAULT_COMMUTE_TO,
        to: DEFAULT_COMMUTE_FROM,
      }),
    );
  });
});
