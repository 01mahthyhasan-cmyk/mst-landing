import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'content_admin', 'content_editor'],
      required: true,
      default: 'content_editor',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, default: null },
    lastLoginAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Never return passwordHash or 2FA secret in queries by default
UserSchema.set('toJSON', {
  transform(_, obj) {
    delete obj.passwordHash;
    delete obj.twoFactorSecret;
    return obj;
  },
});

UserSchema.methods.verifyPassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (plain) {
  return bcrypt.hash(plain, 12);
};

UserSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
