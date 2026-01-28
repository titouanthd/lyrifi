'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
}) as React.ComponentType<any>;

import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Tv } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

const PlayerBar = () => {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    volume, 
    setVolume, 
    next, 
    previous, 
    isShuffle, 
    toggleShuffle,
    repeatMode,
    setRepeatMode,
    isVideoVisible,
    setIsVideoVisible
  } = usePlayerStore();
  
  const [hasWindow, setHasWindow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasWindow(true);
      // Rehydrate store on mount
      usePlayerStore.persist.rehydrate();
      // Fix for NotAllowedError: ensure we don't autoplay on refresh
      setIsPlaying(false);
      // Always default hidden on mount
      setIsVideoVisible(false);
    }
  }, [setIsPlaying, setIsVideoVisible]);

  if (!currentTrack) {
    return (
      <div className="h-24 bg-black border-t border-zinc-800 flex items-center justify-center text-zinc-500 italic">
        No track selected
      </div>
    );
  }

  return (
    <div className="h-24 bg-black border-t border-zinc-800 px-4 flex items-center justify-between text-white">
      {/* Track Info */}
      <div className="flex items-center w-1/3">
        <div className="w-14 h-14 bg-zinc-800 rounded mr-4 flex-shrink-0 relative">
          {currentTrack.coverArt && (
            <Image 
              src={currentTrack.coverArt} 
              alt={currentTrack.title} 
              fill
              className="object-cover rounded" 
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate">{currentTrack.title}</div>
          <div className="text-xs text-zinc-400 truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 max-w-xl">
        <div className="flex items-center space-x-6 mb-2">
          <button 
            onClick={toggleShuffle}
            aria-label="Toggle Shuffle"
            className={`${isShuffle ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition`}
          >
            <Shuffle size={20} />
          </button>
          <button onClick={previous} aria-label="Previous Track" className="text-zinc-400 hover:text-white transition">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            aria-label={isPlaying ? "Pause" : "Play"}
            className="bg-white text-black hover:scale-105 rounded-full w-8 h-8 flex items-center justify-center p-0 transition"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>
          <button onClick={next} aria-label="Next Track" className="text-zinc-400 hover:text-white transition">
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => setRepeatMode(repeatMode === 'all' ? 'none' : 'all')}
            aria-label="Toggle Repeat"
            className={`${repeatMode !== 'none' ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition`}
          >
            <Repeat size={20} />
          </button>
        </div>
        
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-zinc-400 min-w-[40px] text-right">
            {Math.floor(progress / 60)}:{Math.floor(progress % 60).toString().padStart(2, '0')}
          </span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={1} 
            className="flex-1"
            onValueChange={(vals) => setProgress(vals[0])}
          />
          <span className="text-xs text-zinc-400 min-w-[40px]">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Volume and Video Toggle */}
      <div className="flex items-center justify-end w-1/3 space-x-4">
        <button
          onClick={() => setIsVideoVisible(!isVideoVisible)}
          className={`${isVideoVisible ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition`}
          aria-label="Toggle Video"
        >
          <Tv size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <Volume2 size={20} className="text-zinc-400" />
          <div className="w-24">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(vals) => setVolume(vals[0] / 100)}
            />
          </div>
        </div>
      </div>

      {/* Video Player Container */}
      {hasWindow && currentTrack.youtube_id && (
        <div
          className={`fixed bottom-28 right-4 z-50 overflow-hidden rounded-lg shadow-2xl border border-zinc-800 bg-black transition-opacity duration-300 ${
            isVideoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ width: '320px', height: '180px' }}
        >
          <ReactPlayer
            key={currentTrack.youtube_id}
            url={currentTrack.youtube_id?.trim().startsWith('http')
              ? currentTrack.youtube_id.trim()
              : `https://youtu.be/${currentTrack.youtube_id?.trim()}`}
            playing={isPlaying}
            volume={volume}
            width="100%"
            height="100%"
            onProgress={(state: { playedSeconds: number }) => setProgress(state.playedSeconds)}
            // onDuration={(d: number) => setDuration(d)}
            onEnded={next}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerBar;
