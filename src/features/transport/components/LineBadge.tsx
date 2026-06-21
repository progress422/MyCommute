import type { TripLineBadge } from '../../../shared/types';
import { lineBadgeClassName } from '../utils/tripDisplay';

export function LineBadge({ badge }: { badge: TripLineBadge }) {
  return (
    <span
      className={`inline-flex min-w-12 items-center justify-center rounded-md px-3 py-1 text-sm font-semibold shadow-sm ${lineBadgeClassName(badge.productClass)}`}
      title={badge.productName}
    >
      {badge.label}
    </span>
  );
}
