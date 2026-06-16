import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function getServiceName(service) {
  const services = {
    opd: 'OPD (Outpatient Department)',
    clinic_services: 'Clinic Services',
    ecg: 'ECG',
    physiotherapy: 'Physiotherapy',
    specialist_channelling: 'Specialist Channelling',
    laboratory_services: 'Laboratory Services',
    nebulizer_services: 'Nebulizer Services',
    elders_care: 'Elders Care',
    home_visit: 'Home Visit Services',
    ambulance: 'Ambulance Services',
  };
  return services[service] || service;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');

    if (!name || !phone || !service) {
      return new Response('Please fill in all required fields (Name, Phone, Service).', { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.privateemail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER || 'contact@msthealthcare.com',
        pass: process.env.SMTP_PASS || 'jC4p-D9Uq-u5aQ-5JRN-ract-Z7VQ',
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 1. Email to the team
    const teamMailOptions = {
      from: `"MST Health Care Bookings" <${process.env.SMTP_USER || 'contact@msthealthcare.com'}>`,
      to: process.env.SMTP_USER || 'contact@msthealthcare.com',
      subject: `New Appointment Booking: ${name}`,
      text: `You have received a new appointment booking request.\n\nDetails:\n- Full Name: ${name}\n- Email: ${email || 'Not provided'}\n- Phone Number: ${phone}\n- Selected Service: ${getServiceName(service)}\n- Message: ${message || 'No additional message'}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0a6c74; border-bottom: 2px solid #0a6c74; padding-bottom: 8px; margin-top: 0;">New Appointment Booking Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 150px; background-color: #f9f9f9;">Full Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email || '<span style="color: #888; font-style: italic;">Not provided</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Phone Number</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Selected Service</td>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #0a6c74;">${getServiceName(service)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; vertical-align: top;">Message</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message ? message.replace(/\n/g, '<br>') : '<span style="color: #888; font-style: italic;">No additional message</span>'}</td>
            </tr>
          </table>
        </div>
      `
    };

    await transporter.sendMail(teamMailOptions);

    // 2. Email confirmation to user if email is provided
    if (email && email.trim() !== '') {
      const userMailOptions = {
        from: `"MST Health Care" <${process.env.SMTP_USER || 'contact@msthealthcare.com'}>`,
        to: email.trim(),
        subject: 'Appointment Booking Received - MST Health Care',
        text: `Dear ${name},\n\nThank you for booking an appointment with MST Health Care. We have successfully received your request.\n\nHere are the details you submitted:\n- Service: ${getServiceName(service)}\n- Phone: ${phone}\n- Message: ${message || 'None'}\n\nOur team will contact you shortly to confirm the scheduled date and time.\n\nBest regards,\nMST Health Care Team\nTrinco Road, Periya Urani, Batticaloa, Sri Lanka\nPhone: 065 205 4997 | 076 295 1343\nClinic Hours: Everyday 6:30 AM - 8:00 PM`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0a6c74; margin: 0;">MST Health Care</h2>
              <p style="font-size: 14px; color: #777; margin: 5px 0 0 0;">Your Health, Our Priority</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for booking an appointment with MST Health Care. We have successfully received your request.</p>
            <p>Our team is currently reviewing your request and will get back to you shortly to confirm your scheduled appointment slot.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0a6c74;">
              <h4 style="margin-top: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Booking Details</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #555; width: 120px;">Service:</td>
                  <td style="padding: 5px 0;">${getServiceName(service)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #555;">Phone:</td>
                  <td style="padding: 5px 0;">${phone}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                  <td style="padding: 5px 0;">${message}</td>
                </tr>` : ''}
              </table>
            </div>
            
            <p>If you have any urgent queries, please call us directly at <strong>065 205 4997</strong> or <strong>076 295 1343</strong>.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <div style="font-size: 12px; color: #777; margin-top: 20px; text-align: center;">
              <p style="margin: 0;"><strong>MST Health Care</strong></p>
              <p style="margin: 3px 0;">Trinco Road, Periya Urani, Batticaloa, Sri Lanka</p>
              <p style="margin: 0;">Clinic Hours: Everyday 6:30 AM - 8:00 PM</p>
            </div>
          </div>
        `
      };
      await transporter.sendMail(userMailOptions);
    }

    return new Response('success', { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('SMTP Mail error:', error);
    return new Response(`Failed to send email: ${error.message || error}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}
