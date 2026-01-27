import { Schema, Document, model, models } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  mbid: string;
  bio?: string;
  imageUrl?: string;
  genres: string[];
}

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  mbid: { type: String, required: true, unique: true },
  bio: { type: String },
  imageUrl: { type: String },
  genres: [{ type: String }],
}, { timestamps: true });

export default models.Artist || model<IArtist>('Artist', ArtistSchema);
