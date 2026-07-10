import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { connectDB } from '../../../lib/db';
import FormSubmission from '../../../models/FormSubmission';

// Absolute public URL for the logo (used as <img src> in email clients)
const LOGO_URL = 'https://msthealthcare.com/images/mst_logo.png';

// Shared brand colours (keep in sync with the site palette)
const COLOR_PRIMARY = '#0a6c74';
const COLOR_LIGHT_BG = '#f0f7f8';
const COLOR_BORDER = '#d0e8ea';

/**
 * Builds the shared email header block (logo + banner strip).
 */
function emailHeader(previewText = '') {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${previewText}</title>
    <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="600" cellpadding="0" cellspacing="0" border="0"
                 style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;
                        overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

            <!-- HEADER BANNER -->
            <tr>
              <td style="background:${COLOR_PRIMARY};padding:28px 36px;text-align:center;">
                <img src="${LOGO_URL}"
                     alt="MST Health Care"
                     width="140"
                     style="display:block;margin:0 auto;max-width:140px;height:auto;" />
              </td>
            </tr>
  `;
}

/**
 * Builds the shared email footer block.
 */
function emailFooter() {
  return `
            <!-- FOOTER -->
            <tr>
              <td style="background:${COLOR_LIGHT_BG};padding:24px 36px;border-top:1px solid ${COLOR_BORDER};">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center"
                        style="font-size:13px;color:#555;line-height:1.8;">
                      <strong style="color:${COLOR_PRIMARY};">MST Health Care</strong><br />
                      Trinco Road, Periya Urani, Batticaloa, Sri Lanka<br />
                      📞 <a href="tel:0652054997" style="color:${COLOR_PRIMARY};text-decoration:none;">065 205 4997</a> &nbsp;|&nbsp;
                      <a href="tel:0762951343" style="color:${COLOR_PRIMARY};text-decoration:none;">076 295 1343</a> &nbsp;|&nbsp;
                      <a href="tel:0762251343" style="color:${COLOR_PRIMARY};text-decoration:none;">076 225 1343</a><br />
                      ✉ <a href="mailto:contact@msthealthcare.com"
                           style="color:${COLOR_PRIMARY};text-decoration:none;">contact@msthealthcare.com</a><br />
                      🕐 Clinic Hours: <strong>Everyday 6:30 AM – 8:00 PM</strong>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top:14px;font-size:11px;color:#999;">
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

/**
 * Builds a styled two-column detail row for use inside a details table.
 */
function detailRow(label, value, isLast = false) {
  const borderBottom = isLast ? 'none' : `1px solid ${COLOR_BORDER}`;
  return `
    <tr>
      <td style="padding:10px 14px;font-weight:600;color:#444;
                 background:${COLOR_LIGHT_BG};width:130px;
                 border-right:1px solid ${COLOR_BORDER};
                 border-bottom:${borderBottom};
                 vertical-align:top;font-size:14px;">
        ${label}
      </td>
      <td style="padding:10px 14px;color:#333;
                 border-bottom:${borderBottom};
                 font-size:14px;vertical-align:top;">
        ${value}
      </td>
    </tr>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/contact
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const fname   = (params.get('fname')   || '').trim();
    const lname   = (params.get('lname')   || '').trim();
    const phone   = (params.get('call')    || '').trim();
    const email   = (params.get('mail')    || '').trim();
    const message = (params.get('msg')     || '').trim();

    const fullName = `${fname} ${lname}`.trim();

    if (!fname || !phone || !email) {
      return new Response(
        'Please fill in all required fields (First Name, Phone, Email).',
        { status: 400 }
      );
    }

    try {
      await connectDB();
      await FormSubmission.create({
        formType: 'contact',
        status: 'new',
        firstName: fname,
        lastName: lname,
        phone,
        email,
        message,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown',
      });
    } catch (dbErr) {
      console.error('Failed to save contact form submission to MongoDB:', dbErr);
    }

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

    const safeMessage = message
      ? message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />')
      : '<em style="color:#888;">No message provided</em>';

    // ── 1. NOTIFICATION EMAIL → TEAM ──────────────────────────────────────
    const teamHtml = `
      ${emailHeader('New Contact Message – MST Health Care')}

            <!-- BODY -->
            <tr>
              <td style="padding:36px 36px 20px;">
                <!-- Alert badge -->
                <div style="background:${COLOR_PRIMARY};color:#fff;display:inline-block;
                            padding:5px 14px;border-radius:20px;font-size:12px;
                            font-weight:700;letter-spacing:0.5px;margin-bottom:20px;">
                  📩 NEW CONTACT ENQUIRY
                </div>

                <h2 style="margin:0 0 6px;color:#1a1a1a;font-size:22px;font-weight:700;">
                  You have a new contact message
                </h2>
                <p style="margin:0 0 24px;color:#666;font-size:14px;">
                  Someone has reached out through the Contact Us form on your website.
                  Please review the details below and respond promptly.
                </p>

                <!-- Details table -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="border:1px solid ${COLOR_BORDER};border-radius:8px;
                              overflow:hidden;border-collapse:collapse;">
                  ${detailRow('Full Name', `<strong>${fullName}</strong>`)}
                  ${detailRow('Phone', `<a href="tel:${phone}" style="color:${COLOR_PRIMARY};text-decoration:none;">${phone}</a>`)}
                  ${detailRow('Email', `<a href="mailto:${email}" style="color:${COLOR_PRIMARY};text-decoration:none;">${email}</a>`)}
                  ${detailRow('Message', safeMessage, true)}
                </table>

                <p style="margin:24px 0 0;font-size:13px;color:#888;">
                  Received on ${new Date().toLocaleString('en-GB', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'Asia/Colombo',
                  })} (Sri Lanka Time)
                </p>
              </td>
            </tr>

      ${emailFooter()}
    `;

    await transporter.sendMail({
      from:    `"MST Health Care Enquiries" <${process.env.SMTP_USER || 'contact@msthealthcare.com'}>`,
      to:       process.env.SMTP_USER || 'contact@msthealthcare.com',
      subject: `New Contact Enquiry from ${fullName}`,
      text: `New contact message received.\n\nFull Name: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message || 'No message provided'}`,
      html: teamHtml,
    });

    // ── 2. CONFIRMATION EMAIL → CUSTOMER ──────────────────────────────────
    const customerHtml = `
      ${emailHeader('Thank you for contacting MST Health Care')}

            <!-- BODY -->
            <tr>
              <td style="padding:36px 36px 20px;">
                <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;">
                  Thank you for reaching out, ${fname}!
                </h2>
                <p style="margin:0 0 22px;color:#555;font-size:15px;line-height:1.7;">
                  We have successfully received your message. A member of our team will
                  review it and get back to you as soon as possible — typically within
                  <strong>24 hours</strong>.
                </p>

                <!-- Submitted message recap -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="border-left:4px solid ${COLOR_PRIMARY};
                              background:${COLOR_LIGHT_BG};
                              border-radius:0 8px 8px 0;
                              padding:0;margin-bottom:24px;
                              border-collapse:collapse;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 6px;font-size:13px;font-weight:700;
                                color:${COLOR_PRIMARY};letter-spacing:0.4px;
                                text-transform:uppercase;">
                        Your Submitted Message
                      </p>
                      <p style="margin:0;color:#444;font-size:14px;line-height:1.7;">
                        ${safeMessage}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Contact details recap -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="border:1px solid ${COLOR_BORDER};border-radius:8px;
                              overflow:hidden;border-collapse:collapse;margin-bottom:24px;">
                  ${detailRow('Name',  fullName)}
                  ${detailRow('Phone', phone)}
                  ${detailRow('Email', email, true)}
                </table>

                <p style="margin:0 0 8px;color:#555;font-size:15px;line-height:1.7;">
                  If your matter is urgent, please contact us directly:
                </p>
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right:12px;">
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
      subject: 'We received your message – MST Health Care',
      text: `Dear ${fullName},\n\nThank you for contacting MST Health Care. We have received your message and will respond within 24 hours.\n\nYour message: ${message || 'No message provided'}\n\nFor urgent matters call: 065 205 4997 | 076 295 1343\n\nBest regards,\nMST Health Care Team`,
      html: customerHtml,
    });

    return new Response('success', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Contact form SMTP error:', error);
    return new Response(
      `Failed to send message: ${error.message || error}`,
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    );
  }
}
