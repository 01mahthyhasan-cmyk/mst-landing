import { connectDB } from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import { adminGuard, apiOk } from '@/lib/apiHelpers';

export async function GET(request) {
  const { error } = await adminGuard(request, 'view_audit_logs');
  if (error) return error;
  await connectDB();

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '30'));

  const filter = {};
  if (action) filter.action = action;
  if (userId) filter.userId = userId;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort('-timestamp').skip((page - 1) * limit).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  return apiOk({ items, total, page, pages: Math.ceil(total / limit) });
}
