import mongoose from 'mongoose';

const SmsRateLimitSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['otp', 'report'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 3600 }, // Documents self-clean after 1 hour
  },
});

export default mongoose.models.SmsRateLimit || mongoose.model('SmsRateLimit', SmsRateLimitSchema);
