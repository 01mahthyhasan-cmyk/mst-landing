'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModuleDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        router.push('/admin-portal/login?from=/admin-portal/dashboard');
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin-portal/login');
    } catch (err) {
      alert('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading administrative dashboard...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #08363B;
            color: #ffffff;
          }
          .loader {
            border: 4px solid rgba(255,255,255,0.1);
            border-top: 4px solid #00A8BC;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="brand">
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
          <span className="divider">|</span>
          <span className="brand-name">Portal Shell</span>
        </div>
        <div className="user-profile">
          <span className="role-badge">{user?.role.toUpperCase().replace('_', ' ')}</span>
          <span className="user-name">{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="hero-section">
          <h1>Welcome to MST Administration</h1>
          <p>Please select a management module below to proceed.</p>
        </div>

        <div className="modules-grid">
          {/* Card 1: Website Maintenance */}
          <div className="module-card active" onClick={() => router.push('/admin-portal/website')}>
            <div className="card-icon">🌐</div>
            <h2>Website Maintenance</h2>
            <p>Update site content, publish blogs, manage service singletons, and check localized translations.</p>
            <div className="card-action">Enter Module &rarr;</div>
          </div>

          {/* Card 2: Medical Reports */}
          <div className="module-card disabled" onClick={() => router.push('/admin-portal/medical-reports')}>
            <div className="card-icon">📋</div>
            <h2>Medical Reports</h2>
            <p>Access, manage, and dispatch patient diagnostic and lab reports securely.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>

          {/* Card 3: Medical System */}
          <div className="module-card disabled" onClick={() => router.push('/admin-portal/medical-system')}>
            <div className="card-icon">🏥</div>
            <h2>Medical System</h2>
            <p>Physician scheduling, patient records, and OPD appointment management.</p>
            <div className="coming-soon">Coming Soon</div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: 'Rethink Sans', sans-serif;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background-color: #08363B;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          height: 38px;
        }
        .divider {
          color: rgba(255,255,255,0.3);
          font-size: 20px;
        }
        .brand-name {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.5px;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .role-badge {
          background-color: #00A8BC;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          color: #ffffff;
        }
        .user-name {
          font-weight: 500;
        }
        .logout-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background-color: rgba(255,255,255,0.05);
          border-color: #ffffff;
        }
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 50px;
        }
        .hero-section h1 {
          font-size: 32px;
          color: #08363B;
          font-weight: 800;
          margin: 0 0 10px 0;
        }
        .hero-section p {
          color: #64748B;
          font-size: 16px;
          margin: 0;
        }
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .module-card {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .module-card.active {
          cursor: pointer;
        }
        .module-card.active:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          border-color: #00A8BC;
        }
        .module-card.disabled {
          opacity: 0.75;
        }
        .card-icon {
          font-size: 40px;
          margin-bottom: 20px;
        }
        .module-card h2 {
          font-size: 22px;
          color: #08363B;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        .module-card p {
          color: #64748B;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 30px 0;
          flex-grow: 1;
        }
        .card-action {
          color: #00A8BC;
          font-weight: 700;
          font-size: 15px;
          transition: transform 0.2s;
        }
        .module-card.active:hover .card-action {
          transform: translateX(4px);
        }
        .coming-soon {
          align-self: flex-start;
          background-color: #EDF9FC;
          color: #00A8BC;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
