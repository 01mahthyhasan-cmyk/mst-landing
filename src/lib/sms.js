import { connectDB } from './db';
import SmsRateLimit from '../models/SmsRateLimit';

export function normalizePhoneForNotifyLk(phone) {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '94' + cleaned.substring(1);
  }
  return cleaned;
}

export function normalizeToE164(phone) {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '+94' + cleaned.substring(1);
  } else if (cleaned.startsWith('94')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+94' + cleaned;
  }
  return cleaned;
}

export function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Sri Lankan phone regex (covers +947..., 07..., 947...)
  const pattern = /^(?:\+94|0|94)?7[0-9]{8}$/;
  return pattern.test(cleaned);
}

/**
 * Check if a phone has exceeded SMS rate limit or cooldown.
 * @param {string} phone - E.164 phone number
 * @param {'otp' | 'report'} action
 * @returns {Promise<{ allowed: boolean, reason?: string, remainingSeconds?: number, message?: string }>}
 */
export async function checkSmsRateLimit(phone, action) {
  await connectDB();
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  
  // Count sends in the last hour
  const count = await SmsRateLimit.countDocuments({
    phone,
    action,
    createdAt: { $gte: oneHourAgo }
  });

  if (count >= 5) {
    return {
      allowed: false,
      reason: 'rate_limit',
      message: 'Rate limit exceeded. Maximum 5 SMS notifications per hour.'
    };
  }

  // Check 30s cooldown for OTP
  if (action === 'otp') {
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recent = await SmsRateLimit.findOne({
      phone,
      action,
      createdAt: { $gte: thirtySecondsAgo }
    }).sort({ createdAt: -1 });

    if (recent) {
      const remainingCooldown = Math.ceil((recent.createdAt.getTime() + 30 * 1000 - Date.now()) / 1000);
      return {
        allowed: false,
        reason: 'cooldown',
        remainingSeconds: remainingCooldown,
        message: `Please wait ${remainingCooldown} seconds before requesting another verification code.`
      };
    }
  }

  return { allowed: true };
}

/**
 * Record an SMS send event for rate limiting.
 */
export async function recordSmsSend(phone, action) {
  await connectDB();
  await SmsRateLimit.create({ phone, action });
}

export async function sendSms(to, message) {
  const normalized = normalizePhoneForNotifyLk(to);

  const userId = process.env.NOTIFYLK_USER_ID;
  const apiKey = process.env.NOTIFYLK_API_KEY;
  const senderId = process.env.NOTIFYLK_SENDER_ID || 'NotifyDEMO';

  // If environment variables are missing, fallback to console log for easy development testing
  if (!userId || !apiKey) {
    console.log(`\n--- [MOCK SMS SEND] ---`);
    console.log(`To: ${normalized} (${to})`);
    console.log(`Sender ID: ${senderId}`);
    console.log(`Message: ${message}`);
    console.log(`-----------------------\n`);
    return { status: 'success', mock: true };
  }

  const params = new URLSearchParams({
    user_id: userId,
    api_key: apiKey,
    sender_id: senderId,
    to: normalized,
    message,
  });

  const res = await fetch(`https://app.notify.lk/api/v1/send?${params}`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(`Notify.lk API returned HTTP status ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(`Notify.lk send failed: ${JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Checks the current account balance on Notify.lk.
 * Can be used by admin panels or scheduled tasks.
 */
export async function getNotifyLkStatus() {
  const userId = process.env.NOTIFYLK_USER_ID;
  const apiKey = process.env.NOTIFYLK_API_KEY;

  if (!userId || !apiKey) {
    return { status: 'mocked', acc_balance: 100.0 };
  }

  const res = await fetch(`https://app.notify.lk/api/v1/status?user_id=${userId}&api_key=${apiKey}`);
  if (!res.ok) {
    throw new Error(`Notify.lk Status API returned HTTP ${res.status}`);
  }

  return await res.json();
}
