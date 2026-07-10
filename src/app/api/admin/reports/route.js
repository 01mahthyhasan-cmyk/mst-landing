import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { sendSms, checkSmsRateLimit, recordSmsSend, normalizeToE164, isValidPhone } from '@/lib/sms';

// GET /api/admin/reports - list reports with pagination and filtering
export async function GET(request) {
  const { session, error } = await adminGuard(request, 'read');
  if (error) return error;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const phoneFilter = searchParams.get('phone');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

  const query = {};
  if (phoneFilter) {
    // Normalize user input query
    const searchPhone = phoneFilter.trim();
    if (searchPhone) {
      // Allow partial match on phone numbers by regex
      query.phone = { $regex: searchPhone.replace('+', '\\+'), $options: 'i' };
    }
  }

  try {
    const [reports, total] = await Promise.all([
      Report.find(query)
        .sort({ uploadedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('uploadedBy', 'name email')
        .lean(),
      Report.countDocuments(query),
    ]);

    return apiOk({
      reports,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return apiError(err.message, 500);
  }
}
