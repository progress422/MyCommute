import { useState, type ChangeEvent } from 'react';
import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';
import {
  useCommuteSettingsHydrated,
  useCommuteSettingsStore,
} from '../../../stores/useCommuteSettingsStore';
import { useCommuteSearch } from '../hooks/useCommuteSearch';
import { formatDepartureLabel } from '../utils/departureLabel';
import { SegmentTripOptionsBoard } from './SegmentTripOptionsBoard';
import { TripOptionCard } from './TripOptionCard';
import { TripOverviewHeader } from './TripOverviewHeader';

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoDepartureTime(dateTimeLocal: string): string | undefined {
  if (!dateTimeLocal) {
    return undefined;
  }

  const parsed = new Date(dateTimeLocal);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}

export function TransportPage() {
  const from = useCommuteSettingsStore((state) => state.from);
  const to = useCommuteSettingsStore((state) => state.to);
  const swapDestinations = useCommuteSettingsStore(
    (state) => state.swapDestinations,
  );

  const [departureTime, setDepartureTime] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );
  const hasHydrated = useCommuteSettingsHydrated();

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
      <PageHeader
        title="Transport"
        description="Search and compare public transport connections for your commute."
      />

      <section className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="block text-sm font-medium text-slate-700">
            Departure time
            <input
              type="datetime-local"
              value={departureTime}
              onChange={handleDepartureTimeChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:max-w-xs"
            />
          </label>

          <button
            type="button"
            onClick={handleSwapDestinations}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Switch destinations
          </button>
        </div>

        <p className="text-sm text-slate-600" data-testid="commute-route">
          <span className="font-medium text-slate-800">{from}</span>
          <span className="mx-2 text-slate-400">→</span>
          <span className="font-medium text-slate-800">{to}</span>
        </p>
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
          <section className="space-y-4 rounded-2xl bg-slate-950 p-4 sm:p-6">
            <TripOverviewHeader
              from={from}
              to={to}
              departureLabel={formatDepartureLabel(result.departureTime)}
            />
            <TripOptionCard option={trip} interactive={false} />
          </section>

          {result.segments.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-slate-700">
                Connection options
              </h2>
              {result.segments.map((segment) => (
                <SegmentTripOptionsBoard
                  key={`${segment.from.id}-${segment.to.id}-${segment.legIndex}`}
                  segment={segment}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
