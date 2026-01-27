/** @jest-environment jsdom */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import PlayerBar from '../../components/organisms/PlayerBar';
import {usePlayerStore} from '@/store/usePlayerStore';

// Mock Next.js dynamic import
jest.mock('next/dynamic', () => () => {
  return () => <div data-testid="react-player"/>;
});

// Mock Image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ fill, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ""} />
  )
}));

const mockTrack = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  coverArt: '/test.jpg',
  youtube_id: 'abc',
  duration: 120
};

describe('PlayerBar Component', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      currentTrack: null,
      isPlaying: false,
      volume: 0.5,
    });
  });

  it('should display "No track selected" when currentTrack is null', () => {
    render(<PlayerBar />);
    expect(screen.getByText(/No track selected/i)).toBeInTheDocument();
  });

  it('should display track info when a track is selected', () => {
    usePlayerStore.setState({ currentTrack: mockTrack });
    render(<PlayerBar />);
    
    expect(screen.getByText(mockTrack.title)).toBeInTheDocument();
    expect(screen.getByText(mockTrack.artist)).toBeInTheDocument();
  });

  it('should toggle play/pause state when the button is clicked', () => {
    const setIsPlayingSpy = jest.spyOn(usePlayerStore.getState(), 'setIsPlaying');
    usePlayerStore.setState({ currentTrack: mockTrack, isPlaying: false });
    
    render(<PlayerBar />);
    
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    
    expect(setIsPlayingSpy).toHaveBeenCalledWith(true);
  });
});
