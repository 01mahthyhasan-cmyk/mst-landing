import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';
import { sendSms, checkSmsRateLimit, recordSmsSend } from '@/lib/sms';
import { maskPhone } from '../upload/route';

// POST /api/admin/reports/:id/resend
export async function POST(request, { params }) {
  const { session, ip, error } = await adminGuard(request, 'write');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const report = await Report.findById(id);
    if (!report) {
      return apiError('Report not found', 404);
    }

    const normalizedPhone = report.phone;
    const maskedPhone = maskPhone(normalizedPhone);

    // Rate limit check
    const rateCheck = await checkSmsRateLimit(normalizedPhone, 'report');
    if (!rateCheck.allowed) {
      return apiError(rateCheck.message, 429);
    }

    // Regenerate link token
    const newLinkToken = crypto.randomBytes(32).toString('hex');
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    report.linkToken = newLinkToken;
    report.linkTokenExpiresAt = newExpiresAt;
    
    // Send SMS
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const accessLink = `${baseUrl}/reports/access?token=${newLinkToken}`;
    const smsMessage = `Your MST Health Care report is ready. View it here: ${accessLink}`;

    try {
      await sendSms(normalizedPhone, smsMessage);
      await recordSmsSend(normalizedPhone, 'report');
      
      report.linkSentAt = new Date();
      await report.save();
    } catch (smsErr) {
      console.error('[Notify.lk SMS Resend Error]:', smsErr);
      return apiError(`Failed to send SMS: ${smsErr.message || smsErr}`, 500);
    }

    // Audit log
    await writeAuditLog({
      userId: session.sub,
      userEmail: session.email,
      action: 'report_link_resend',
      targetCollection: 'reports',
      targetId: report._id.toString(),
      ipAddress: ip,
      meta: { phone: maskedPhone },
    });

    return apiOk({ message: 'Link token regenerated and SMS sent successfully' });
  } catch (err) {
    console.error('[Resend API Crash]:', err);
    return apiError(err.message, 500);
  }
}
