import crypto from 'crypto';

const b32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(str) {
  str = str.toUpperCase().replace(/=+$/, '');
  let bits = '';
  for (let i = 0; i < str.length; i++) {
    const val = b32chars.indexOf(str[i]);
    if (val === -1) throw new Error('Invalid base32 character');
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function base32Encode(buffer) {
  let bits = '';
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, '0');
  }
  let str = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length < 5) break;
    str += b32chars[parseInt(chunk, 2)];
  }
  return str;
}

function generateHOTP(secretBuffer, counter) {
  const counterBuffer = Buffer.alloc(8);
  const high = Math.floor(counter / 0x100000000);
  const low = counter % 0x100000000;
  counterBuffer.writeUInt32BE(high, 0);
  counterBuffer.writeUInt32BE(low, 4);

  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const h = hmac.digest();

  const offset = h[h.length - 1] & 0xf;
  const binary = ((h[offset] & 0x7f) << 24) |
                 ((h[offset + 1] & 0xff) << 16) |
                 ((h[offset + 2] & 0xff) << 8) |
                 (h[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

export function generateSecret() {
  const bytes = crypto.randomBytes(10);
  return base32Encode(bytes);
}

export function verifyTOTP(secret, code, window = 1) {
  if (!secret || !code) return false;
  try {
    const secretBuffer = base32Decode(secret);
    const timeStep = 30;
    const currentCounter = Math.floor(Date.now() / 1000 / timeStep);

    for (let i = -window; i <= window; i++) {
      const otp = generateHOTP(secretBuffer, currentCounter + i);
      if (otp === code.trim()) {
        return true;
      }
    }
  } catch (e) {
    console.error('TOTP verification error:', e);
  }
  return false;
}

export function getOtpauthUri(email, secret) {
  const issuer = 'MST Health Care';
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}

// ─── Encryption At Rest ─────────────────────────────────────────────────────
const ENCRYPTION_KEY = crypto.createHash('sha256').update(process.env.JWT_ACCESS_SECRET || 'mst_admin_access_jwt_secret_2025_xK9pLmN3qR7vWzY1').digest();

export function encryptSecret(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptSecret(text) {
  if (!text) return null;
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt 2FA secret:', err.message);
    return null;
  }
}
