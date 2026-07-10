import { connectDB } from '@/lib/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import {
  verifyAccessToken,
  signAccessToken,
  signRefreshToken,
  buildAccessCookie,
  buildRefreshCookie,
} from '@/lib/auth';
import { verifyTOTP, decryptSecret } from '@/lib/totp';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
} from '@/lib/rateLimit';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';
import { parseBody, apiError } from '@/lib/apiHelpers';

export async function POST(request) {
  await connectDB();
  const ip = getClientIP(request);

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { tempToken, code } = body;
  if (!tempToken || !code) {
    return Response.json({ success: false, message: 'tempToken and code are required' }, { status: 400 });
  }

  // 1. Verify Temp Token
  const verifyRes = await verifyAccessToken(tempToken);
  if (!verifyRes.valid || verifyRes.payload?.type !== '2fa_temp') {
    return Response.json({ success: false, message: 'Session expired. Please log in again.' }, { status: 401 });
  }

  const userId = verifyRes.payload.sub;
  const userEmail = verifyRes.payload.email;

  // 2. Rate limit check
  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit(ip),
    checkRateLimit(userEmail),
  ]);

  if (ipLimit.locked || emailLimit.locked) {
    const remainingMin = Math.ceil(
      Math.max(ipLimit.remainingMs, emailLimit.remainingMs) / 60000
    );
    return Response.json(
      { success: false, message: `Too many failed attempts. Try again in ${remainingMin} minute(s).` },
      { status: 429 }
    );
  }

  // 3. Find User & Verify 2FA
  const user = await User.findById(userId);
  if (!user || !user.twoFactorSecret) {
    return Response.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  const decryptedSecret = decryptSecret(user.twoFactorSecret);
  const isOtpValid = verifyTOTP(decryptedSecret, code);

  if (!isOtpValid) {
    await recordFailedAttempt(ip);
    await recordFailedAttempt(userEmail);
    await writeAuditLog({
      userId: user._id.toString(),
      userEmail: user.email,
      action: 'login_failure_2fa',
      ipAddress: ip,
      meta: { reason: 'wrong_totp_code' },
    });
    return Response.json({ success: false, message: 'Invalid 2FA code' }, { status: 401 });
  }

  // 4. Success — Issue real session tokens
  await clearAttempts(ip);
  await clearAttempts(userEmail);

  const tokenPayload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ]);

  // Store refresh token
  const tokenHash = RefreshToken.hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    tokenHash,
    userId: user._id,
    expiresAt,
    ipAddress: ip,
    userAgent: request.headers.get('user-agent') || '',
  });

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  await writeAuditLog({
    userId: user._id.toString(),
    userEmail: user.email,
    action: 'login_success_2fa',
    ipAddress: ip,
  });

  const response = Response.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });

  // Set httpOnly cookies
  const accessCookie = buildAccessCookie(accessToken);
  const refreshCookie = buildRefreshCookie(refreshToken);
  response.headers.append(
    'Set-Cookie',
    `${accessCookie.name}=${accessCookie.value}; HttpOnly; ${accessCookie.secure ? 'Secure; ' : ''}SameSite=Strict; Path=${accessCookie.path}; Max-Age=${accessCookie.maxAge}`
  );
  response.headers.append(
    'Set-Cookie',
    `${refreshCookie.name}=${refreshCookie.value}; HttpOnly; ${refreshCookie.secure ? 'Secure; ' : ''}SameSite=Strict; Path=${refreshCookie.path}; Max-Age=${refreshCookie.maxAge}`
  );

  return response;
}
