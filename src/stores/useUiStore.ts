import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UiState {
  /** UI theme preference — not persisted yet. */
  theme: Theme;
  /** Whether a sidebar/drawer is open — example UI state only. */
  sidebarOpen: boolean;
  /** Whether the highlighted next-departure tile is shown at the top of the Transport page. */
  showTripSummaryTile: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setShowTripSummaryTile: (show: boolean) => void;
}

/**
 * Example Zustand store for global UI state.
 *
 * TODO: Wire theme to CSS classes or a theme provider.
 * TODO: Connect sidebarOpen to a mobile navigation drawer.
 * TODO: Do NOT persist theme/sidebarOpen here until requirements are defined
 * (showTripSummaryTile is persisted since it's a real user setting).
 *
 * Zustand is lightweight global state — compare to Pinia in Vue.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,
      showTripSummaryTile: true,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setShowTripSummaryTile: (show) => set({ showTripSummaryTile: show }),
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({ showTripSummaryTile: state.showTripSummaryTile }),
    },
  ),
);
