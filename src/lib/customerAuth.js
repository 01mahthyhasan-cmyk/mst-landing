import crypto from 'crypto';
import { cookies } from 'next/headers';
import { connectDB } from './db';
import CustomerSession from '../models/CustomerSession';
import OtpRequest from '../models/OtpRequest';

const SESSION_COOKIE_NAME = 'mst_customer_session';
const SESSION_EXPIRY_MINUTES = 30; // 30 minutes session

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'fallback_jwt_secret_for_otp_and_session';
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtp(otp) {
  return crypto
    .createHmac('sha256', getJwtSecret())
    .update(otp)
    .digest('hex');
}

export async function createCustomerSession(phone) {
  await connectDB();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000);

  // Store in DB
  await CustomerSession.create({
    phone,
    token,
    expiresAt,
  });

  // Set HTTP-only, secure, sameSite cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function getCustomerSessionPhone() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    await connectDB();
    const session = await CustomerSession.findOne({ token });
    if (!session) return null;

    // Check manual expiration in case TTL index hasn't run yet
    if (session.expiresAt && session.expiresAt < new Date()) {
      await CustomerSession.deleteOne({ _id: session._id });
      return null;
    }

    return session.phone;
  } catch (err) {
    console.error('[customerAuth] Failed to retrieve customer session:', err.message);
    return null;
  }
}

export async function clearCustomerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await connectDB();
      await CustomerSession.deleteOne({ token });
    }
  } catch (err) {
    console.error('[customerAuth] Failed to delete session from DB:', err.message);
  }

  // Clear cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
