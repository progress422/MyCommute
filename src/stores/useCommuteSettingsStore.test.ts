import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_COMMUTE_FROM,
  DEFAULT_COMMUTE_TO,
} from '../features/transport/constants';
import { useCommuteSettingsStore } from './useCommuteSettingsStore';

describe('useCommuteSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCommuteSettingsStore.setState({
      from: DEFAULT_COMMUTE_FROM,
      to: DEFAULT_COMMUTE_TO,
    });
  });

  it('swaps from and to destinations', () => {
    useCommuteSettingsStore.getState().swapDestinations();

    expect(useCommuteSettingsStore.getState().from).toBe(DEFAULT_COMMUTE_TO);
    expect(useCommuteSettingsStore.getState().to).toBe(DEFAULT_COMMUTE_FROM);
  });

  it('saves destinations from settings', () => {
    useCommuteSettingsStore
      .getState()
      .setDestinations('Essen Hbf', 'Düsseldorf Hbf');

    expect(useCommuteSettingsStore.getState().from).toBe('Essen Hbf');
    expect(useCommuteSettingsStore.getState().to).toBe('Düsseldorf Hbf');
  });
});
