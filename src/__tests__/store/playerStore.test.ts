import { usePlayerStore, Track } from '@/store/usePlayerStore';

const mockTrack1: Track = {
  id: '1',
  title: 'Track 1',
  artist: 'Artist 1',
  duration: 180,
  youtube_id: 'yt1'
};

const mockTrack2: Track = {
  id: '2',
  title: 'Track 2',
  artist: 'Artist 2',
  duration: 200,
  youtube_id: 'yt2'
};

describe('usePlayerStore', () => {
  beforeEach(() => {
    // Manually reset store state
    usePlayerStore.setState({
      isPlaying: false,
      currentTrack: null,
      queue: [],
      volume: 1,
      isShuffle: false,
      repeatMode: 'none'
    });
  });

  describe('Basic Actions', () => {
    it('playTrack should update currentTrack and set isPlaying to true', () => {
      usePlayerStore.getState().playTrack(mockTrack1);
      
      expect(usePlayerStore.getState().currentTrack).toEqual(mockTrack1);
      expect(usePlayerStore.getState().isPlaying).toBe(true);
      expect(usePlayerStore.getState().queue).toContainEqual(mockTrack1);
    });
  });

  describe('Queue Management', () => {
    it('addToQueue should add track to the end of the queue', () => {
      usePlayerStore.getState().addToQueue(mockTrack1);
      usePlayerStore.getState().addToQueue(mockTrack2);
      
      const queue = usePlayerStore.getState().queue;
      expect(queue).toHaveLength(2);
      expect(queue[1]).toEqual(mockTrack2);
    });
  });

  describe('Next/Prev Logic', () => {
    it('next should go to the next track in the queue', () => {
      usePlayerStore.setState({ queue: [mockTrack1, mockTrack2], currentTrack: mockTrack1 });
      
      usePlayerStore.getState().next();
      
      expect(usePlayerStore.getState().currentTrack).toEqual(mockTrack2);
    });

    it('next should loop to the first track if repeatMode is "all"', () => {
      usePlayerStore.setState({ 
        queue: [mockTrack1, mockTrack2], 
        currentTrack: mockTrack2,
        repeatMode: 'all' 
      });
      
      usePlayerStore.getState().next();
      
      expect(usePlayerStore.getState().currentTrack).toEqual(mockTrack1);
    });
  });

  describe('Shuffle Logic', () => {
    it('toggleShuffle should toggle isShuffle state', () => {
      const initial = usePlayerStore.getState().isShuffle;
      usePlayerStore.getState().toggleShuffle();
      expect(usePlayerStore.getState().isShuffle).toBe(!initial);
    });

    it('next should pick a random track when shuffle is enabled', () => {
      const manyTracks = Array.from({ length: 10 }, (_, i) => ({
        ...mockTrack1, id: `${i}`, title: `Track ${i}`
      }));
      
      usePlayerStore.setState({ 
        queue: manyTracks, 
        currentTrack: manyTracks[0], 
        isShuffle: true 
      });
      
      // We can't easily test "randomness" deterministically, 
      // but we can check it doesn't just go to index 1 every time if we run it enough or mock Math.random
      
      const spy = jest.spyOn(Math, 'random').mockReturnValue(0.9); // Should pick the last one
      usePlayerStore.getState().next();
      
      expect(usePlayerStore.getState().currentTrack).toEqual(manyTracks[9]);
      spy.mockRestore();
    });
  });
});
