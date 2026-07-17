import mongoose from 'mongoose';

const SocialPostSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['facebook', 'instagram', 'tiktok', 'youtube'],
      index: true,
    },
    postUrl: {
      type: String,
      required: true,
    },
    embedHtml: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    influencerName: {
      type: String,
      default: '',
    },
    influencerHandle: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SocialPost || mongoose.model('SocialPost', SocialPostSchema);
