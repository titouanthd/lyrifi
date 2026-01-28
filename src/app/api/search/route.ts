import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Track from '@/models/Track';
import Artist from '@/models/Artist';
import Album from '@/models/Album';
import Playlist from '@/models/Playlist';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
      });
    }

    await connectDB();

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');

    // 1. Find matching artists
    const artists = await Artist.find({ name: regex }).sort({ name: 1 }).limit(20);
    const matchingArtistIds = artists.map(a => a._id);

    // 2. Find matching tracks (by title or artist name)
    const tracks = await Track.find({
      $or: [
        { title: regex },
        { artistId: { $in: matchingArtistIds } }
      ]
    })
    .populate('artistId')
    .populate('albumId')
    .sort({ title: 1 })
    .limit(20);

    // 3. Find matching albums (by title or artist name)
    const albums = await Album.find({
      $or: [
        { title: regex },
        { artistId: { $in: matchingArtistIds } }
      ]
    })
    .populate('artistId')
    .sort({ title: 1 })
    .limit(20);

    // 4. Find matching playlists (by name, public only for now)
    const playlists = await Playlist.find({
      name: regex,
      privacy: 'Public'
    })
    .sort({ name: 1 })
    .limit(20);

    return NextResponse.json({
      tracks,
      artists,
      albums,
      playlists
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
