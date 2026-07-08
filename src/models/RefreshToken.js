import mongoose from 'mongoose';
import crypto from 'crypto';

const RefreshTokenSchema = new mongoose.Schema(
  {
    // Stored as SHA-256 hash of the actual token — never store plaintext
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // TTL index auto-cleanup
    ipAddress: { type: String },
    userAgent: { type: String },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RefreshTokenSchema.statics.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default mongoose.models.RefreshToken ||
  mongoose.model('RefreshToken', RefreshTokenSchema);
