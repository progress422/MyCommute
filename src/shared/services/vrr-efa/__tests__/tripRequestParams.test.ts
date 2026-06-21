import { describe, expect, it } from 'vitest';
import { buildTripRoutingParams } from '../tripRequestParams';

describe('buildTripRoutingParams', () => {
  it('mirrors the VRR provider trip routing defaults', () => {
    expect(buildTripRoutingParams()).toEqual({
      routeType: 'LEASTTIME',
      changeSpeed: 'normal',
      maxChanges: '9',
      useProxFootSearchOrigin: 'true',
      useProxFootSearchDestination: 'true',
      allInterchangesAsLegs: '1',
      trITMOTvalue100: '10',
      calcOneDirection: '1',
      includedMeans: 'checkbox',
      inclMOT_0: 'on',
      inclMOT_1: 'on',
      inclMOT_2: 'on',
      inclMOT_3: 'on',
      inclMOT_4: 'on',
      inclMOT_5: 'on',
      inclMOT_6: 'on',
      inclMOT_7: 'on',
      inclMOT_8: 'on',
      inclMOT_9: 'on',
      inclMOT_10: 'on',
      inclMOT_11: 'on',
    });
  });
});
