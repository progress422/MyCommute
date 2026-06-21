import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Station } from '../shared/types';

export interface User {
  id: string;
  name: string;
  address?: string; // user-provided address
  preferredStation?: Station; // chosen or nearest station
  preferredStationLabel?: string; // optional custom name for the station
}

interface UserState {
  users: User[];
  selectedUserId: string | null;
  selectUser: (id: string) => void;
  getSelectedUser: () => User | undefined;
  updateUserAddress: (id: string, address: string) => void;
  setPreferredStation: (id: string, station: Station, label?: string) => void;
}

/**
 * User management store with localStorage persistence.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
          users: [
            // Example default users for demonstration. Remove in production.
            { id: 'user-1', name: 'Olena Dehtiarenko' },
            { id: 'user-2', name: 'Viktor Prytyka' },
          ],
          selectedUserId: null,
          selectUser: (id) => set({ selectedUserId: id }),
          getSelectedUser: () => {
            const state = get();
            return state.users.find((u) => u.id === state.selectedUserId);
          },
          updateUserAddress: (id, address) =>
            set((state) => ({
              users: state.users.map((u) => (u.id === id ? { ...u, address } : u)),
            })),
          setPreferredStation: (id, station, label) =>
            set((state) => ({
              users: state.users.map((u) =>
                u.id === id
                  ? { ...u, preferredStation: station, preferredStationLabel: label ?? station.name }
                  : u
              ),
            })),
    }),
    {
      name: 'user-store', 
    }
  )
);
