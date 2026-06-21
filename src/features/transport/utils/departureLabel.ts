export function formatDepartureLabel(departureTime?: string): string {
  if (!departureTime) {
    return 'Departure now';
  }

  const departure = new Date(departureTime);
  const now = new Date();
  const diffMinutes = Math.abs(departure.getTime() - now.getTime()) / 60_000;

  if (diffMinutes < 2) {
    return 'Departure now';
  }

  return `Departure ${departure.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}
