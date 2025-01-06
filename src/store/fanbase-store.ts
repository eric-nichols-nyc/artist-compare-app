import { create } from 'zustand';
import { ArtistFanbaseData } from '@/types/artist';

interface FanbaseStore {
  fanbaseData: ArtistFanbaseData[];
  isLoading: boolean;
  error: string | null;
  fetchFanbaseData: (artist1: string, artist2: string) => Promise<void>;
  clearStore: () => void;
}

export const useFanbaseStore = create<FanbaseStore>((set) => ({
  fanbaseData: [],
  isLoading: false,
  error: null,
  fetchFanbaseData: async (artist1: string, artist2: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/compare/fanbase?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch fanbase data');
      }
      
      const data = await response.json();
      set({ fanbaseData: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  clearStore: () => set({ fanbaseData: [], isLoading: false, error: null })
})); 