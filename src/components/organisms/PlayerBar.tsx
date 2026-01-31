'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Tv } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import Link from 'next/link';

// Declare YT types for TS support if not using @types/youtube
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const PlayerBar = () => {
  // State Values
  const currentTrack = usePlayerStore((state: any) => state.currentTrack);
  const isPlaying = usePlayerStore((state: any) => state.isPlaying);
  const volume = usePlayerStore((state: any) => state.volume);
  const isShuffle = usePlayerStore((state: any) => state.isShuffle);
  const repeatMode = usePlayerStore((state: any) => state.repeatMode);
  const isVideoVisible = usePlayerStore((state: any) => state.isVideoVisible);

  // Actions (Functions are usually stable, but this is the correct pattern)
  const setIsPlaying = usePlayerStore((state: any) => state.setIsPlaying);
  const setVolume = usePlayerStore((state: any) => state.setVolume);
  const next = usePlayerStore((state: any) => state.next);
  const previous = usePlayerStore((state: any) => state.previous);
  const toggleShuffle = usePlayerStore((state: any) => state.toggleShuffle);
  const setRepeatMode = usePlayerStore((state: any) => state.setRepeatMode);
  const setIsVideoVisible = usePlayerStore((state: any) => state.setIsVideoVisible);

  const [hasWindow, setHasWindow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs for the YouTube Player
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial hydration and script loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
      usePlayerStore.persist.rehydrate();
      setIsPlaying(false);
      setIsVideoVisible(false);

      // Load YouTube IFrame API script
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    }
  }, [setIsPlaying, setIsVideoVisible]);

  // 2. Initialize / Update Player when track changes
  useEffect(() => {
    if (!hasWindow || !currentTrack?.youtube_id) return;

    const initPlayer = () => {
      // Extract ID if it's a full URL
      const videoId = currentTrack.youtube_id?.replace('https://youtu.be/', '').split('?')[0];

      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(videoId);
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 1,
            fs: 0,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(volume * 100);
              setDuration(event.target.getDuration());
            },
            onStateChange: (event: any) => {
              // YT.PlayerState.ENDED = 0
              if (event.data === 0) next();
            },
          },
        });
      };

      // If script is already loaded
      if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }
    };

    initPlayer();

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current as NodeJS.Timeout);
    };
  }, [currentTrack?.youtube_id, hasWindow, next]);

  // 3. Sync Play/Pause state
  useEffect(() => {
    if (playerRef.current?.playVideo) {
      if (isPlaying) {
        playerRef.current.playVideo();
        // Start progress polling
        progressInterval.current = setInterval(() => {
          const currentTime = playerRef.current.getCurrentTime();
          setProgress(currentTime);
        }, 1000);
      } else {
        playerRef.current.pauseVideo();
        if (progressInterval.current) clearInterval(progressInterval.current as NodeJS.Timeout);
      }
    }
  }, [isPlaying]);

  // 4. Sync Volume
  useEffect(() => {
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Handle manual seek
  const handleSeek = (vals: number[]) => {
    const newTime = vals[0];
    setProgress(newTime);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  if (!currentTrack) {
    return (
        <div className="h-24 bg-black border-t border-zinc-800 flex items-center justify-center text-zinc-500 italic">
          No track selected
        </div>
    );
  }

  return (
      <div className="h-24 bg-black border-t border-zinc-800 px-4 flex items-center justify-between text-white relative">
        {/* Track Info */}
        <div className="flex items-center flex-1 min-w-0 mr-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-800 rounded mr-3 sm:mr-4 flex-shrink-0 relative">
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
            <Link href={`/track/${currentTrack.id}`} className="font-semibold text-xs sm:text-sm truncate">{currentTrack.title}</Link>
            <div className="flex items-center gap-1 text-xs text-zinc-400 truncate">
              <Link href={`/artist/${currentTrack.artistId}`} className="text-[10px] sm:text-xs text-zinc-400 truncate hover:underline">{currentTrack.artist}</Link>
              {currentTrack.album && (
                <>
                  <span>•</span>
                  <Link href={`/album/${currentTrack.albumId}`} className="hover:underline">{currentTrack.album}</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 max-w-xl px-2 sm:px-0">
          <div className="flex items-center space-x-4 sm:space-x-6 mb-2">
            <button
                onClick={toggleShuffle}
                aria-label="Shuffle"
                className={`${isShuffle ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition hidden sm:block`}
            >
              <Shuffle size={18} className="sm:size-5" />
            </button>
            <button onClick={previous} aria-label="Previous" className="text-zinc-400 hover:text-white transition">
              <SkipBack size={20} className="sm:size-6" fill="currentColor" />
            </button>
            <button
                aria-label={isPlaying ? "Pause" : "Play"}
                className="bg-white text-black hover:scale-105 rounded-full w-8 h-8 flex items-center justify-center p-0 transition"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} className="sm:size-5" fill="currentColor" /> : <Play size={18} className="sm:size-5 ml-1" fill="currentColor" />}
            </button>
            <button onClick={next} aria-label="Next" className="text-zinc-400 hover:text-white transition">
              <SkipForward size={20} className="sm:size-6" fill="currentColor" />
            </button>
            <button
                onClick={() => setRepeatMode(repeatMode === 'all' ? 'none' : 'all')}
                aria-label="Repeat"
                className={`${repeatMode !== 'none' ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition hidden sm:block`}
            >
              <Repeat size={18} className="sm:size-5" />
            </button>
          </div>

          <div className="w-full flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs text-zinc-400 min-w-[30px] sm:min-w-[40px] text-right">
              {Math.floor(progress / 60)}:{Math.floor(progress % 60).toString().padStart(2, '0')}
            </span>
            <Slider
                value={[progress]}
                max={duration || 100}
                step={1}
                className="flex-1"
                onValueChange={handleSeek}
            />
            <span className="text-[10px] sm:text-xs text-zinc-400 min-w-[30px] sm:min-w-[40px]">
              {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Volume and Video Toggle */}
        <div className="hidden md:flex items-center justify-end flex-1 space-x-4">
          <button
              onClick={() => setIsVideoVisible(!isVideoVisible)}
              aria-label="Toggle Video"
              className={`${isVideoVisible ? 'text-green-500' : 'text-zinc-400'} hover:text-white transition`}
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

        {/* Manual IFrame Injection */}
        <div
            className={`fixed bottom-28 right-4 z-50 overflow-hidden rounded-lg shadow-2xl border border-zinc-800 bg-black transition-opacity duration-300 ${
                isVideoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } w-[240px] h-[135px] sm:w-[320px] sm:h-[180px]`}
        >
          <div id="youtube-player" style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
  );
};

export default PlayerBar;