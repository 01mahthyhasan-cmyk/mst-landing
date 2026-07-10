import nodemailer from 'nodemailer';
import { connectDB } from '../../../lib/db';
import FormSubmission from '../../../models/FormSubmission';

// ─── Brand constants ───────────────────────────────────────────────────────────
const LOGO_URL      = 'https://msthealthcare.com/images/mst_logo.png';
const COLOR_PRIMARY = '#0a6c74';
const COLOR_LIGHT   = '#f0f7f8';
const COLOR_BORDER  = '#d0e8ea';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getServiceName(service) {
  const services = {
    opd:                    'OPD (Outpatient Department)',
    clinic_services:        'Clinic Services',
    ecg:                    'ECG',
    physiotherapy:          'Physiotherapy',
    specialist_channelling: 'Specialist Channelling',
    laboratory_services:    'Laboratory Services',
    nebulizer_services:     'Nebulizer Services',
    elders_care:            'Elders Care',
    home_visit:             'Home Visit Services',
    ambulance:              'Ambulance Services',
  };
  return services[service] || service;
}

function emailHeader(previewText = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;
             font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:12px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- HEADER BANNER -->
          <tr>
            <td style="background:${COLOR_PRIMARY};padding:28px 36px;
                       text-align:center;">
              <img src="${LOGO_URL}"
                   alt="MST Health Care"
                   width="140"
                   style="display:block;margin:0 auto;
                          max-width:140px;height:auto;" />
            </td>
          </tr>
  `;
}

function emailFooter() {
  return `
          <!-- FOOTER -->
          <tr>
            <td style="background:${COLOR_LIGHT};padding:24px 36px;
                       border-top:1px solid ${COLOR_BORDER};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="font-size:13px;color:#555;line-height:1.8;">
                    <strong style="color:${COLOR_PRIMARY};">MST Health Care</strong><br />
                    Trinco Road, Periya Urani, Batticaloa, Sri Lanka<br />
                    📞 <a href="tel:0652054997"
                          style="color:${COLOR_PRIMARY};text-decoration:none;">065 205 4997</a>
                    &nbsp;|&nbsp;
                    <a href="tel:0762951343"
                       style="color:${COLOR_PRIMARY};text-decoration:none;">076 295 1343</a>
                    &nbsp;|&nbsp;
                    <a href="tel:0762251343"
                       style="color:${COLOR_PRIMARY};text-decoration:none;">076 225 1343</a><br />
                    ✉ <a href="mailto:contact@msthealthcare.com"
                          style="color:${COLOR_PRIMARY};text-decoration:none;">
                         contact@msthealthcare.com</a><br />
                    🕐 Clinic Hours: <strong>Everyday 6:30 AM – 8:00 PM</strong>
                  </td>
                </tr>
                <tr>
                  <td align="center"
                      style="padding-top:14px;font-size:11px;color:#999;">
                    © ${new Date().getFullYear()} MST Health Care. All rights reserved.<br />
                    <em>Your Health, Our Priority.</em>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table><!-- /600px wrapper -->
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function detailRow(label, value, isLast = false) {
  const border = isLast ? 'none' : `1px solid ${COLOR_BORDER}`;
  return `
    <tr>
      <td style="padding:10px 14px;font-weight:600;color:#444;
                 background:${COLOR_LIGHT};width:140px;
                 border-right:1px solid ${COLOR_BORDER};
                 border-bottom:${border};
                 vertical-align:top;font-size:14px;">
        ${label}
      </td>
      <td style="padding:10px 14px;color:#333;
                 border-bottom:${border};
                 font-size:14px;vertical-align:top;">
        ${value}
      </td>
    </tr>
  `;
}

// ─── POST /api/book-appointment ───────────────────────────────────────────────
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name    = (formData.get('name')    || '').trim();
    const email   = (formData.get('email')   || '').trim();
    const phone   = (formData.get('phone')   || '').trim();
    const service = (formData.get('service') || '').trim();
    const message = (formData.get('message') || '').trim();

    if (!name || !phone || !service) {
      return new Response(
        'Please fill in all required fields (Name, Phone, Service).',
        { status: 400 }
      );
    }

    try {
      await connectDB();
      // Split name into first and last name if possible
      const parts = name.split(/\s+/);
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      await FormSubmission.create({
        formType: 'book_appointment',
        status: 'new',
        firstName,
        lastName,
        phone,
        email,
        message,
        service: getServiceName(service),
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown',
      });
    } catch (dbErr) {
      console.error('Failed to save appointment booking to MongoDB:', dbErr);
    }

    const serviceName   = getServiceName(service);
    const safeMessage   = message
      ? message.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br />')
      : '<em style="color:#888;">No additional message</em>';
    const receivedAt = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone:  'Asia/Colombo',
    });

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'mail.privateemail.com',
      port:   parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'contact@msthealthcare.com',
        pass: process.env.SMTP_PASS || 'jC4p-D9Uq-u5aQ-5JRN-ract-Z7VQ',
      },
      tls: { rejectUnauthorized: false },
    });

    // ── 1. Notification → Team ───────────────────────────────────────────────
    const teamHtml = `
      ${emailHeader('New Appointment Booking – MST Health Care')}

          <!-- BODY -->
          <tr>
            <td style="padding:36px 36px 20px;">
              <div style="background:${COLOR_PRIMARY};color:#fff;display:inline-block;
                          padding:5px 14px;border-radius:20px;font-size:12px;
                          font-weight:700;letter-spacing:0.5px;margin-bottom:20px;">
                📅 NEW APPOINTMENT BOOKING
              </div>

              <h2 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:700;">
                New Appointment Request Received
              </h2>
              <p style="margin:0 0 24px;color:#666;font-size:14px;">
                A patient has submitted an appointment booking request through your website.
                Please review the details and contact them to confirm their slot.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px solid ${COLOR_BORDER};border-radius:8px;
                            overflow:hidden;border-collapse:collapse;">
                ${detailRow('Full Name', `<strong>${name}</strong>`)}
                ${detailRow('Phone', `<a href="tel:${phone}" style="color:${COLOR_PRIMARY};text-decoration:none;">${phone}</a>`)}
                ${detailRow('Email', email
                  ? `<a href="mailto:${email}" style="color:${COLOR_PRIMARY};text-decoration:none;">${email}</a>`
                  : '<em style="color:#888;">Not provided</em>')}
                ${detailRow('Service', `<strong style="color:${COLOR_PRIMARY};">${serviceName}</strong>`)}
                ${detailRow('Message', safeMessage, true)}
              </table>

              <p style="margin:24px 0 0;font-size:13px;color:#888;">
                Received on ${receivedAt} (Sri Lanka Time)
              </p>
            </td>
          </tr>

      ${emailFooter()}
    `;

    await transporter.sendMail({
      from:    `"MST Health Care Bookings" <${process.env.SMTP_USER || 'contact@msthealthcare.com'}>`,
      to:       process.env.SMTP_USER || 'contact@msthealthcare.com',
      subject: `New Appointment Booking: ${name} — ${serviceName}`,
      text:    `New appointment booking.\n\nName: ${name}\nEmail: ${email || 'Not provided'}\nPhone: ${phone}\nService: ${serviceName}\nMessage: ${message || 'None'}\n\nReceived: ${receivedAt}`,
      html:    teamHtml,
    });

    // ── 2. Confirmation → Patient ────────────────────────────────────────────
    if (email) {
      const customerHtml = `
        ${emailHeader('Appointment Booking Confirmed – MST Health Care')}

            <!-- BODY -->
            <tr>
              <td style="padding:36px 36px 20px;">
                <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;">
                  Your appointment request is received, ${name}!
                </h2>
                <p style="margin:0 0 22px;color:#555;font-size:15px;line-height:1.7;">
                  Thank you for choosing <strong>MST Health Care</strong>. We have
                  successfully received your appointment booking request. Our team
                  will review it and contact you shortly to confirm your scheduled
                  date and time.
                </p>

                <!-- Booking summary -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="border:1px solid ${COLOR_BORDER};border-radius:8px;
                              overflow:hidden;border-collapse:collapse;margin-bottom:24px;">
                  <tr>
                    <td colspan="2"
                        style="padding:12px 14px;background:${COLOR_PRIMARY};
                               color:#fff;font-size:13px;font-weight:700;
                               letter-spacing:0.4px;text-transform:uppercase;">
                      📋 Booking Summary
                    </td>
                  </tr>
                  ${detailRow('Service',  `<strong style="color:${COLOR_PRIMARY};">${serviceName}</strong>`)}
                  ${detailRow('Phone',    phone)}
                  ${message ? detailRow('Message', safeMessage, true) : detailRow('Message', '<em style="color:#888;">None</em>', true)}
                </table>

                <p style="margin:0 0 8px;color:#555;font-size:15px;line-height:1.7;">
                  For urgent queries, please reach us directly:
                </p>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <a href="tel:0652054997"
                         style="display:inline-block;padding:10px 22px;
                                background:${COLOR_PRIMARY};color:#fff;
                                border-radius:6px;font-size:14px;font-weight:600;
                                text-decoration:none;">
                        📞 Call Us Now
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

        ${emailFooter()}
      `;

      await transporter.sendMail({
        from:    `"MST Health Care" <${process.env.SMTP_USER || 'contact@msthealthcare.com'}>`,
        to:       email,
        subject: 'Appointment Booking Received – MST Health Care',
        text:    `Dear ${name},\n\nThank you for booking an appointment with MST Health Care.\n\nService: ${serviceName}\nPhone: ${phone}\nMessage: ${message || 'None'}\n\nOur team will contact you shortly to confirm.\n\nFor urgent matters: 065 205 4997 | 076 295 1343\n\nBest regards,\nMST Health Care Team`,
        html:    customerHtml,
      });
    }

    return new Response('success', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('SMTP Mail error:', error);
    return new Response(
      `Failed to send email: ${error.message || error}`,
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
