import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import OtpRequest from '@/models/OtpRequest';
import { generateOtp, hashOtp } from '@/lib/customerAuth';
import { sendSms, checkSmsRateLimit, recordSmsSend } from '@/lib/sms';
import { apiOk, apiError } from '@/lib/apiHelpers';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return apiError('Access token is missing', 400);
    }

    await connectDB();

    // 1. Find the report by token
    const report = await Report.findOne({
      linkToken: token,
      linkTokenExpiresAt: { $gt: new Date() },
    });

    if (!report) {
      return apiError('This access link is invalid or has expired', 400);
    }

    const phone = report.phone;

    // 2. Check SMS Rate limits and cooldown
    const rateCheck = await checkSmsRateLimit(phone, 'otp');
    if (!rateCheck.allowed) {
      return apiError(rateCheck.message, 429, {
        reason: rateCheck.reason,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // 3. Generate and hash OTP
    const code = generateOtp();
    const otpHash = hashOtp(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save OtpRequest (override any existing pending requests for this phone)
    await OtpRequest.deleteMany({ phone });
    await OtpRequest.create({
      phone,
      otpHash,
      expiresAt,
      attempts: 0,
    });

    // 4. Send SMS (ensure brand name is included)
    const smsMessage = `Please use the code ${code} to verify your MST Health Care account. Expires in 5 minutes.`;
    try {
      await sendSms(phone, smsMessage);
      await recordSmsSend(phone, 'otp');
    } catch (smsErr) {
      console.error('[OTP SMS Send Error]:', smsErr);
      return apiError(`Failed to send SMS code: ${smsErr.message || smsErr}`, 500);
    }

    return apiOk({ message: 'Verification code sent successfully' });
  } catch (err) {
    console.error('[OTP Send Route Error]:', err);
    return apiError(err.message, 500);
  }
}
