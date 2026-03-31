import { useState, useEffect, useRef } from 'react';
import { calculateRoute } from '../utils/mapsApi';

/**
 * Custom hook that debounces address inputs and auto-calculates route distance.
 * @param {string} pickup
 * @param {string} dropoff
 * @param {number} debounceMs - default 900ms
 * @returns {{ route, loading, error }}
 *   route: { distanceMiles, distanceKm, durationMinutes, durationText } | null
 */
export function useRouteDistance(pickup, dropoff, debounceMs = 900) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Need both addresses and reasonable length before calling
    if (!pickup?.trim() || !dropoff?.trim() || pickup.length < 8 || dropoff.length < 8) {
      setRoute(null);
      setError(null);
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await calculateRoute(pickup, dropoff);
        setRoute(result);
        if (result === null) {
          // API not configured — silent, UI shows manual input
        }
      } catch (e) {
        setError('Could not calculate distance.');
        setRoute(null);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [pickup, dropoff, debounceMs]);

  return { route, loading, error };
}
