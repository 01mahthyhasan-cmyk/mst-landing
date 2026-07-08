import mongoose from 'mongoose';

const MediaFileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },        // bytes
    url: { type: String, required: true },          // public URL or path
    folder: { type: String, default: 'general' },
    tags: { type: [String], default: [] },
    altText: {
      en: { type: String, default: '' },
      ta: { type: String, default: '' },
    },
    // Reverse references — which content entries use this file
    usedIn: [
      {
        collection: String,
        documentId: String,
        field: String,
      },
    ],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

MediaFileSchema.index({ folder: 1, tags: 1 });
MediaFileSchema.index({ filename: 'text', originalName: 'text', altText: 'text' });

export default mongoose.models.MediaFile || mongoose.model('MediaFile', MediaFileSchema);
