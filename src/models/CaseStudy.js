import mongoose from 'mongoose';

const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };

const SolutionItemSchema = new mongoose.Schema({ title: { ...L }, desc: { ...L } }, { _id: false });
const ResultItemSchema = new mongoose.Schema({ title: { ...L }, desc: { ...L } }, { _id: false });
const FAQItemSchema = new mongoose.Schema({ q: { ...L }, a: { ...L } }, { _id: false });

const CaseStudySchema = new mongoose.Schema(
  {
    title: { ...L },
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9-_]+$/, index: true },
    category: { ...L },
    image: { type: String, default: '' },
    client: { ...L },
    date: { ...L },          // e.g. "March 2025" — localized
    result: { ...L },        // One-line outcome
    overview: { ...L },
    challenge: { ...L },
    solution: { type: [SolutionItemSchema], default: [] },
    results: { type: [ResultItemSchema], default: [] },
    faqs: { type: [FAQItemSchema], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);
