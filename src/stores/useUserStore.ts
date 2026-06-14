import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
}

interface UserState {
  users: User[];
  selectedUserId: string | null;
//   addUser: (user: User) => void;
//   removeUser: (id: string) => void;
  selectUser: (id: string) => void;
  getSelectedUser: () => User | undefined;
}

/**
 * User management store with localStorage persistence.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        // Example default user for demonstration. Remove in production.
        { id: 'user-1', name: 'Olena Dehtiarenko' }, 
        { id: 'user-2', name: 'Viktor Prytyka' },
      ],
      selectedUserId: null,
      selectUser: (id) => set({ selectedUserId: id }),
      getSelectedUser: () => {
        const state = get();
        return state.users.find((u) => u.id === state.selectedUserId);
      },
    }),
    {
      name: 'user-store', 
    }
  )
);
