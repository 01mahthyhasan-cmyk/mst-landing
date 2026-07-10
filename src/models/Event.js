import mongoose from 'mongoose';

const LocalizedString = {
  en: { type: String, default: '' },
  ta: { type: String, default: '' },
};

const EventSchema = new mongoose.Schema(
  {
    title:       { ...LocalizedString },
    subtitle:    { ...LocalizedString },
    description: { ...LocalizedString },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'],
      index: true,
    },
    postedDate:  { type: Date, default: Date.now },
    mainImage:   { type: String, default: '' },  // public URL from MediaFile (/uploads/…)
    galleryImages: [
      {
        url:     { type: String, default: '' },
        mediaId: { type: String, default: '' }, // MediaFile._id reference (string)
        order:   { type: Number, default: 0 },
      },
    ],
    likes:  { type: Number, default: 0, min: 0 },
    views:  { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

EventSchema.index({ status: 1, postedDate: -1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
