import mongoose from 'mongoose';

// Tracks failed login attempts per key (IP or email) for rate limiting
const LoginAttemptSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true }, // IP or email
    attempts: { type: Number, default: 1 },
    updatedAt: { type: Date, default: Date.now, index: { expireAfterSeconds: 3600 } }, // auto-cleanup after 1h
  }
);

export default mongoose.models.LoginAttempt ||
  mongoose.model('LoginAttempt', LoginAttemptSchema);
