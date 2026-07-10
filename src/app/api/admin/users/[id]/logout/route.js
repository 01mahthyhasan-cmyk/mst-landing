import { connectDB } from '@/lib/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';

export async function POST(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'manage_users');
  if (error) return error;

  await connectDB();
  const { id } = await params;

  const user = await User.findById(id);
  if (!user) return apiError('User not found', 404);

  // Revoke all refresh tokens for this user
  await RefreshToken.deleteMany({ userId: id });

  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'force_logout_user', targetCollection: 'users',
    targetId: id, ipAddress: ip,
    meta: { targetEmail: user.email },
  });

  return apiOk({ message: 'User refresh tokens revoked. User forced out.' });
}
