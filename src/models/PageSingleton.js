import mongoose from 'mongoose';

const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };
const LArr = {
  en: { type: [String], default: [] },
  ta: { type: [String], default: [] },
};

/**
 * PageSingleton — one document per page slug.
 * The `content` Mixed field stores the page-specific data shape defined
 * by the report's Section 4 Translation Field Catalog.
 * Using Mixed allows each page to have its own content shape without
 * requiring separate models for each of the 14 page singletons.
 */
const PageSingletonSchema = new mongoose.Schema(
  {
    pageSlug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // Valid page slugs derived from report Section 4
      enum: [
        'home',
        'about',
        'services',
        'blog',
        'case-study',
        'team',
        'testimonials',
        'image-gallery',
        'video-gallery',
        'pricing',
        'faqs',
        'contact',
        'book-appointment',
        '404',
      ],
    },
    metaTitle: { ...L },
    metaDescription: { ...L },
    breadcrumb: {
      home: { ...L },
      current: { ...L },
    },
    // Page-specific content stored as a flexible Mixed document
    // Shape is documented in content_audit_and_cms_blueprint.md Section 4
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.PageSingleton ||
  mongoose.model('PageSingleton', PageSingletonSchema);
