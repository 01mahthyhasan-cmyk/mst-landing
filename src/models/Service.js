import mongoose from 'mongoose';

// Localized string shape: { en: '', ta: '' }
const LocalizedString = {
  en: { type: String, default: '' },
  ta: { type: String, default: '' },
};

const ProcessStepSchema = new mongoose.Schema({
  step: { type: String, required: true },      // e.g. "01"
  title: { ...LocalizedString },
  desc: { ...LocalizedString },
}, { _id: false });

const FAQItemSchema = new mongoose.Schema({
  q: { ...LocalizedString },
  a: { ...LocalizedString },
}, { _id: false });

const ServiceSchema = new mongoose.Schema(
  {
    name: { ...LocalizedString },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-z0-9-_]+$/, 'Slug must be lowercase alphanumeric with hyphens/underscores'],
      index: true,
    },
    iconClass: { type: String, default: '' },         // FontAwesome class
    listingIcon: { type: String, default: '' },       // Media library ID or path
    heroImage: { type: String, default: '' },         // Media library ID or path
    benefitImage: { type: String, default: '' },
    desc1: { ...LocalizedString },
    desc2: { ...LocalizedString },
    whyTitle: { ...LocalizedString },
    whyDesc: { ...LocalizedString },
    whyPoint1: { ...LocalizedString },
    whyPoint2: { ...LocalizedString },
    whyImg1: { type: String, default: '' },
    whyImg2: { type: String, default: '' },
    process: { type: [ProcessStepSchema], default: [] },
    benefits: {
      en: { type: [String], default: [] },
      ta: { type: [String], default: [] },
    },
    faqs: { type: [FAQItemSchema], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
