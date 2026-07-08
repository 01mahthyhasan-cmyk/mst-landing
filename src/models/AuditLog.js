import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, default: '' },
  action: {
    type: String,
    required: true,
    enum: [
      'login_success',
      'login_failure',
      'logout',
      'password_change',
      'role_change',
      'user_create',
      'user_suspend',
      'user_activate',
      'user_force_logout',
      'content_create',
      'content_update',
      'content_publish',
      'content_unpublish',
      'content_delete',
      'media_upload',
      'media_delete',
      'settings_update',
      'token_refresh',
    ],
  },
  targetCollection: { type: String, default: null },
  targetId: { type: String, default: null },
  ipAddress: { type: String, default: null },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Audit logs are append-only — no updates/deletes via model
AuditLogSchema.set('strict', true);

export default mongoose.models.AuditLog ||
  mongoose.model('AuditLog', AuditLogSchema);
