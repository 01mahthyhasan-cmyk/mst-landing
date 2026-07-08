'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function WebsiteLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef(null);

  // ── CSRF helper ───────────────────────────────────────────────────────────
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  // ── Idle Timeout (20 mins) ────────────────────────────────────────────────
  const IDLE_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

  const handleLogout = async (reason = '') => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: { 'x-csrf-token': getCsrfToken() }
      });
      router.push(`/admin-portal/login?reason=${reason || 'logout'}`);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      alert('You have been logged out due to inactivity.');
      handleLogout('idle_timeout');
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    // Check authentication
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        router.push('/admin-portal/login?from=' + pathname);
      }
    }
    checkAuth();

    // Listen for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Verifying admin session...</p>
        <style jsx>{`
          .loading {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #08363B;
            color: #ffffff;
            font-family: system-ui, sans-serif;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #00A8BC;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 12px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const role = user?.role;
  const isSuperAdmin = role === 'super_admin';
  const isContentAdmin = role === 'content_admin';

  const menuItems = [
    { label: 'Pages Singletons', href: '/admin-portal/website/pages', icon: '📄', show: true },
    { label: 'Services', href: '/admin-portal/website/services', icon: '🏥', show: true },
    { label: 'Blog Posts', href: '/admin-portal/website/blog-posts', icon: '📝', show: true },
    { label: 'Team Members', href: '/admin-portal/website/team-members', icon: '🧑‍⚕️', show: true },
    { label: 'Case Studies', href: '/admin-portal/website/case-studies', icon: '📊', show: true },
    { label: 'Testimonials', href: '/admin-portal/website/testimonials', icon: '💬', show: true },
    { label: 'Media Library', href: '/admin-portal/website/media', icon: '🖼️', show: true },
    { label: 'Content Health', href: '/admin-portal/website/health', icon: '🩺', show: true },
    { label: 'My Security Profile', href: '/admin-portal/website/profile', icon: '🔐', show: true },
    { label: 'User Management', href: '/admin-portal/website/users', icon: '👥', show: isSuperAdmin },
    { label: 'Audit Logs', href: '/admin-portal/website/audit-logs', icon: '📜', show: isSuperAdmin },
    { label: 'Site Settings', href: '/admin-portal/website/settings', icon: '⚙️', show: isSuperAdmin },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link href="/admin-portal/dashboard" className="brand-link">
            <span className="brand-logo">🌐</span>
            <div>
              <span className="brand-title">MST CMS</span>
              <span className="brand-subtitle">Website Maintenance</span>
            </div>
          </Link>
        </div>

        <nav className="nav-menu">
          {menuItems.filter(item => item.show).map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-meta">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role?.toUpperCase().replace('_', ' ')}</span>
            </div>
          </div>
          <button onClick={() => handleLogout()} className="signout-button">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        <header className="content-header">
          <div className="breadcrumb-trail">
            <Link href="/admin-portal/dashboard" className="crumb-link">Dashboard</Link>
            <span className="crumb-separator">/</span>
            <span className="crumb-current">Website Maintenance</span>
          </div>
          <div className="header-actions">
            <Link href="/" target="_blank" className="preview-site-btn">
              👁️ View Live Website
            </Link>
          </div>
        </header>

        <div className="content-inner">
          {children}
        </div>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Rethink Sans', system-ui, -apple-system, sans-serif;
          background-color: #F1F5F9;
          color: #1E293B;
        }
        .admin-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 280px;
          background-color: #082F35;
          color: #E2E8F0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .sidebar-brand {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #ffffff;
        }
        .brand-logo {
          font-size: 28px;
        }
        .brand-title {
          font-weight: 800;
          font-size: 18px;
          display: block;
          letter-spacing: 0.5px;
        }
        .brand-subtitle {
          font-size: 11px;
          color: #00A8BC;
          font-weight: 700;
          text-transform: uppercase;
          display: block;
        }
        .nav-menu {
          flex: 1;
          padding: 20px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94A3B8;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .nav-item:hover {
          color: #ffffff;
          background-color: rgba(255,255,255,0.03);
        }
        .nav-item.active {
          color: #ffffff;
          background-color: #00A8BC;
        }
        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background-color: #052125;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #00A8BC;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          font-size: 16px;
        }
        .user-meta {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }
        .user-role {
          font-size: 10px;
          color: #94A3B8;
          font-weight: 700;
        }
        .signout-button {
          width: 100%;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #F87171;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .signout-button:hover {
          background-color: rgba(239, 68, 68, 0.1);
          border-color: #EF4444;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }
        .content-header {
          height: 70px;
          border-bottom: 1px solid #E2E8F0;
          background-color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
        }
        .breadcrumb-trail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748B;
        }
        .crumb-link {
          text-decoration: none;
          color: #64748B;
        }
        .crumb-link:hover {
          color: #00A8BC;
        }
        .crumb-separator {
          color: #CBD5E1;
        }
        .crumb-current {
          color: #0F172A;
          font-weight: 600;
        }
        .preview-site-btn {
          text-decoration: none;
          background-color: #00A8BC;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background-color 0.2s;
        }
        .preview-site-btn:hover {
          background-color: #078696;
        }
        .content-inner {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
        
        /* General admin component styles */
        .card-panel {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .panel-title {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 20px;
        }
        .btn-primary {
          background-color: #00A8BC;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #078696;
        }
        .btn-secondary {
          background-color: #F1F5F9;
          color: #475569;
          border: 1px solid #E2E8F0;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #E2E8F0;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .admin-table th {
          background-color: #F8FAFC;
          padding: 12px 16px;
          font-weight: 600;
          color: #475569;
          border-bottom: 1px solid #E2E8F0;
        }
        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
        }
        .admin-table tr:hover {
          background-color: #F8FAFC;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-badge.published {
          background-color: #DCFCE7;
          color: #15803D;
        }
        .status-badge.draft {
          background-color: #FEF9C3;
          color: #854D0E;
        }
        .status-badge.active {
          background-color: #DCFCE7;
          color: #15803D;
        }
        .status-badge.suspended {
          background-color: #FEE2E2;
          color: #991B1B;
        }
      `}</style>
    </div>
  );
}
