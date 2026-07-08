import mongoose from 'mongoose';

const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };

const NavItemSchema = new mongoose.Schema({
  label: { ...L },
  href: { type: String, default: '' },
  order: { type: Number, default: 0 },
  children: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { _id: false });

const SiteSettingsSchema = new mongoose.Schema(
  {
    // Only one document exists — enforced by singleton pattern
    singletonKey: { type: String, default: 'site_settings', unique: true },
    siteTitle: { type: String, default: 'MST Health Care' },
    siteDescription: { ...L },
    logo: { type: String, default: '/images/mst_logo.png' },
    favicon: { type: String, default: '/images/favicon.png' },
    phone1: { type: String, default: '065 205 4997' },
    phone2: { type: String, default: '076 295 1343' },
    phone3: { type: String, default: '076 225 1343' },
    email: { type: String, default: 'contact@msthealthcare.com' },
    address: { ...L },
    clinicHours: { ...L },
    copyright: { ...L },
    // Social links
    facebookLink: { type: String, default: 'https://www.facebook.com/people/MST-Health-Care/61590818814946/' },
    instagramLink: { type: String, default: '#' },
    whatsappLink: { type: String, default: '#' },
    twitterLink: { type: String, default: '#' },
    // Navigation (header menu) — stored as ordered array
    navigation: { type: [NavItemSchema], default: [] },
    // Footer
    footer: {
      quickLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
      medicalServices: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    // Shared blocks (common.* keys from report)
    sharedBlocks: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model('SiteSettings', SiteSettingsSchema);
