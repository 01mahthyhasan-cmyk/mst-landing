import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog, getClientIP } from '@/lib/auditLog';
import { validatePasswordPolicy } from '@/lib/auth';

// GET /api/admin/users — list all users (super_admin only)
export async function GET(request) {
  const { session, ip, error } = await adminGuard(request, 'manage_users');
  if (error) return error;

  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return apiOk({ users });
}

// POST /api/admin/users — create user (super_admin only)
export async function POST(request) {
  const { session, ip, error } = await adminGuard(request, 'manage_users');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  const { name, email, role, password } = body;
  if (!name || !email || !role || !password) {
    return apiError('name, email, role, and password are required', 422);
  }

  const policyCheck = validatePasswordPolicy(password);
  if (!policyCheck.valid) {
    return apiError(policyCheck.message, 422);
  }

  await connectDB();

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return apiError('A user with this email already exists', 409);

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdBy: session.sub,
    mustChangePassword: true,
  });

  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'user_create', targetCollection: 'users',
    targetId: user._id.toString(), ipAddress: ip,
    meta: { createdEmail: user.email, role },
  });

  return apiOk({ user }, 201);
}
