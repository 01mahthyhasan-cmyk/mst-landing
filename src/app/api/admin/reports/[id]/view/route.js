import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { generateSignedUrl } from '@/lib/cloudinary';
import { writeAuditLog } from '@/lib/auditLog';
import { maskPhone } from '@/app/api/admin/reports/upload/route';

// GET /api/admin/reports/:id/view
// Admin-facing signed URL generator. Does NOT redirect — returns JSON
// so the frontend can decide how to render (new tab for PDF, modal for image).
export async function GET(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'read');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const report = await Report.findById(id).lean();
    if (!report) {
      return apiError('Report not found', 404);
    }

    // Reuse the existing signed URL generator (10-minute expiry).
    const signedUrl = generateSignedUrl(report);

    await writeAuditLog({
      userId: session.sub,
      userEmail: session.email,
      action: 'report_admin_view',
      targetCollection: 'reports',
      targetId: report._id.toString(),
      ipAddress: ip,
      meta: { phone: maskPhone(report.phone) },
    });

    return apiOk({
      signedUrl,
      format: report.cloudinaryFormat,
      resourceType: report.cloudinaryResourceType,
      title: report.title,
    });
  } catch (err) {
    console.error('[Admin Report View API Error]:', err);
    return apiError(err.message, 500);
  }
}
