import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Artist from '@/models/Artist';
import Album from '@/models/Album';
import Track from '@/models/Track';
import { Play, Clock3 } from 'lucide-react';
import Link from 'next/link';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;

  await connectDB();

  const artist = await Artist.findById(id);

  if (!artist) {
    notFound();
  }

  const [albums, tracks] = await Promise.all([
    Album.find({ artistId: id }).sort({ releaseDate: -1 }),
    Track.find({ artistId: id }).populate('albumId').limit(5),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="relative h-48 w-48 md:h-64 md:w-64 flex-shrink-0">
          <Image
            src={artist.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
            alt={artist.name}
            fill
            className="object-cover rounded-full shadow-2xl"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase tracking-wider">Artist</span>
          <h1 className="text-5xl md:text-8xl font-black">{artist.name}</h1>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-zinc-400">
              {artist.monthlyListeners?.toLocaleString() || 0} monthly listeners
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {artist.bio && (
        <section>
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="text-zinc-400 max-w-4xl leading-relaxed bg-zinc-900/50 p-6 rounded-lg">
            {artist.bio}
          </p>
        </section>
      )}

      {/* Popular Tracks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular</h2>
        <div className="flex flex-col">
          {tracks.map((track, index) => (
            <div
              key={track._id.toString()}
              className="flex items-center p-2 rounded-md hover:bg-white/10 transition group"
            >
              <div className="w-8 text-zinc-400 text-right mr-4">{index + 1}</div>
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={track.thumbnailUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop'}
                  alt={track.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <Link href={`/track/${track._id}`} className="font-medium hover:underline truncate block">
                  {track.title}
                </Link>
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

      {/* Popular Albums */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album) => (
            <Link
              key={album._id.toString()}
              href={`/album/${album._id}`}
              className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800 transition group"
            >
              <div className="relative aspect-square mb-4">
                <Image
                  src={album.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
                  alt={album.title}
                  fill
                  className="object-cover rounded shadow-lg"
                />
              </div>
              <p className="font-bold truncate">{album.title}</p>
              <p className="text-sm text-zinc-400 mt-1">
                {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Unknown Year'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
