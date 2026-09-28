import { useEffect, useRef, useState } from 'react';
import { CountdownParts, toCountdownParts } from '../utils/date';

interface UseCountdownArgs {
  serverTime: string;
  fetchedAtMs: number;
  targetDate: string;
  onExpire?: () => void;
  enabled?: boolean;
}


export function useCountdown({
  serverTime,
  fetchedAtMs,
  targetDate,
  onExpire,
  enabled = true,
}: UseCountdownArgs): CountdownParts {
  const serverOffsetMs = new Date(serverTime).getTime() - fetchedAtMs;
  const targetMs = new Date(targetDate).getTime();

  const computeRemaining = () => targetMs - (Date.now() + serverOffsetMs);

  const [remainingMs, setRemainingMs] = useState<number>(computeRemaining);
  const hasFiredExpireRef = useRef(false);

  useEffect(() => {
    hasFiredExpireRef.current = false;
    setRemainingMs(computeRemaining());

    if (!enabled) return undefined;

    const interval = setInterval(() => {
      const next = computeRemaining();
      setRemainingMs(next);
      if (next <= 0 && !hasFiredExpireRef.current) {
        hasFiredExpireRef.current = true;
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [serverTime, fetchedAtMs, targetDate, enabled]);

  return toCountdownParts(remainingMs);
}