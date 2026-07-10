import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { getCustomerSessionPhone } from '@/lib/customerAuth';
import { generateSignedUrl } from '@/lib/cloudinary';
import { writeAuditLog } from '@/lib/auditLog';
import { NextResponse } from 'next/server';
import { maskPhone } from '@/app/api/admin/reports/upload/route';

// GET /api/reports/:id/view
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const phone = await getCustomerSessionPhone();

    if (!phone) {
      return new Response('Unauthorized - Session expired or invalid', { status: 401 });
    }

    await connectDB();
    const report = await Report.findById(id);

    if (!report) {
      return new Response('Report not found', { status: 404 });
    }

    // Ownership check: Customer session phone must match the report's phone
    if (report.phone !== phone) {
      return new Response('Forbidden - You do not have permission to view this report', { status: 403 });
    }

    // Generate signed, expiring Cloudinary URL (10-minute validity)
    const signedUrl = generateSignedUrl(report);

    // Audit Logging
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    await writeAuditLog({
      userId: 'customer',
      userEmail: 'customer@msthealthcare.com',
      action: 'report_view',
      targetCollection: 'reports',
      targetId: report._id.toString(),
      ipAddress: ip,
      meta: { phone: maskPhone(phone) },
    });

    // Redirect to the temporary secure Cloudinary URL
    return NextResponse.redirect(signedUrl);
  } catch (err) {
    console.error('[Report View API Error]:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
