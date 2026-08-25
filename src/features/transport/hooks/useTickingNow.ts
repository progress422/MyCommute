import { useEffect, useState } from 'react';

const DEFAULT_INTERVAL_MS = 30_000;

/** Returns a timestamp that refreshes on an interval so relative times stay current. */
export function useTickingNow(intervalMs = DEFAULT_INTERVAL_MS): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return now;
}
