import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Track from '../models/Track';
import Artist from '../models/Artist';
import Album from '../models/Album';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Track.deleteMany({});
  await Artist.deleteMany({});
  await Album.deleteMany({});
});

describe('Mongoose Models', () => {
  describe('User Model', () => {
    it('should create a user successfully and hash password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const validUser = new User(userData);
      const savedUser = await validUser.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password);
      
      const isMatch = await bcrypt.compare(userData.password, savedUser.password as string);
      expect(isMatch).toBe(true);
    });

    it('should fail to create a user with duplicate email', async () => {
      await User.init(); // Ensure indexes are built
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      await new User(userData).save();
      
      await expect(new User(userData).save()).rejects.toThrow();
    });
  });

  describe('Track Model', () => {
    it('should fail to create a track without an artistId', async () => {
      const trackData = {
        title: 'Song Title',
        mbid: 'track-mbid',
        duration: 240,
        // artistId missing
      };
      const track = new Track(trackData);
      await expect(track.save()).rejects.toThrow();
    });

    it('should create a track with valid relations', async () => {
      const artist = await new Artist({ name: 'Artist Name', mbid: 'artist-mbid' }).save();
      const album = await new Album({ title: 'Album Title', mbid: 'album-mbid', artistId: artist._id }).save();
      
      const trackData = {
        title: 'Song Title',
        mbid: 'track-mbid',
        duration: 240,
        artistId: artist._id,
        albumId: album._id,
      };
      const track = new Track(trackData);
      const savedTrack = await track.save();
      
      expect(savedTrack._id).toBeDefined();
      expect(savedTrack.artistId.toString()).toBe(artist._id.toString());
    });
  });

  describe('User Favorites Relations', () => {
    it('should accept Track ObjectIDs in favorites', async () => {
      const artist = await new Artist({ name: 'Artist', mbid: 'a1' }).save();
      const album = await new Album({ title: 'Album', mbid: 'al1', artistId: artist._id }).save();
      const track = await new Track({ title: 'Track', mbid: 't1', duration: 100, artistId: artist._id, albumId: album._id }).save();
      
      const user = new User({
        name: 'Fan',
        email: 'fan@example.com',
        favorites: [track._id]
      });
      const savedUser = await user.save();
      
      expect(savedUser.favorites).toHaveLength(1);
      expect(savedUser.favorites[0].toString()).toBe(track._id.toString());
    });
  });
});
