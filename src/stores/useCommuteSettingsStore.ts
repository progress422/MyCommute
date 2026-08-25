import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSyncExternalStore } from 'react';
import {
  DEFAULT_COMMUTE_FROM,
  DEFAULT_COMMUTE_TO,
} from '../features/transport/constants';

interface CommuteSettingsState {
  from: string;
  to: string;
  setDestinations: (from: string, to: string) => void;
  swapDestinations: () => void;
}

/**
 * Persisted commute from/to destinations, edited on the Settings page.
 */
export const useCommuteSettingsStore = create<CommuteSettingsState>()(
  persist(
    (set) => ({
      from: DEFAULT_COMMUTE_FROM,
      to: DEFAULT_COMMUTE_TO,
      setDestinations: (from, to) => set({ from, to }),
      swapDestinations: () =>
        set((state) => ({
          from: state.to,
          to: state.from,
        })),
    }),
    {
      name: 'commute-settings',
    },
  ),
);

export function useCommuteSettingsHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) =>
      useCommuteSettingsStore.persist.onFinishHydration(onStoreChange),
    () => useCommuteSettingsStore.persist.hasHydrated(),
    () => false,
  );
}
