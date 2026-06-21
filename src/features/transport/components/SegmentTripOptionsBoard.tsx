import type { TripSegmentOptions } from '../../../shared/types';
import { TripOptionCard } from './TripOptionCard';

interface SegmentTripOptionsBoardProps {
  segment: TripSegmentOptions;
}

export function SegmentTripOptionsBoard({ segment }: SegmentTripOptionsBoardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <header className="mb-3 border-b border-slate-100 pb-3">
        <h3 className="text-base font-medium text-slate-900">
          {segment.from.name} → {segment.to.name}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Up to {segment.options.length} connection
          {segment.options.length === 1 ? '' : 's'}
        </p>
      </header>

      {segment.options.length === 0 ? (
        <p className="text-sm text-slate-500">No connections found.</p>
      ) : (
        <div className="space-y-3">
          {segment.options.map((option) => (
            <TripOptionCard key={option.id} option={option} interactive={false} />
          ))}
        </div>
      )}
    </section>
  );
}
