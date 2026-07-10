import { connectDB } from './db.js';
import LoginAttempt from '../models/LoginAttempt.js';

const MAX_ATTEMPTS = parseInt(process.env.LOGIN_MAX_ATTEMPTS || '5', 10);
const LOCKOUT_MS = parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '10', 10) * 60 * 1000;

/**
 * Check if an IP or email is currently locked out.
 * @param {string} key - IP address or email
 * @returns {{ locked: boolean, remainingMs: number }}
 */
export async function checkRateLimit(key) {
  await connectDB();
  const since = new Date(Date.now() - LOCKOUT_MS);

  const record = await LoginAttempt.findOne({ key, updatedAt: { $gte: since } });
  if (!record) return { locked: false, remainingMs: 0 };

  if (record.attempts >= MAX_ATTEMPTS) {
    const unlockAt = new Date(record.updatedAt.getTime() + LOCKOUT_MS);
    const remainingMs = unlockAt - Date.now();
    if (remainingMs > 0) {
      return { locked: true, remainingMs };
    }
    // Lockout expired — reset
    await LoginAttempt.deleteOne({ key });
  }

  return { locked: false, remainingMs: 0 };
}

/**
 * Increment failed attempt counter for a key (IP or email).
 */
export async function recordFailedAttempt(key) {
  await connectDB();
  await LoginAttempt.findOneAndUpdate(
    { key },
    { $inc: { attempts: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true }
  );
}

/**
 * Clear attempts on successful login.
 */
export async function clearAttempts(key) {
  await connectDB();
  await LoginAttempt.deleteOne({ key });
}
