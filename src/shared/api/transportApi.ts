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

export async function getCommuteWithTimetables(
  params: CommuteSearchParams,
): Promise<CommuteWithTimetables> {
  return vrrTransportService.getCommuteWithTimetables(params);
}
