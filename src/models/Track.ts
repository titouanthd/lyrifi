import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ITrack extends Document {
  title: string;
  mbid: string;
  albumId: mongoose.Types.ObjectId;
  artistId: mongoose.Types.ObjectId;
  duration: number; // in seconds
  youtube_id?: string;
  thumbnailUrl?: string;
}

const TrackSchema = new Schema<ITrack>({
  title: { type: String, required: true },
  mbid: { type: String, required: true, unique: true },
  albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  duration: { type: Number, required: true },
  youtube_id: { type: String },
  thumbnailUrl: { type: String },
}, { timestamps: true });

export default models.Track || model<ITrack>('Track', TrackSchema);
