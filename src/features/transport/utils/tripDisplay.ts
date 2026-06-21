import type { TransportProductClass } from '../../../shared/types';

const badgeStyles: Record<TransportProductClass, string> = {
  ubahn: 'bg-blue-600 text-white',
  tram: 'bg-teal-500 text-white',
  bus: 'bg-emerald-600 text-white',
  train: 'bg-red-700 text-white',
  walk: 'bg-slate-500 text-white',
  other: 'bg-slate-600 text-white',
};

export function lineBadgeClassName(productClass: TransportProductClass): string {
  return badgeStyles[productClass];
}

export function formatTripTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTripTimeRange(
  departureTime: string,
  arrivalTime: string,
): string {
  return `${formatTripTime(departureTime)} - ${formatTripTime(arrivalTime)}`;
}

export function formatBoardingDeparture(option: {
  boardingDepartureTime: string;
  boardingDepartureTimeEstimated?: string;
}): string {
  const scheduled = formatTripTime(option.boardingDepartureTime);

  if (
    !option.boardingDepartureTimeEstimated ||
    option.boardingDepartureTimeEstimated === option.boardingDepartureTime
  ) {
    return scheduled;
  }

  const actual = formatTripTime(option.boardingDepartureTimeEstimated);
  return `${scheduled} → ${actual}`;
}

export function formatJourneyTimeRange(option: {
  departureTime: string;
  arrivalTime: string;
  departureTimeEstimated?: string;
  arrivalTimeEstimated?: string;
}): string {
  const departure =
    option.departureTimeEstimated ?? option.departureTime;
  const arrival = option.arrivalTimeEstimated ?? option.arrivalTime;
  return formatTripTimeRange(departure, arrival);
}
