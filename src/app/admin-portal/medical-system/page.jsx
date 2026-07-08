'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicalSystem() {
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
        router.push('/admin-portal/login?from=/admin-portal/medical-system');
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="module-layout">
      <header className="header">
        <div className="brand" onClick={() => router.push('/admin-portal/dashboard')} style={{ cursor: 'pointer' }}>
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
          <span className="divider">|</span>
          <span className="module-name">Medical System Module</span>
        </div>
        <button onClick={() => router.push('/admin-portal/dashboard')} className="back-btn">&larr; Main Menu</button>
      </header>

      <main className="content">
        <div className="coming-soon-card">
          <div className="icon">🏥</div>
          <h1>Medical System Module</h1>
          <p>This module will manage physician channelling schedules, patient medical histories, prescription lists, and active OPD workflows.</p>
          <span className="badge">Under Development</span>
        </div>
      </main>

      <style jsx>{`
        .module-layout {
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: 'Rethink Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background-color: #08363B;
          color: #ffffff;
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
        .module-name {
          font-weight: 700;
          font-size: 18px;
        }
        .back-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background-color: rgba(255,255,255,0.05);
          border-color: #ffffff;
        }
        .content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .coming-soon-card {
          text-align: center;
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 60px 40px;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .icon {
          font-size: 60px;
          margin-bottom: 24px;
        }
        h1 {
          font-size: 26px;
          color: #08363B;
          margin: 0 0 12px 0;
          font-weight: 800;
        }
        p {
          color: #64748B;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 30px 0;
        }
        .badge {
          background-color: #EDF9FC;
          color: #00A8BC;
          font-weight: 700;
          font-size: 12px;
          padding: 6px 16px;
          border-radius: 30px;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
