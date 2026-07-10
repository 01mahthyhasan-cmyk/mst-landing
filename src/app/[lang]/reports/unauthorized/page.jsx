import Link from 'next/link';

export default async function UnauthorizedPage({ params }) {
  const { lang } = await params;

  return (
    <div className="unauth-container">
      <div className="unauth-card">
        <div className="brand-logo">
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
        </div>
        <div className="unauth-icon">🔒</div>
        <h1>Session Expired or Access Denied</h1>
        <p className="message">
          To view your medical reports, you must use the secure personal link sent to your registered phone number via SMS.
        </p>
        <p className="message subtext">
          If you have already received the link, please open it again to receive a fresh verification code. Customer sessions automatically expire after 30 minutes of inactivity for security.
        </p>
        
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
        .unauth-container {
          min-height: calc(100vh - 100px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: radial-gradient(circle at top right, #f0f7f8 0%, #ffffff 100%);
        }
        .unauth-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        .brand-logo {
          margin-bottom: 24px;
        }
        .logo {
          height: 48px;
          object-fit: contain;
        }
        .unauth-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 22px;
          color: #08363B;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .message {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .subtext {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 30px;
        }
        .contact-info {
          background: #f0f7f8;
          border: 1px solid #d0e8ea;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .contact-info h3 {
          font-size: 14px;
          color: #08363B;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .contact-info p {
          font-size: 12px;
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
          color: #00A8BC;
          font-weight: 600;
          font-size: 13px;
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
