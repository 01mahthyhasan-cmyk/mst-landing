import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';

export async function POST(request) {
  const { session, error } = await adminGuard(request, 'read');
  if (error) return error;

  await connectDB();
  const user = await User.findById(session.sub);
  if (!user) return apiError('User not found', 404);

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  return apiOk({ message: '2FA successfully disabled' });
}
