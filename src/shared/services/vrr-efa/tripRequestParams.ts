export const SEGMENT_TRIP_RESULT_COUNT = 5;
export const SEGMENT_TRIP_FETCH_MAX_ATTEMPTS = 4;
export const TRIP_INCLUDED_TRANSPORT_MODE_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
] as const;

export function buildIncludedTransportModeParams(): Record<string, string> {
  return Object.fromEntries(
    TRIP_INCLUDED_TRANSPORT_MODE_IDS.map((id) => [`inclMOT_${id}`, 'on']),
  );
}

export function buildTripRoutingParams(): Record<string, string> {
  return {
    routeType: 'LEASTTIME',
    changeSpeed: 'normal',
    maxChanges: '9',
    useProxFootSearchOrigin: 'true',
    useProxFootSearchDestination: 'true',
    allInterchangesAsLegs: '1',
    trITMOTvalue100: '10',
    calcOneDirection: '1',
    includedMeans: 'checkbox',
    ...buildIncludedTransportModeParams(),
  };
}
