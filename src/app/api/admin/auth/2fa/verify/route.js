import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyTOTP, decryptSecret } from '@/lib/totp';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'read');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { code } = body;
  if (!code) return apiError('Verification code is required', 400);

  await connectDB();
  const user = await User.findById(session.sub);
  if (!user || !user.twoFactorSecret) {
    return apiError('No 2FA setup found. Enroll first.', 400);
  }

  const decryptedSecret = decryptSecret(user.twoFactorSecret);
  const isValid = verifyTOTP(decryptedSecret, code);

  if (!isValid) {
    return apiError('Invalid verification code', 400);
  }

  user.twoFactorEnabled = true;
  await user.save();

  return apiOk({ message: '2FA successfully enabled' });
}
