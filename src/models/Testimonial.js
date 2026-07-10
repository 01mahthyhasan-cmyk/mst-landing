import mongoose from 'mongoose';

const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };

const TestimonialSchema = new mongoose.Schema(
  {
    authorName: { ...L },
    authorRole: { ...L },
    authorImage: { type: String, default: '' },
    quote: { ...L },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
