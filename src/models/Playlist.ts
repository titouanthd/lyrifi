import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  coverUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  tracks: mongoose.Types.ObjectId[];
  privacy: 'Public' | 'Private';
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  description: { type: String },
  coverUrl: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  privacy: { type: String, enum: ['Public', 'Private'], default: 'Private' },
}, { timestamps: true });

export default models.Playlist || model<IPlaylist>('Playlist', PlaylistSchema);
