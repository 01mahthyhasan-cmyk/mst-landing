import mongoose from 'mongoose';

const PreviewStoreSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  pageData: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now, expires: 1800 } // Auto-delete preview drafts after 30 minutes
}, { timestamps: true });

export default mongoose.models.PreviewStore || mongoose.model('PreviewStore', PreviewStoreSchema);
