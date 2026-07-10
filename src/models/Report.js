import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cloudinaryVersion: {
      type: Number,  // Unix timestamp returned by Cloudinary e.g. 1752345678
      default: null,
    },
    cloudinaryResourceType: {
      type: String,
      required: true,
      enum: ['image', 'raw', 'video', 'auto'],  // include all types Cloudinary may return
    },
    cloudinaryFormat: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    linkToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    linkTokenExpiresAt: {
      type: Date,
      required: true,
    },
    linkSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
