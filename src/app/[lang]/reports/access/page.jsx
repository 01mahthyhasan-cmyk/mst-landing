import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { maskPhone } from '@/app/api/admin/reports/upload/route';
import ReportOtpVerify from './ReportOtpVerify';
import Link from 'next/link';

export default async function ReportsAccessPage({ params, searchParams }) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;

  if (!token) {
    return <ExpiredLinkView message="No access token provided. Please check the link sent in your SMS." />;
  }

  await connectDB();

  // Find the report and ensure it hasn't expired (7 days link duration)
  const report = await Report.findOne({
    linkToken: token,
    linkTokenExpiresAt: { $gt: new Date() },
  });

  if (!report) {
    return <ExpiredLinkView message="This link has expired or is invalid. For your security, report access links are only valid for 7 days. Please contact us to request a new one." />;
  }

  const maskedPhone = maskPhone(report.phone);

  return (
    <div className="access-container">
      <div className="access-card">
        <div className="brand-logo">
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
        </div>
        
        <ReportOtpVerify token={token} maskedPhone={maskedPhone} />
      </div>

      <style>{`
        .access-container {
          min-height: calc(100vh - 100px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: radial-gradient(circle at top right, #f0f7f8 0%, #ffffff 100%);
        }
        .access-card {
          background: #ffffff;
          border: 1px solid #d0e8ea;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 10px 30px rgba(8, 54, 59, 0.05);
          text-align: center;
        }
        .brand-logo {
          margin-bottom: 30px;
        }
        .logo {
          height: 48px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}

function ExpiredLinkView({ message }) {
  return (
    <div className="expired-container">
      <div className="expired-card">
        <div className="brand-logo">
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
        </div>
        <div className="expired-icon">⏰</div>
        <h1>Access Link Expired</h1>
        <p className="message">{message}</p>
        
        <div className="contact-info">
          <h3>Need Help? Contact MST Health Care</h3>
          <p>Trinco Road, Periya Urani, Batticaloa</p>
          <div className="phones">
            <a href="tel:0652054997" className="phone-link">📞 065 205 4997</a>
            <a href="tel:0762951343" className="phone-link">📞 076 295 1343</a>
          </div>
        </div>

        <Link href="/" className="home-btn">
          Return to Home
        </Link>
      </div>

      <style>{`
        .expired-container {
          min-height: calc(100vh - 100px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: radial-gradient(circle at top right, #f0f7f8 0%, #ffffff 100%);
        }
        .expired-card {
          background: #ffffff;
          border: 1px solid #f8d7da;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 10px 30px rgba(114, 28, 36, 0.05);
          text-align: center;
        }
        .brand-logo {
          margin-bottom: 24px;
        }
        .logo {
          height: 48px;
          object-fit: contain;
        }
        .expired-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 24px;
          color: #721c24;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .message {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .contact-info {
          background: #fff8f8;
          border: 1px solid #f5c6cb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .contact-info h3 {
          font-size: 15px;
          color: #721c24;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .contact-info p {
          font-size: 13px;
          color: #555;
          margin-bottom: 12px;
        }
        .phones {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .phone-link {
          color: #08363B;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }
        .phone-link:hover {
          text-decoration: underline;
        }
        .home-btn {
          display: inline-block;
          background: #08363B;
          color: #ffffff;
          padding: 12px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .home-btn:hover {
          background: #00A8BC;
        }
      `}</style>
    </div>
  );
}
