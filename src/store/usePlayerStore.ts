import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArt?: string;
  youtube_id?: string;
  duration: number;
}

interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  volume: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isVideoVisible: boolean;
  
  setIsPlaying: (isPlaying: boolean) => void;
  setIsVideoVisible: (visible: boolean) => void;
  setCurrentTrack: (track: Track | null) => void;
  playTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
  setQueue: (queue: Track[]) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTrack: null,
      queue: [],
      volume: 1,
      isShuffle: false,
      repeatMode: 'none',
      isVideoVisible: false,

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setIsVideoVisible: (isVideoVisible) => set({ isVideoVisible }),
      setCurrentTrack: (currentTrack) => set({ currentTrack, isPlaying: !!currentTrack }),
      playTrack: (track) => {
        const { queue } = get();
        const isInQueue = queue.some((t) => t.id === track.id);
        if (!isInQueue) {
          set({ queue: [...queue, track], currentTrack: track, isPlaying: true });
        } else {
          set({ currentTrack: track, isPlaying: true });
        }
      },
      addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
      setQueue: (queue) => set({ queue }),
      setVolume: (volume) => set({ volume }),
      setRepeatMode: (repeatMode) => set({ repeatMode }),
      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

      next: () => {
        const { queue, currentTrack, isShuffle, repeatMode } = get();
        if (queue.length === 0) return;
        
        let nextIndex = 0;
        if (currentTrack) {
          const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
          if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
          } else {
            nextIndex = currentIndex + 1;
          }
        }

        if (nextIndex < queue.length) {
          set({ currentTrack: queue[nextIndex], isPlaying: true });
        } else if (repeatMode === 'all') {
          set({ currentTrack: queue[0], isPlaying: true });
        } else {
          set({ isPlaying: false });
        }
      },

      previous: () => {
        const { queue, currentTrack } = get();
        if (queue.length === 0 || !currentTrack) return;
        
        const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex - 1;
        
        if (prevIndex >= 0) {
          set({ currentTrack: queue[prevIndex], isPlaying: true });
        } else {
          set({ currentTrack: queue[queue.length - 1], isPlaying: true });
        }
      },
    }),
    {
      name: 'lyrifi-player-storage',
      storage: createJSONStorage(() => localStorage),
      // Skip hydration on server side to avoid errors
      skipHydration: true,
    }
  )
);
