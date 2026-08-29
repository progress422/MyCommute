import { type ChangeEvent, useState } from 'react';
import { PageContainer } from '../../../shared/components/PageContainer';
import {
  useCommuteSettingsHydrated,
  useCommuteSettingsStore,
} from '../../../stores/useCommuteSettingsStore';
import { useCommuteSearch } from '../hooks/useCommuteSearch';
import { useUiStore } from '../../../stores/useUiStore';
import { SegmentTripOptionsBoard } from './SegmentTripOptionsBoard';
import { TripOptionCard } from './TripOptionCard';

function toTimeValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoDepartureTime(time: string): string | undefined {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) {
    return undefined;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const now = new Date();
  const combined = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
  );

  if (Number.isNaN(combined.getTime())) {
    return undefined;
  }

  return combined.toISOString();
}

export function TransportPage() {
  const from = useCommuteSettingsStore((state) => state.from);
  const to = useCommuteSettingsStore((state) => state.to);
  const swapDestinations = useCommuteSettingsStore(
    (state) => state.swapDestinations,
  );

  const [departureTime, setDepartureTime] = useState(() =>
    toTimeValue(new Date()),
  );
  const hasHydrated = useCommuteSettingsHydrated();
  const showTripSummaryTile = useUiStore((state) => state.showTripSummaryTile);

  const departureTimeIso = toIsoDepartureTime(departureTime);
  const commuteSearch = useCommuteSearch(
    {
      from,
      to,
      departureTime: departureTimeIso,
    },
    { enabled: hasHydrated && Boolean(departureTimeIso) },
  );

  const handleDepartureTimeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDepartureTime(event.currentTarget.value);
  };

  const handleSwapDestinations = () => {
    swapDestinations();
  };

  const result = commuteSearch.data;
  const trip = result?.options[0];

  return (
    <PageContainer>
      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="sr-only">Departure time</span>
            <input
              type="time"
              value={departureTime}
              onChange={handleDepartureTimeChange}
              aria-label="Departure time"
              className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>

          <button
            type="button"
            onClick={handleSwapDestinations}
            aria-label="Switch destinations"
            title="Switch destinations"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>
      </section>

      {commuteSearch.isError && (
        <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {commuteSearch.error instanceof Error
            ? commuteSearch.error.message
            : 'Failed to fetch commute data.'}
        </section>
      )}

      {commuteSearch.isLoading && (
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Searching…
        </section>
      )}

      {result && trip && (
        <div className="space-y-6">
          {commuteSearch.isFetching && !commuteSearch.isLoading && (
            <p className="text-xs text-slate-500">Updating connections…</p>
          )}
          {showTripSummaryTile && (
            <section className="space-y-4 rounded-2xl bg-slate-950 p-4 sm:p-6">
              <TripOptionCard option={trip} interactive={false} />
            </section>
          )}

          {result.segments.length > 0 && (
            <section className="space-y-4">
              {result.segments.map((segment) => (
                <SegmentTripOptionsBoard
                  key={`${segment.from.id}-${segment.to.id}-${segment.legIndex}`}
                  segment={segment}
                />
              ))}
              <p className="text-base font-medium text-slate-900">
                {result.segments[result.segments.length - 1].to.name}
              </p>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
