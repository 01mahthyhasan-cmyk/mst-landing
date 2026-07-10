import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { adminGuard, apiOk, apiError } from '@/lib/apiHelpers';
import { writeAuditLog } from '@/lib/auditLog';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { sendSms, checkSmsRateLimit, recordSmsSend, normalizeToE164, isValidPhone } from '@/lib/sms';

export function maskPhone(phone) {
  if (!phone) return '';
  const clean = phone.trim();
  if (clean.length < 4) return clean;
  const lastTwo = clean.slice(-2);
  return `+94 7X XXX X${lastTwo}_`;
}

// POST /api/admin/reports/upload
export async function POST(request) {
  const { session, ip, error } = await adminGuard(request, 'write');
  if (error) return error;

  try {
    const formData = await request.formData();
    const phoneInput = formData.get('phone');
    const file = formData.get('file');
    const titleInput = formData.get('title');

    // 1. Validation
    if (!phoneInput || !isValidPhone(phoneInput)) {
      return apiError('Please enter a valid phone number', 400);
    }

    if (!file || !(file instanceof File)) {
      return apiError('Please upload a file (PDF or image)', 400);
    }

    // Check size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return apiError('File size exceeds the 10MB limit', 400);
    }

    // Check MIME type
    const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!ALLOWED_MIMES.includes(file.type)) {
      return apiError('Invalid file type. Only PDF, JPEG, and PNG files are allowed', 400);
    }

    const normalizedPhone = normalizeToE164(phoneInput);
    const maskedPhone = maskPhone(normalizedPhone);

    // 2. Check SMS Rate limit
    const rateCheck = await checkSmsRateLimit(normalizedPhone, 'report');
    if (!rateCheck.allowed) {
      return apiError(rateCheck.message, 429);
    }

    // 3. Process File Upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    
    await connectDB();

    // Upload to Cloudinary as 'authenticated'
    const folder = `reports/${normalizedPhone}`;
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(fileBuffer, folder);
    } catch (uploadErr) {
      console.error('[Cloudinary Upload Error]:', uploadErr);
      return apiError(`Cloudinary upload failed: ${uploadErr.message || uploadErr}`, 500);
    }

    // Determine type and format using Cloudinary's actual upload result with guess fallbacks
    const isPdf = file.type === 'application/pdf';
    const resourceType = cloudinaryResult.resource_type || (isPdf ? 'raw' : 'image');
    const format = cloudinaryResult.format || (isPdf ? 'pdf' : (file.type === 'image/png' ? 'png' : 'jpg'));

    // Safeguard: Assert uniqueness of Cloudinary Public ID in database to prevent overwriting/serving wrong files
    const existingReport = await Report.findOne({ cloudinaryPublicId: cloudinaryResult.public_id });
    if (existingReport) {
      console.error(`[CRITICAL SECURITY WARNING]: Cloudinary Public ID collision detected! ID: ${cloudinaryResult.public_id}`);
      return apiError('Critical Error: Document identifier collision detected. Upload aborted to prevent patient data mix-up.', 500);
    }

    // 4. Create Document
    const linkToken = crypto.randomBytes(32).toString('hex');
    const linkTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

    const title = titleInput ? titleInput.trim() : (isPdf ? 'Medical Report (PDF)' : 'Medical Report (Image)');

    const report = await Report.create({
      phone: normalizedPhone,
      title,
      cloudinaryPublicId: cloudinaryResult.public_id,
      cloudinaryResourceType: resourceType,
      cloudinaryFormat: format,
      uploadedBy: session.sub,
      linkToken,
      linkTokenExpiresAt,
      linkSentAt: null,
    });

    // 5. Send SMS Link
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const accessLink = `${baseUrl}/reports/access?token=${linkToken}`;
    const smsMessage = `Your MST Health Care report is ready. View it here: ${accessLink}`;

    try {
      await sendSms(normalizedPhone, smsMessage);
      await recordSmsSend(normalizedPhone, 'report');
      
      // Update send time
      report.linkSentAt = new Date();
      await report.save();
    } catch (smsErr) {
      console.error('[Notify.lk SMS Error]:', smsErr);
      // Even if SMS fails, document was created. However, surface to admin.
      return apiError(`Report created, but SMS sending failed: ${smsErr.message || smsErr}`, 500);
    }

    // 6. Audit Logging (mask phone number)
    await writeAuditLog({
      userId: session.sub,
      userEmail: session.email,
      action: 'report_upload',
      targetCollection: 'reports',
      targetId: report._id.toString(),
      ipAddress: ip,
      meta: { phone: maskedPhone },
    });

    return apiOk({ report });
  } catch (err) {
    console.error('[Upload API Crash]:', err);
    return apiError(err.message, 500);
  }
}
