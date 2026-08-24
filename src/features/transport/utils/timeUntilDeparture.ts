const MINUTE_MS = 60_000;
const HOUR_MINUTES = 60;

export function formatTimeUntilDeparture(
  departureIso: string,
  nowMs: number = Date.now(),
): string {
  const diffMinutes = Math.round(
    (new Date(departureIso).getTime() - nowMs) / MINUTE_MS,
  );

  if (diffMinutes <= 0) {
    return 'now';
  }

  if (diffMinutes < HOUR_MINUTES) {
    return `in ${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / HOUR_MINUTES);
  const minutes = diffMinutes % HOUR_MINUTES;

  if (minutes === 0) {
    return `in ${hours} h`;
  }

  return `in ${hours} h ${minutes} min`;
}

export function getEffectiveDepartureTime(option: {
  boardingDepartureTime: string;
  boardingDepartureTimeEstimated?: string;
}): string {
  return option.boardingDepartureTimeEstimated ?? option.boardingDepartureTime;
}
