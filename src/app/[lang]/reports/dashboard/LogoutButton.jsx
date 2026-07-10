'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/logout', {
        method: 'POST',
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="logout-btn"
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>

      <style jsx>{`
        .logout-btn {
          background-color: #ef4444;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s, opacity 0.2s;
        }
        .logout-btn:hover:not(:disabled) {
          background-color: #dc2626;
        }
        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
