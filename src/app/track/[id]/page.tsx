import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Track from '@/models/Track';
import Album from '@/models/Album';
import Artist from '@/models/Artist';
import { Play, Clock3, Calendar, Music } from 'lucide-react';
import Link from 'next/link';

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;

  await connectDB();

  const track = await Track.findById(id)
    .populate('artistId')
    .populate('albumId');

  if (!track) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
        <div className="relative h-64 w-64 md:h-80 md:w-80 flex-shrink-0 shadow-2xl">
          <Image
            src={track.thumbnailUrl || track.albumId?.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'}
            alt={track.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-4 text-center md:text-left">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-400">Song</span>
          <h1 className="text-4xl md:text-7xl font-black">{track.title}</h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
            <div className="flex items-center gap-2">
              <Image
                src={track.artistId?.imageUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop'}
                alt={track.artistId?.name || 'Artist'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <Link href={`/artist/${track.artistId?._id}`} className="font-bold hover:underline">
                {track.artistId?.name}
              </Link>
            </div>
            <span className="text-zinc-400">•</span>
            <Link href={`/album/${track.albumId?._id}`} className="text-zinc-300 hover:underline">
              {track.albumId?.title}
            </Link>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-400">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Music className="text-purple-500" /> Track Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 uppercase font-semibold">MusicBrainz ID</p>
                <p className="font-mono text-xs bg-black/40 p-2 rounded break-all">{track.mbid}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 uppercase font-semibold">YouTube ID</p>
                <p className="font-mono text-xs bg-black/40 p-2 rounded break-all">{track.youtube_id || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 uppercase font-semibold">Duration</p>
                <p className="flex items-center gap-2 text-zinc-300">
                  <Clock3 size={16} /> {Math.floor(track.duration / 60)}m {track.duration % 60}s
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-zinc-500 uppercase font-semibold">Released</p>
                <p className="flex items-center gap-2 text-zinc-300">
                  <Calendar size={16} /> {track.albumId?.releaseDate ? new Date(track.albumId.releaseDate).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5 h-full">
             <h2 className="text-2xl font-bold mb-6">From the Album</h2>
             <Link href={`/album/${track.albumId?._id}`} className="group block">
                <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={track.albumId?.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'}
                    alt={track.albumId?.title || 'Album'}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h3 className="font-bold text-xl group-hover:underline">{track.albumId?.title}</h3>
                <p className="text-zinc-400 mt-1">{track.artistId?.name}</p>
             </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
