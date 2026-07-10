import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_change_in_prod'
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_prod'
);

const ACCESS_EXPIRY = parseInt(process.env.JWT_ACCESS_EXPIRY || '900', 10); // 15 min
const REFRESH_EXPIRY = parseInt(process.env.JWT_REFRESH_EXPIRY || '604800', 10); // 7 days
const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'mst_admin_session';
const REFRESH_COOKIE = process.env.ADMIN_REFRESH_COOKIE || 'mst_admin_refresh';

// ─── Token Generation ───────────────────────────────────────────────────────

export async function signAccessToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_EXPIRY}s`)
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_EXPIRY}s`)
    .sign(REFRESH_SECRET);
}

// ─── Token Verification ─────────────────────────────────────────────────────

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

export async function signPreviewToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('300s') // 5 minutes
    .sign(ACCESS_SECRET);
}

export async function verifyPreviewToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}


// ─── Cookie Helpers ─────────────────────────────────────────────────────────

export function buildAccessCookie(token) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ACCESS_EXPIRY,
  };
}

export function buildRefreshCookie(token) {
  return {
    name: REFRESH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: REFRESH_EXPIRY,
  };
}

export function clearAuthCookies() {
  return [
    { name: COOKIE_NAME, value: '', maxAge: 0, path: '/', httpOnly: true, sameSite: 'strict' },
    { name: REFRESH_COOKIE, value: '', maxAge: 0, path: '/', httpOnly: true, sameSite: 'strict' },
  ];
}

// ─── Session Extraction (Server Components & Route Handlers) ────────────────

/**
 * Get the current admin session from cookies.
 * Returns null if not authenticated.
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await verifyAccessToken(token);
  if (!result.valid) return null;

  return result.payload;
}

export function validatePasswordPolicy(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase, one lowercase, one number, and one special character.',
    };
  }
  return { valid: true };
}

export { COOKIE_NAME, REFRESH_COOKIE };
