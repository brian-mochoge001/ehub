import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncState {
  favorites: string[];
  cartCount: number;
  walletBalance: number;
  addFavorite: (serviceId: string) => void;
  removeFavorite: (serviceId: string) => void;
  setCartCount: (count: number) => void;
  setWalletBalance: (balance: number) => void;
  clearSyncState: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      favorites: [],
      cartCount: 0,
      walletBalance: 0,
      addFavorite: (serviceId) =>
        set((state) => ({
          favorites: state.favorites.includes(serviceId)
            ? state.favorites
            : [...state.favorites, serviceId],
        })),
      removeFavorite: (serviceId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== serviceId),
        })),
      setCartCount: (cartCount) => set({ cartCount }),
      setWalletBalance: (walletBalance) => set({ walletBalance }),
      clearSyncState: () => set({ favorites: [], cartCount: 0, walletBalance: 0 }),
    }),
    {
      name: 'ehub-sync-storage', // The common key used across platforms
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
