import { useCallback, useEffect, useRef } from 'react';

/**
 * Define callbacks for timeouts inside effects, without worry about cleaning them.
 * @returns Function with the same signature of `window.setTimeout` with its `window.clearTimeout` namespaced.
 */
export default function useTimeoutEffect() {
  const timer = useRef<Partial<number>>();
  const handleTimeoutEffect = useCallback(
    (...params: Parameters<typeof window.setTimeout>) => {
      timer.current = window.setTimeout(...params);
    },
    []
  );
  const clearTimeout = useCallback(() => {
    window.clearTimeout(timer.current);
  }, []);

  useEffect(() => () => clearTimeout(), [clearTimeout]);

  return Object.assign(handleTimeoutEffect, {
    clear: clearTimeout
  });
}
