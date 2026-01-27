'use client';

import React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface SearchResultsProps {
  results: {
    tracks: {
      _id: string;
      title: string;
      artistId: { name: string };
      albumId?: { title: string; coverArtUrl?: string };
      duration: number;
      youtube_id?: string;
      thumbnailUrl?: string;
    }[];
    artists: {
      _id: string;
      name: string;
      imageUrl?: string;
    }[];
    albums: {
      _id: string;
      title: string;
      artistId: { name: string };
      coverArtUrl?: string;
    }[];
    playlists: {
      _id: string;
      name: string;
      description?: string;
      coverUrl?: string;
    }[];
  };
  isLoading: boolean;
  hasQuery: boolean;
}

const SearchResults = ({ results, isLoading, hasQuery }: SearchResultsProps) => {
  const { playTrack } = usePlayerStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!hasQuery) {
    return null;
  }

  const { tracks, artists, albums, playlists } = results;

  const noResults = !tracks.length && !artists.length && !albums.length && !playlists.length;

  if (noResults) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">No results found for your search</h2>
        <p className="text-zinc-400 mt-2">Please check your spelling or try more general keywords.</p>
      </div>
    );
  }

  const handlePlayTrack = (track: SearchResultsProps['results']['tracks'][0]) => {
    playTrack({
      id: track._id,
      title: track.title,
      artist: track.artistId?.name || 'Unknown Artist',
      album: track.albumId?.title,
      coverArt: track.thumbnailUrl || track.albumId?.coverArtUrl,
      youtube_id: track.youtube_id,
      duration: track.duration,
    });
  };

  return (
    <div className="space-y-10">
      {/* Artists */}
      {artists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {artists.map((artist) => (
              <div key={artist._id} className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800 transition group cursor-pointer">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={artist.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
                    alt={artist.name}
                    fill
                    className="object-cover rounded-full shadow-lg"
                  />
                </div>
                <p className="font-bold truncate">{artist.name}</p>
                <p className="text-sm text-zinc-400 uppercase tracking-wider mt-1">Artist</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tracks */}
      {tracks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          <div className="flex flex-col">
            {tracks.map((track) => (
              <div
                key={track._id}
                className="flex items-center p-2 rounded-md hover:bg-white/10 transition group"
              >
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={track.thumbnailUrl || track.albumId?.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop'}
                    alt={track.title}
                    fill
                    className="object-cover rounded shadow"
                  />
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Play className="fill-white text-white h-6 w-6" />
                  </button>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">{track.artistId?.name}</p>
                </div>
                <div className="text-sm text-zinc-400 ml-4 hidden sm:block truncate max-w-[200px]">
                  {track.albumId?.title}
                </div>
                <div className="text-sm text-zinc-400 ml-auto pl-4">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {albums.map((album) => (
              <div key={album._id} className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800 transition group cursor-pointer">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={album.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
                    alt={album.title}
                    fill
                    className="object-cover rounded shadow-lg"
                  />
                </div>
                <p className="font-bold truncate">{album.title}</p>
                <p className="text-sm text-zinc-400 mt-1 truncate">{album.artistId?.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      {playlists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800 transition group cursor-pointer">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={playlist.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
                    alt={playlist.name}
                    fill
                    className="object-cover rounded shadow-lg"
                  />
                </div>
                <p className="font-bold truncate">{playlist.name}</p>
                <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{playlist.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
