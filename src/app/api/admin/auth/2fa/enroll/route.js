import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateSecret, getOtpauthUri, encryptSecret } from '@/lib/totp';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'read');
  if (error) return error;

  await connectDB();
  const user = await User.findById(session.sub);
  if (!user) return apiError('User not found', 404);

  const secret = generateSecret();
  const encryptedSecret = encryptSecret(secret);

  user.twoFactorSecret = encryptedSecret;
  user.twoFactorEnabled = false; // Must be verified to activate
  await user.save();

  const otpauthUri = getOtpauthUri(user.email, secret);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;

  return apiOk({
    secret,
    qrCodeUrl,
  });
}
