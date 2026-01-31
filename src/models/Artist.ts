import {Schema, Document, model, models, Model} from 'mongoose';

export interface IArtist extends Document {
  name: string;
  mbid: string;
  bio?: string;
  imageUrl?: string;
  genres: string[];
  monthlyListeners?: number;
}

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  mbid: { type: String, required: true, unique: true },
  bio: { type: String },
  imageUrl: { type: String },
  genres: [{ type: String }],
  monthlyListeners: { type: Number, default: 0 },
}, { timestamps: true });

export default models.Artist || model('Artist', ArtistSchema) as Model<IArtist>;
