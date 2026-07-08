import { connectDB } from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import { adminGuard, apiOk, apiError, parseBody } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';

export async function GET(request) {
  const { error } = await adminGuard(request, 'read');
  if (error) return error;
  await connectDB();
  const settings = await SiteSettings.findOne({ singletonKey: 'site_settings' }).lean();
  return apiOk({ settings: settings || {} });
}

export async function PUT(request) {
  const { session, ip, error } = await adminGuard(request, 'manage_settings');
  if (error) return error;

  const { body, error: parseErr } = await parseBody(request);
  if (parseErr) return parseErr;

  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: 'site_settings' },
    { ...body, singletonKey: 'site_settings', updatedBy: session.sub },
    { upsert: true, new: true, runValidators: true }
  );

  await writeAuditLog({
    userId: session.sub, userEmail: session.email,
    action: 'settings_update', targetCollection: 'site_settings',
    targetId: 'singleton', ipAddress: ip,
  });

  return apiOk({ settings });
}
