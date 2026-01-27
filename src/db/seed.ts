import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import Artist from '../models/Artist';
import Album from '../models/Album';
import Track from '../models/Track';
import User from '../models/User';
import Playlist from '../models/Playlist';

export async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:toor@localhost:27061/lyrifi?authSource=admin';
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Artist.deleteMany({}),
      Album.deleteMany({}),
      Track.deleteMany({}),
      User.deleteMany({}),
      Playlist.deleteMany({}),
    ]);
    console.log('Database cleared.');

    // Load fixtures
    const artistsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/artists.json'), 'utf8'));
    const albumsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/albums.json'), 'utf8'));
    const tracksData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/tracks.json'), 'utf8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/users.json'), 'utf8'));
    const playlistsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/playlists.json'), 'utf8'));

    // Insert Artists
    console.log('Seeding artists...');
    await Artist.insertMany(artistsData);

    // Insert Albums
    console.log('Seeding albums...');
    await Album.insertMany(albumsData);

    // Insert Tracks
    console.log('Seeding tracks...');
    await Track.insertMany(tracksData);

    // Insert Users (using .save() for password hashing hook)
    console.log('Seeding users...');
    for (const userData of usersData) {
      const user = new User(userData);
      await user.save();
    }

    // Insert Playlists
    console.log('Seeding playlists...');
    await Playlist.insertMany(playlistsData);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      mongoose.connection.close();
      process.exit(1);
    });
}
