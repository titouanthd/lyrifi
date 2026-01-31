import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';
import Track from '@/models/Track';
import Artist from '@/models/Artist';
import { Clock3 } from 'lucide-react';
import Link from 'next/link';

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;

  await connectDB();

  const album = await Album.findById(id).populate('artistId');

  if (!album) {
    notFound();
  }

  const tracks = await Track.find({ albumId: id }).sort({ title: 1 });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="relative h-48 w-48 md:h-64 md:w-64 flex-shrink-0">
          <Image
            src={album.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
            alt={album.title}
            fill
            className="object-cover rounded shadow-2xl"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase tracking-wider">Album</span>
          <h1 className="text-5xl md:text-8xl font-black">{album.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Link href={`/artist/${album.artistId?._id}`} className="font-bold hover:underline">
              {album.artistId?.name}
            </Link>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">
              {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Unknown Year'}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">{tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* Track List */}
      <section>
        <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-zinc-400 text-sm mb-4">
          <span>#</span>
          <span>Title</span>
          <Clock3 size={16} />
        </div>
        <div className="flex flex-col">
          {tracks.map((track, index) => (
            <div
              key={track._id.toString()}
              className="grid grid-cols-[16px_1fr_auto] gap-4 items-center p-2 px-4 rounded-md hover:bg-white/10 transition group"
            >
              <div className="text-zinc-400 text-right">{index + 1}</div>
              <div className="flex flex-col min-w-0">
                <Link href={`/track/${track._id}`} className="font-medium hover:underline truncate block">
                  {track.title}
                </Link>
                <span className="text-sm text-zinc-400 truncate">
                   {album.artistId?.name}
                </span>
              </div>
              <div className="text-sm text-zinc-400 pl-4">
                {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
