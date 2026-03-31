/**
 * Google Maps Routes API utility
 * Docs: https://developers.google.com/maps/documentation/routes
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const ROUTES_ENDPOINT = 'https://routes.googleapis.com/directions/v2:computeRoutes';

/**
 * Calculate route distance and duration between two addresses.
 * @param {string} origin - Pickup address
 * @param {string} destination - Drop-off address
 * @returns {Promise<{distanceMiles: number, distanceKm: number, durationMinutes: number, durationText: string} | null>}
 */
export async function calculateRoute(origin, destination) {
  if (!API_KEY || API_KEY === 'your_google_maps_api_key_here') {
    console.warn('[mapsApi] No Google Maps API key configured. Using manual mode.');
    return null;
  }

  if (!origin?.trim() || !destination?.trim()) return null;

  try {
    const response = await fetch(ROUTES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.legs',
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[mapsApi] Routes API error:', err);
      return null;
    }

    const data = await response.json();
    const route = data?.routes?.[0];
    if (!route) return null;

    const distanceMeters = route.distanceMeters ?? 0;
    const durationSeconds = parseInt(route.duration?.replace('s', '') ?? '0', 10);

    const distanceMiles = +(distanceMeters / 1609.344).toFixed(1);
    const distanceKm = +(distanceMeters / 1000).toFixed(1);
    const durationMinutes = Math.round(durationSeconds / 60);

    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    return { distanceMiles, distanceKm, durationMinutes, durationText };
  } catch (err) {
    console.error('[mapsApi] Failed to fetch route:', err);
    return null;
  }
}
