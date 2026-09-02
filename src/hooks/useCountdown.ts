import { useEffect, useRef, useState } from 'react';

export function useCountdown(targetIso: string | null): number {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef(targetIso);
  ref.current = targetIso;

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const diff = new Date(ref.current).getTime() - Date.now();
      setSeconds(Math.max(0, Math.floor(diff / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return seconds;
}
