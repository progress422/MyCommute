import type {
  CommuteSearchParams,
  CommuteWithTimetables,
  Station,
  StationSearchParams,
} from '../types';
import { vrrTransportService } from '../services/vrr-efa/VrrTransportService';

/**
 * Transport API boundary.
 *
 * Feature-specific query hooks (e.g. `useCommuteSearch`) should wrap
 * these functions and live in each feature's `hooks/` folder.
 */

export async function searchStations(
  params: StationSearchParams,
): Promise<Station[]> {
  return vrrTransportService.searchStations(params);
}

export async function searchStationsByAddress(
  query: string,
  limit = 3,
): Promise<Station[]> {
  return vrrTransportService.searchStationsByAddress(query, limit);
}

export async function searchStationsByCoords(
  lat: number,
  lon: number,
): Promise<Station[]> {
  return vrrTransportService.searchStationsByCoords(lat, lon);
}

export async function findNearbyStationsByGeolocation(
  limit = 3,
): Promise<Station[]> {
  if (!navigator.geolocation) {
    console.warn('[GEO][0] Geolocation not available in browser');
    return [];
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`[GEO][1] Position: lat=${latitude}, lon=${longitude}, accuracy=${accuracy}m`);

          console.log('[GEO][2] Request #1: stopfinder by coordinates');
          const firstPass = await searchStationsByCoords(latitude, longitude);
          console.log(`[GEO][3] Response #1 stations: ${firstPass.length}`);

          if (firstPass.length === 0) {
            console.warn('[GEO][4] No stations in first response');
            resolve([]);
            return;
          }

          const anchorId = firstPass[0]?.id;
          let stations = firstPass;

          if (anchorId) {
            console.log(`[GEO][5] Request #2: stopfinder by anchor id: ${anchorId}`);
            const secondPass = await searchStations({ query: anchorId });
            console.log(`[GEO][6] Response #2 stations: ${secondPass.length}`);
            if (secondPass.length > 0) {
              stations = secondPass;
            }
          } else {
            console.warn('[GEO][5] No anchor id from first response, skip request #2');
          }

          const nonCoord = stations.filter((station) => !station.id.startsWith('coord:'));
          const preferred = nonCoord.length > 0 ? nonCoord : stations;
          resolve(preferred.slice(0, limit));
        } catch (err) {
          console.error('[GEO][ERR] Geolocation station lookup failed:', err);
          resolve([]);
        }
      },
      (error) => {
        console.warn('[GEO][ERR] Geolocation permission/error:', error.code, error.message);
        resolve([]);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  });
}

/**
 * Find the nearest station using browser geolocation.
 *
 * Searches for common stops near user and returns the closest one by distance.
 */
export async function findNearestStationByGeolocation(): Promise<Station | null> {
  const stations = await findNearbyStationsByGeolocation(1);
  return stations[0] ?? null;
}

/**
 * Find the nearest station by searching VRR for a free-form address.
 *
 * Returns the first match from stopFinder, which typically is the closest.
 */
export async function findNearestStationByAddress(address: string): Promise<Station | null> {
  console.log(`findNearestStationByAddress: Searching for "${address}"`);
  const stations = await searchStations({ query: address.trim() });
  console.log(`findNearestStationByAddress: Found ${stations.length} stations`, stations);
  return stations.length > 0 ? stations[0] : null;
}

export async function getCommuteWithTimetables(
  params: CommuteSearchParams,
): Promise<CommuteWithTimetables> {
  return vrrTransportService.getCommuteWithTimetables(params);
}
