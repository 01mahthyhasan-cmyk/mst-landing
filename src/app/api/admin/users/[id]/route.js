import { connectDB } from '@/lib/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';

// GET /api/admin/users/[id]
export async function GET(request, { params }) {
  const { error } = await adminGuard(request, 'manage_users');
  if (error) return error;
  await connectDB();
  const { id } = await params;
  const user = await User.findById(id).lean();
  if (!user) return apiError('User not found', 404);
  return apiOk({ user });
}

// PATCH /api/admin/users/[id] — edit role, status, name
export async function PATCH(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'manage_users');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  await connectDB();
  const { id } = await params;
  const user = await User.findById(id);
  if (!user) return apiError('User not found', 404);

  const allowed = ['name', 'role', 'status', 'twoFactorEnabled'];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  // Prevent super_admin from demoting themselves
  if (updates.role && id === session.sub) {
    return apiError('Cannot change your own role', 403);
  }

  if (updates.twoFactorEnabled === false) {
    user.twoFactorSecret = null;
  }

  const oldRole = user.role;
  const oldStatus = user.status;
  Object.assign(user, updates);
  await user.save();

  // Audit role and status changes separately
  if (updates.role && updates.role !== oldRole) {
    await writeAuditLog({
      userId: session.sub, userEmail: session.email,
      action: 'role_change', targetCollection: 'users',
      targetId: id, ipAddress: ip,
      meta: { from: oldRole, to: updates.role },
    });
  }
  if (updates.status && updates.status !== oldStatus) {
    const action = updates.status === 'suspended' ? 'user_suspend' : 'user_activate';
    await writeAuditLog({
      userId: session.sub, userEmail: session.email,
      action, targetCollection: 'users', targetId: id, ipAddress: ip,
    });
    // Force logout suspended users
    if (updates.status === 'suspended') {
      await RefreshToken.deleteMany({ userId: id });
    }
  }

  return apiOk({ user });
}

// DELETE /api/admin/users/[id] — soft-delete (suspend) not hard-delete
export async function DELETE(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'manage_users');
  if (error) return error;

  await connectDB();
  const { id } = await params;
  if (id === session.sub) return apiError('Cannot deactivate your own account', 403);

  const user = await User.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });
  if (!user) return apiError('User not found', 404);

  await RefreshToken.deleteMany({ userId: id });
  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'user_suspend', targetCollection: 'users', targetId: id, ipAddress: ip,
  });

  return apiOk({ message: 'User suspended', user });
}
