import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UiState {
  /** UI theme preference — not persisted yet. */
  theme: Theme;
  /** Whether a sidebar/drawer is open — example UI state only. */
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
}

/**
 * Example Zustand store for global UI state.
 *
 * TODO: Wire theme to CSS classes or a theme provider.
 * TODO: Connect sidebarOpen to a mobile navigation drawer.
 * TODO: Do NOT add persistence here until requirements are defined.
 *
 * Zustand is lightweight global state — compare to Pinia in Vue.
 */
export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  sidebarOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
