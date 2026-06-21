import type { CommuteOption } from '../../../shared/types';
import { LineBadge } from './LineBadge';
import { formatJourneyTimeRange, formatTripTime } from '../utils/tripDisplay';

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
  const hasBoardingDelay =
    option.boardingDepartureTimeEstimated != null &&
    option.boardingDepartureTimeEstimated !== option.boardingDepartureTime;

  const className = [
    'w-full rounded-xl border p-4 text-left transition-colors',
    interactive
      ? selected
        ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500'
        : 'border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800'
      : 'border-slate-700 bg-slate-800/80',
  ].join(' ');

  const content = (
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-white">
              {formatJourneyTimeRange(option)}
            </span>

            {option.delayMinutes == null ? (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
                title="On time"
                aria-label="On time"
              >
                ✓
              </span>
            ) : (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400"
                title={`+${option.delayMinutes} min delay`}
                aria-label={`Delayed ${option.delayMinutes} minutes`}
              >
                ⏱
              </span>
            )}

            {option.hasDisruptionInfo && (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/20 text-orange-400"
                title="Service information available"
                aria-label="Service information"
              >
                i
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-300">
            <span className="text-slate-400">Departure </span>
            <span
              className={
                hasBoardingDelay ? 'text-slate-500 line-through' : 'text-white'
              }
            >
              {formatTripTime(option.boardingDepartureTime)}
            </span>
            {hasBoardingDelay && option.boardingDepartureTimeEstimated && (
              <>
                <span className="text-slate-500"> → </span>
                <span className="font-medium text-amber-300">
                  {formatTripTime(option.boardingDepartureTimeEstimated)}
                </span>
              </>
            )}
          </p>

          {(option.boardingPlatform || option.direction) && (
            <p className="mt-1 text-xs text-slate-500">
              {option.boardingPlatform && <span>{option.boardingPlatform}</span>}
              {option.boardingPlatform && option.direction && (
                <span className="text-slate-600"> · </span>
              )}
              {option.direction && <span>→ {option.direction}</span>}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {option.lines.map((badge) => (
              <LineBadge key={`${option.id}-${badge.label}`} badge={badge} />
            ))}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-medium text-slate-300">
            {option.durationMinutes} min
          </p>
          {option.transfers > 0 && (
            <p className="text-xs text-slate-500">
              {option.transfers} transfer{option.transfers === 1 ? '' : 's'}
            </p>
          )}
        </div>
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
