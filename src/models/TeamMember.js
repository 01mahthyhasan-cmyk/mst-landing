import mongoose from 'mongoose';

const L = { en: { type: String, default: '' }, ta: { type: String, default: '' } };

const EducationSchema = new mongoose.Schema({
  degree: { ...L },
  details: { ...L },
}, { _id: false });

const SkillSchema = new mongoose.Schema({
  name: { ...L },
  percentage: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { ...L },
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9-_]+$/, index: true },
    role: { ...L },
    image: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '', match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    position: { ...L },
    location: { ...L },
    bio: { ...L },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
