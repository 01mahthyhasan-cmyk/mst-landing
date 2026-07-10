import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import OtpRequest from '@/models/OtpRequest';
import { hashOtp, createCustomerSession } from '@/lib/customerAuth';
import { apiOk, apiError } from '@/lib/apiHelpers';

// POST /api/reports/otp/verify
export async function POST(request) {
  try {
    const { token, code } = await request.json();

    if (!token || !code) {
      return apiError('Token and verification code are required', 400);
    }

    await connectDB();

    // 1. Find report to retrieve the phone number
    const report = await Report.findOne({
      linkToken: token,
      linkTokenExpiresAt: { $gt: new Date() },
    });

    if (!report) {
      return apiError('This access link has expired. Please contact us for a new one', 400);
    }

    const phone = report.phone;

    // 2. Find latest non-expired OtpRequest
    const otpRequest = await OtpRequest.findOne({
      phone,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRequest) {
      return apiError('Verification code expired or not found. Please request a new code', 400);
    }

    // 3. Increment and validate attempts
    otpRequest.attempts += 1;
    await otpRequest.save();

    if (otpRequest.attempts > 5) {
      await OtpRequest.deleteMany({ phone });
      return apiError('Too many incorrect attempts. Please request a new verification code', 400);
    }

    // 4. Compare hash
    const submittedHash = hashOtp(code);
    if (otpRequest.otpHash !== submittedHash) {
      return apiError('Incorrect code', 400);
    }

    // 5. Successful match - clear OTP requests and establish customer session
    await OtpRequest.deleteMany({ phone });
    await createCustomerSession(phone);

    return apiOk({ message: 'Verification successful' });
  } catch (err) {
    console.error('[OTP Verify Route Error]:', err);
    return apiError(err.message, 500);
  }
}
