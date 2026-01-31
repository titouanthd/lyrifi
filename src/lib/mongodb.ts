import mongoose from 'mongoose';
import * as Mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:toor@localhost:27061/lyrifi_db_dev?authSource=admin';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof import('mongoose') | null;
  promise: Promise<typeof import('mongoose')> | null;
}

let cached = (global as unknown as { mongoose: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseCache }).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI || MONGODB_URI;
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((conn: typeof mongoose) => {
      return conn;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
