import { useState } from 'react';
import { PageContainer } from '../../../shared/components/PageContainer';
import { PageHeader } from '../../../shared/components/PageHeader';
import { useCommuteSearch } from '../hooks/useCommuteSearch';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function TransportPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureTime, setDepartureTime] = useState(toDateTimeLocalValue(new Date()));

  const commuteSearch = useCommuteSearch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    commuteSearch.mutate({
      from,
      to,
      departureTime: new Date(departureTime).toISOString(),
    });
  };

  const result = commuteSearch.data;

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
              placeholder="e.g. Düsseldorf Hbf"
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

      {result && (
        <div className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Route summary</h2>
            <p className="mt-2 text-sm text-slate-600">
              Duration: {result.route.durationMinutes} min · Transfers:{' '}
              {result.route.transfers}
            </p>

            <ol className="mt-4 space-y-3">
              {result.route.legs.map((leg, index) => (
                <li
                  key={`${leg.kind}-${index}`}
                  className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm"
                >
                  <p className="font-medium text-slate-900">
                    {leg.kind === 'walk'
                      ? 'Walk'
                      : `${leg.line ?? 'Transit'} → ${leg.direction ?? '—'}`}
                  </p>
                  <p className="text-slate-600">
                    {leg.origin.name} → {leg.destination.name}
                  </p>
                  <p className="text-slate-500">
                    {formatTime(leg.departureTime)} – {formatTime(leg.arrivalTime)}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Departure boards at boarding stops
            </h2>

            {result.timetables.map((timetable) => (
              <article
                key={`${timetable.stop.id}-${timetable.legIndex}`}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <h3 className="font-medium text-slate-900">{timetable.stop.name}</h3>
                <p className="text-xs text-slate-500">
                  Boarding stop for leg {timetable.legIndex + 1}
                </p>

                <table className="mt-3 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4 font-medium">Line</th>
                      <th className="py-2 pr-4 font-medium">Direction</th>
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 font-medium">Delay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.departures.map((departure, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-2 pr-4">{departure.line}</td>
                        <td className="py-2 pr-4">{departure.direction}</td>
                        <td className="py-2 pr-4">
                          {formatTime(departure.realTime ?? departure.plannedTime)}
                        </td>
                        <td className="py-2">
                          {departure.delayMinutes != null
                            ? `+${departure.delayMinutes} min`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </section>
        </div>
      )}
    </PageContainer>
  );
}
