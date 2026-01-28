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

    const [artists, playlists] = await Promise.all([
      await Artist.find({name: regex}).sort({name: 1}).limit(20).exec() as Artist[],
      await Playlist.find({ name: regex, privacy: 'Public' }).sort({ name: 1 }).limit(20).exec() as any[]
    ]);

    const matchingArtistIds = artists.map(a => a._id);

    const [tracks, albums] = await Promise.all([
      Track.find({
        $or: [{ title: regex }, { artistId: { $in: matchingArtistIds } }]
      }).populate('artistId').populate('albumId').sort({ title: 1 }).limit(20).exec(),

      Album.find({
        $or: [{ title: regex }, { artistId: { $in: matchingArtistIds } }]
      }).populate('artistId').sort({ title: 1 }).limit(20).exec()
    ]);

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
