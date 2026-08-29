import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';
import { maskPhone } from '@/app/api/admin/reports/upload/route';

// DELETE /api/admin/reports/:id
// Permanently removes the report from both Cloudinary and MongoDB.
// Cloudinary is destroyed first — an orphaned DB record is always
// preferable to an orphaned (billable, inaccessible) Cloudinary asset.
export async function DELETE(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'write');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const report = await Report.findById(id);
    if (!report) {
      return apiError('Report not found', 404);
    }

    const maskedPhone = maskPhone(report.phone);

    // 1. Destroy asset on Cloudinary first.
    //    If publicId is missing (data-integrity edge case), skip and warn.
    if (report.cloudinaryPublicId) {
      let destroyResult;
      try {
        destroyResult = await cloudinary.uploader.destroy(report.cloudinaryPublicId, {
          resource_type: report.cloudinaryResourceType, // 'image' | 'raw'
          type: 'authenticated',
          invalidate: true, // purge any cached signed URLs from Cloudinary CDN
        });
      } catch (cloudinaryErr) {
        console.error('[Admin Report Delete] Cloudinary destroy failed:', cloudinaryErr);
        // Surface to admin — do NOT delete the DB record so the admin can retry.
        return apiError(`Cloudinary deletion failed: ${cloudinaryErr.message || cloudinaryErr}`, 500);
      }

      // Treat 'not found' as success — asset is already gone.
      if (destroyResult?.result !== 'ok' && destroyResult?.result !== 'not found') {
        console.error('[Admin Report Delete] Unexpected Cloudinary result:', destroyResult);
        return apiError(
          `Cloudinary returned an unexpected result: ${JSON.stringify(destroyResult)}`,
          500
        );
      }
    } else {
      // Degraded path: public ID missing, skip Cloudinary and proceed.
      console.warn(
        `[Admin Report Delete] Report ${id} has no cloudinaryPublicId — skipping Cloudinary destroy.`
      );
    }

    // 2. Delete the MongoDB document.
    await Report.deleteOne({ _id: report._id });

    // 3. Audit log.
    await writeAuditLog({
      userId: session.sub,
      userEmail: session.email,
      action: 'report_delete',
      targetCollection: 'reports',
      targetId: id,
      ipAddress: ip,
      meta: {
        phone: maskedPhone,
        title: report.title,
        reportId: id,
      },
    });

    return apiOk({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('[Admin Report Delete API Crash]:', err);
    return apiError(err.message, 500);
  }
}
