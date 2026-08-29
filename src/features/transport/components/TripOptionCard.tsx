import type { CommuteOption } from '../../../shared/types';
import { useTickingNow } from '../hooks/useTickingNow';
import {
  formatTimeUntilDeparture,
  getEffectiveDepartureTime,
} from '../utils/timeUntilDeparture';
import { formatTripTime } from '../utils/tripDisplay';
import { LineBadge } from './LineBadge';

interface TripOptionCardProps {
  option: CommuteOption;
  selected?: boolean;
  onSelect?: () => void;
  /** When false, renders a static summary tile instead of a selectable button. */
  interactive?: boolean;
}

export function TripOptionCard({
  option,
  selected = false,
  onSelect,
  interactive = true,
}: TripOptionCardProps) {
  const now = useTickingNow();
  const timeUntilDeparture = formatTimeUntilDeparture(
    getEffectiveDepartureTime(option),
    now,
  );
  const hasBoardingDelay =
    option.boardingDepartureTimeEstimated != null &&
    option.boardingDepartureTimeEstimated !== option.boardingDepartureTime;

  const className = [
    'w-full rounded-lg border p-3 text-left transition-colors',
    interactive
      ? selected
        ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500'
        : 'border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800'
      : 'border-slate-700 bg-slate-800/80',
  ].join(' ');

  const content = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {option.lines.map((badge) => (
          <LineBadge key={`${option.id}-${badge.label}`} badge={badge} />
        ))}

        <div className="min-w-0 text-sm">
          <span
            className={
              hasBoardingDelay
                ? 'text-slate-500 line-through'
                : 'font-medium text-white'
            }
          >
            {formatTripTime(option.boardingDepartureTime)}
          </span>
          {hasBoardingDelay && option.boardingDepartureTimeEstimated && (
            <span className="ml-1 font-medium text-amber-300">
              {formatTripTime(option.boardingDepartureTimeEstimated)}
            </span>
          )}
          {option.boardingPlatform && (
            <span className="ml-2 inline-flex items-center rounded-md bg-sky-500/20 px-1.5 py-0.5 text-xs font-bold tracking-wide text-sky-300">
              {option.boardingPlatform}
            </span>
          )}
        </div>
      </div>

      <p className="shrink-0 text-sm font-semibold text-white">
        {timeUntilDeparture}
      </p>
    </div>
  );

  if (!interactive) {
    return <article className={className}>{content}</article>;
  }

  return (
    <button type="button" onClick={onSelect} className={className}>
      {content}
    </button>
  );
}
