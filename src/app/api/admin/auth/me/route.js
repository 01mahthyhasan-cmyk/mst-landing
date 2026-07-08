import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.sub).lean();
  if (!user) {
    return Response.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return Response.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLoginAt: user.lastLoginAt,
    }
  });
}
