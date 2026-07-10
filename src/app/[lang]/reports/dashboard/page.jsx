import { getCustomerSessionPhone } from '@/lib/customerAuth';
import { connectDB } from '@/lib/db';
import Report from '@/models/Report';
import { maskPhone } from '@/app/api/admin/reports/upload/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default async function ReportsDashboardPage({ params }) {
  const { lang } = await params;
  const phone = await getCustomerSessionPhone();

  // If session is missing or expired, redirect back to home or a notice page
  if (!phone) {
    redirect(`/${lang}/reports/unauthorized`);
  }

  await connectDB();

  // Query reports from the last 3 months for this phone number
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const reports = await Report.find({
    phone,
    uploadedAt: { $gte: threeMonthsAgo },
  })
    .sort({ uploadedAt: -1 })
    .lean();

  const maskedPhone = maskPhone(phone);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/images/mst_logo.png" alt="MST Health Care" className="logo" />
            <span className="divider">|</span>
            <span className="portal-title">Patient Report Portal</span>
          </div>
          <div className="user-section">
            <span className="user-phone">📞 {maskedPhone}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-banner">
          <h1>Welcome to Your Dashboard</h1>
          <p>
            Here are your medical reports from the last 3 months. For security, always log out when you are done viewing your documents.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="no-reports-card">
            <div className="no-reports-icon">📁</div>
            <h2>No Reports Found</h2>
            <p>
              We couldn't find any reports uploaded for your number within the last 3 months.
            </p>
            <p className="subtext">
              If you recently had a test, please note it can take up to 24 hours for reports to be processed and uploaded.
            </p>
            <div className="help-box">
              <h3>Need assistance?</h3>
              <p>Call our reception at:</p>
              <div className="phones">
                <a href="tel:0652054997">065 205 4997</a>
                <a href="tel:0762951343">076 295 1343</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="reports-section">
            <h2 className="section-title">Your Medical Documents ({reports.length})</h2>
            <div className="reports-grid">
              {reports.map((report) => {
                const isPdf = report.cloudinaryFormat === 'pdf';
                const formattedDate = new Date(report.uploadedAt).toLocaleDateString(
                  lang === 'en' ? 'en-US' : 'ta-LK',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                );

                return (
                  <div key={report._id.toString()} className="report-card">
                    <div className="card-icon-container">
                      {isPdf ? (
                        <span className="file-icon pdf">PDF</span>
                      ) : (
                        <span className="file-icon image">IMG</span>
                      )}
                    </div>
                    <div className="card-details">
                      <h3 className="report-title">{report.title}</h3>
                      <p className="report-date">Uploaded: {formattedDate}</p>
                    </div>
                    <div className="card-actions">
                      <a
                        href={`/api/reports/${report._id.toString()}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-btn"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} MST Health Care. All rights reserved. Your Health, Our Priority.</p>
      </footer>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
        }
        .dashboard-header {
          background-color: #08363B;
          color: #ffffff;
          padding: 16px 24px;
          border-bottom: 4px solid #00A8BC;
          box-shadow: 0 4px 12px rgba(8, 54, 59, 0.05);
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          height: 36px;
          object-fit: contain;
        }
        .divider {
          color: #00A8BC;
          font-weight: 300;
          font-size: 20px;
        }
        .portal-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-phone {
          font-size: 14px;
          font-weight: 600;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
        }
        .dashboard-main {
          flex: 1;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .welcome-banner {
          margin-bottom: 32px;
        }
        .welcome-banner h1 {
          font-size: 28px;
          color: #08363B;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .welcome-banner p {
          color: #64748b;
          font-size: 15px;
          max-width: 700px;
          line-height: 1.5;
        }
        .no-reports-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          max-width: 550px;
          margin: 40px auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .no-reports-icon {
          font-size: 54px;
          margin-bottom: 16px;
        }
        .no-reports-card h2 {
          font-size: 20px;
          color: #08363B;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .no-reports-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .no-reports-card .subtext {
          font-size: 13px;
          font-style: italic;
          color: #94a3b8;
          margin-bottom: 24px;
        }
        .help-box {
          background-color: #f0f7f8;
          border: 1px solid #d0e8ea;
          border-radius: 12px;
          padding: 16px;
        }
        .help-box h3 {
          font-size: 14px;
          color: #08363B;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .help-box p {
          font-size: 13px;
          margin-bottom: 8px;
        }
        .help-box .phones {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .help-box .phones a {
          color: #00A8BC;
          font-weight: 700;
          text-decoration: none;
          font-size: 14px;
        }
        .help-box .phones a:hover {
          text-decoration: underline;
        }
        .section-title {
          font-size: 18px;
          color: #08363B;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .report-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(8, 54, 59, 0.06);
        }
        .card-icon-container {
          display: flex;
          align-items: center;
        }
        .file-icon {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .file-icon.pdf {
          background-color: #fee2e2;
          color: #ef4444;
          border: 1px solid #fecaca;
        }
        .file-icon.image {
          background-color: #e0f2fe;
          color: #0ea5e9;
          border: 1px solid #bae6fd;
        }
        .card-details {
          flex: 1;
        }
        .report-title {
          font-size: 16px;
          color: #08363B;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .report-date {
          font-size: 13px;
          color: #64748b;
        }
        .view-btn {
          display: block;
          text-align: center;
          background-color: #f0f7f8;
          color: #08363B;
          border: 1px solid #d0e8ea;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
        }
        .view-btn:hover {
          background-color: #08363B;
          color: #ffffff;
        }
        .dashboard-footer {
          background-color: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 24px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
