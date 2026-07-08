import { connectDB } from '@/lib/db';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import {
  signAccessToken,
  signRefreshToken,
  buildAccessCookie,
  buildRefreshCookie,
} from '@/lib/auth';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
} from '@/lib/rateLimit';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';

export async function POST(request) {
  await connectDB();
  const ip = getClientIP(request);

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // ── Rate limit check (IP + email) ──────────────────────────────────────────
  const [ipLimit, emailLimit] = await Promise.all([
    checkRateLimit(ip),
    checkRateLimit(normalizedEmail),
  ]);

  if (ipLimit.locked || emailLimit.locked) {
    const remainingMin = Math.ceil(
      Math.max(ipLimit.remainingMs, emailLimit.remainingMs) / 60000
    );
    await writeAuditLog({
      userId: 'anonymous', userEmail: normalizedEmail,
      action: 'login_failure', ipAddress: ip,
      meta: { reason: 'rate_limited', remainingMin },
    });
    return Response.json(
      { success: false, message: `Too many failed attempts. Try again in ${remainingMin} minute(s).` },
      { status: 429 }
    );
  }

  // ── Find user ───────────────────────────────────────────────────────────────
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  const fail = async (reason) => {
    await recordFailedAttempt(ip);
    await recordFailedAttempt(normalizedEmail);
    await writeAuditLog({
      userId: user?._id?.toString() || 'anonymous',
      userEmail: normalizedEmail,
      action: 'login_failure',
      ipAddress: ip,
      meta: { reason },
    });
    return Response.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
  };

  if (!user) return fail('user_not_found');
  if (user.status === 'suspended') {
    return Response.json({ success: false, message: 'Account suspended. Contact an administrator.' }, { status: 403 });
  }

  const passwordValid = await user.verifyPassword(password);
  if (!passwordValid) return fail('wrong_password');

  // ── Success ─────────────────────────────────────────────────────────────────
  await clearAttempts(ip);
  await clearAttempts(normalizedEmail);

  if (user.twoFactorEnabled) {
    const tempPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      type: '2fa_temp'
    };
    const tempToken = await signAccessToken(tempPayload);
    return Response.json({
      success: true,
      twoFactorRequired: true,
      tempToken
    });
  }

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

  // Store hashed refresh token
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
    action: 'login_success',
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
