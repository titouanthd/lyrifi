import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  mbid: string;
  artistId: mongoose.Types.ObjectId;
  releaseDate?: Date;
  coverArtUrl?: string;
}

const AlbumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  mbid: { type: String, required: true, unique: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  releaseDate: { type: Date },
  coverArtUrl: { type: String },
}, { timestamps: true });

export default models.Album || model<IAlbum>('Album', AlbumSchema);
