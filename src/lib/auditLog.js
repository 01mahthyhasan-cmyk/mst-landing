import { connectDB } from './db.js';
import AuditLog from '../models/AuditLog.js';

/**
 * Write an audit log entry.
 * Called on: login success/failure, logout, password change, role change,
 *            content publish/unpublish/delete, user create/suspend.
 *
 * @param {object} opts
 * @param {string}  opts.userId       - Performing user's ID (or 'anonymous')
 * @param {string}  opts.userEmail    - Performing user's email
 * @param {string}  opts.action       - e.g. 'login_success', 'content_publish'
 * @param {string}  [opts.targetCollection] - Collection name affected
 * @param {string}  [opts.targetId]   - Document ID affected
 * @param {string}  [opts.ipAddress]  - Requester IP
 * @param {object}  [opts.meta]       - Any extra context
 */
export async function writeAuditLog(opts) {
  try {
    await connectDB();
    await AuditLog.create({
      userId: opts.userId || 'anonymous',
      userEmail: opts.userEmail || '',
      action: opts.action,
      targetCollection: opts.targetCollection || null,
      targetId: opts.targetId || null,
      ipAddress: opts.ipAddress || null,
      meta: opts.meta || {},
      timestamp: new Date(),
    });
  } catch (err) {
    // Audit log failures must never crash the main request
    console.error('[auditLog] Failed to write audit entry:', err.message);
  }
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
