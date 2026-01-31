import React from 'react';
import { render, screen } from '@testing-library/react';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Artist from '@/models/Artist';
import Album from '@/models/Album';
import Track from '@/models/Track';
import ArtistPage from '@/app/artist/[id]/page';
import AlbumPage from '@/app/album/[id]/page';
import TrackPage from '@/app/track/[id]/page';
import connectDB from '@/lib/mongodb';

let mongoServer: MongoMemoryServer;

jest.setTimeout(60000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Artist.deleteMany({});
  await Album.deleteMany({});
  await Track.deleteMany({});
});

describe('Route Pages', () => {
  it('renders ArtistPage correctly', async () => {
    const artist = await new Artist({
      name: 'Test Artist',
      mbid: 'artist-1',
      bio: 'Test bio',
      monthlyListeners: 1234
    }).save();

    const params = Promise.resolve({ id: artist._id.toString() });
    const page = await ArtistPage({ params });
    render(page);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('1,234 monthly listeners')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });

  it('renders AlbumPage correctly', async () => {
    const artist = await new Artist({ name: 'Test Artist', mbid: 'artist-1' }).save();
    const album = await new Album({
      title: 'Test Album',
      mbid: 'album-1',
      artistId: artist._id,
      releaseDate: new Date('2023-01-01')
    }).save();
    await new Track({
        title: 'Test Track',
        mbid: 'track-1',
        artistId: artist._id,
        albumId: album._id,
        duration: 200
    }).save();

    const params = Promise.resolve({ id: album._id.toString() });
    const page = await AlbumPage({ params });
    render(page);

    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getAllByText('Test Artist').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Test Track')).toBeInTheDocument();
  });

  it('renders TrackPage correctly', async () => {
    const artist = await new Artist({ name: 'Test Artist', mbid: 'artist-1', imageUrl: 'https://example.com/artist.jpg' }).save();
    const album = await new Album({ title: 'Test Album', mbid: 'album-1', artistId: artist._id, coverArtUrl: 'https://example.com/album.jpg' }).save();
    const track = await new Track({
      title: 'Test Track',
      mbid: 'track-1',
      artistId: artist._id,
      albumId: album._id,
      duration: 205,
      youtube_id: 'yt-123'
    }).save();

    const params = Promise.resolve({ id: track._id.toString() });
    const page = await TrackPage({ params });
    render(page);

    expect(screen.getByText('Test Track')).toBeInTheDocument();

    expect(screen.getAllByText('Test Artist').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Test Album').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('yt-123')).toBeInTheDocument();
    expect(screen.getByText('3m 25s')).toBeInTheDocument();
  });
});
