import { connectDB } from '@/lib/db';
import RefreshToken from '@/models/RefreshToken';
import User from '@/models/User';
import { verifyRefreshToken, signAccessToken, buildAccessCookie } from '@/lib/auth';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';

const REFRESH_COOKIE = process.env.ADMIN_REFRESH_COOKIE || 'mst_admin_refresh';

export async function POST(request) {
  await connectDB();
  const ip = getClientIP(request);

  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${REFRESH_COOKIE}=([^;]+)`));
  const rawToken = match?.[1];

  if (!rawToken) {
    return Response.json({ success: false, message: 'No refresh token' }, { status: 401 });
  }

  const { valid, payload } = await verifyRefreshToken(rawToken);
  if (!valid) {
    return Response.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
  }

  // Verify the token exists in DB (rotation: revoke old, issue new)
  const tokenHash = RefreshToken.hashToken(rawToken);
  const stored = await RefreshToken.findOne({ tokenHash, revoked: false });

  if (!stored || stored.expiresAt < new Date()) {
    return Response.json({ success: false, message: 'Refresh token expired or revoked' }, { status: 401 });
  }

  const user = await User.findById(payload.sub);
  if (!user || user.status === 'suspended') {
    return Response.json({ success: false, message: 'User not found or suspended' }, { status: 401 });
  }

  // Revoke old token
  await RefreshToken.deleteOne({ _id: stored._id });

  // Issue new access token
  const newPayload = { sub: user._id.toString(), email: user.email, role: user.role, name: user.name };
  const newAccessToken = await signAccessToken(newPayload);

  await writeAuditLog({ userId: user._id.toString(), userEmail: user.email, action: 'token_refresh', ipAddress: ip });

  const cookie = buildAccessCookie(newAccessToken);
  const isSecure = process.env.NODE_ENV === 'production';

  const response = Response.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    `${cookie.name}=${cookie.value}; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Strict; Path=${cookie.path}; Max-Age=${cookie.maxAge}`
  );
  return response;
}
