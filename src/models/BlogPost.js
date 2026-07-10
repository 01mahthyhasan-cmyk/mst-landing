import mongoose from 'mongoose';

const LocalizedString = {
  en: { type: String, default: '' },
  ta: { type: String, default: '' },
};

const BlogPostSchema = new mongoose.Schema(
  {
    title: { ...LocalizedString },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-z0-9-_]+$/, 'Slug must be lowercase alphanumeric'],
      index: true,
    },
    category: { ...LocalizedString },
    image: { type: String, default: '' },             // media ID or path
    author: { ...LocalizedString },
    publishDate: { type: Date, default: null },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },                  // string or structured
    tags: {
      en: { type: [String], default: [] },
      ta: { type: [String], default: [] },
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
