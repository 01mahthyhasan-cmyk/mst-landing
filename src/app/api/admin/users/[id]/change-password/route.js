import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { adminGuard, parseBody, apiOk, apiError } from '@/lib/apiHelpers';
import { validatePasswordPolicy } from '@/lib/auth';
import { writeAuditLog } from '@/lib/auditLog';

export async function POST(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'read');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { id } = await params;

  // Users may only change their own password; super_admin can reset any
  if (session.sub !== id && session.role !== 'super_admin') {
    return apiError('Forbidden', 403);
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return apiError('currentPassword and newPassword are required', 400);
  }

  // Validate policy
  const policyError = validatePasswordPolicy(newPassword);
  if (policyError) return apiError(policyError, 400);

  await connectDB();
  const user = await User.findById(id).select('+passwordHash');
  if (!user) return apiError('User not found', 404);

  // Verify current password (skip for super_admin resetting another user's password)
  if (session.sub === id) {
    const isValid = await user.verifyPassword(currentPassword);
    if (!isValid) {
      return apiError('Current password is incorrect', 401);
    }
  }

  await user.setPassword(newPassword);
  await user.save();

  await writeAuditLog({
    userId: session.sub,
    userEmail: session.email,
    action: 'password_change',
    targetCollection: 'users',
    targetId: id,
    ipAddress: ip,
  });

  return apiOk({ message: 'Password updated successfully' });
}
