import { useState, type FormEvent } from 'react';
import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';
import { useCommuteSearch } from '../hooks/useCommuteSearch';
import {
  DEFAULT_COMMUTE_FROM,
  DEFAULT_COMMUTE_TO,
} from '../constants';
import { formatDepartureLabel } from '../utils/departureLabel';
import { SegmentTripOptionsBoard } from './SegmentTripOptionsBoard';
import { TripOptionCard } from './TripOptionCard';
import { TripOverviewHeader } from './TripOverviewHeader';

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TransportPage() {
  const [from, setFrom] = useState(DEFAULT_COMMUTE_FROM);
  const [to, setTo] = useState(DEFAULT_COMMUTE_TO);
  const [departureTime, setDepartureTime] = useState(
    toDateTimeLocalValue(new Date()),
  );

  const commuteSearch = useCommuteSearch();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commuteSearch.mutate({
      from,
      to,
      departureTime: new Date(departureTime).toISOString(),
    });
  };

  const result = commuteSearch.data;
  const trip = result?.options[0];

  return (
    <PageContainer>
      <PageHeader
        title="Transport"
        description="Search and compare public transport connections for your commute."
      />

      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            From
            <input
              type="text"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="e.g. Rüttenscheider Stern, Essen"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            To
            <input
              type="text"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="e.g. Essen Hbf"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Departure time
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(event) => setDepartureTime(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:max-w-xs"
          />
        </label>

        <button
          type="submit"
          disabled={commuteSearch.isPending}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {commuteSearch.isPending ? 'Searching…' : 'Search commute'}
        </button>
      </form>

      {commuteSearch.isError && (
        <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {commuteSearch.error instanceof Error
            ? commuteSearch.error.message
            : 'Failed to fetch commute data.'}
        </section>
      )}

      {result && trip && (
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl bg-slate-950 p-4 sm:p-6">
            <TripOverviewHeader
              from={result.from}
              to={result.to}
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
