import { connectDB } from '@/lib/db';
import RefreshToken from '@/models/RefreshToken';
import { getAdminSession } from '@/lib/auth';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'mst_admin_session';
const REFRESH_COOKIE = process.env.ADMIN_REFRESH_COOKIE || 'mst_admin_refresh';

export async function POST(request) {
  await connectDB();
  const ip = getClientIP(request);
  const session = await getAdminSession();

  // Revoke all refresh tokens for this user
  if (session?.sub) {
    await RefreshToken.deleteMany({ userId: session.sub });
    await writeAuditLog({
      userId: session.sub,
      userEmail: session.email,
      action: 'logout',
      ipAddress: ip,
    });
  }

  const isSecure = process.env.NODE_ENV === 'production';
  const clearAccess = `${COOKIE_NAME}=; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=0`;
  const clearRefresh = `${REFRESH_COOKIE}=; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Strict; Path=/; Max-Age=0`;

  const response = Response.json({ success: true, message: 'Logged out' });
  response.headers.append('Set-Cookie', clearAccess);
  response.headers.append('Set-Cookie', clearRefresh);
  return response;
}
