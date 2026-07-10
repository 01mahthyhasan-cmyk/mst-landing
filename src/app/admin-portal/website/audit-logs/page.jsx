'use client';

import { useState, useEffect } from 'react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');

  const fetchLogs = async (pageNum = 1) => {
    setLoading(true);
    try {
      let url = `/api/admin/audit-logs?page=${pageNum}&limit=20`;
      if (action) url += `&action=${encodeURIComponent(action)}`;
      if (userId) url += `&userId=${encodeURIComponent(userId)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load audit logs');
      const data = await res.json();
      setLogs(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [action, userId]);

  return (
    <div className="audit-logs-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Audit Logs</h1>
          <p className="page-subtitle">Inspect historical admin activities, content modifications, and security actions.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar card-panel">
        <div className="filter-group">
          <label>Filter by Action</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">All Actions</option>
            <option value="login_success">Login Success</option>
            <option value="login_failure">Login Failure</option>
            <option value="login_success_2fa">2FA Login Success</option>
            <option value="login_failure_2fa">2FA Login Failure</option>
            <option value="user_create">User Create</option>
            <option value="user_suspend">User Suspend</option>
            <option value="user_activate">User Activate</option>
            <option value="role_change">Role Change</option>
            <option value="force_logout_user">Force Logout User</option>
            <option value="content_create">Content Create</option>
            <option value="content_update">Content Update</option>
            <option value="content_publish">Content Publish</option>
            <option value="content_unpublish">Content Unpublish</option>
            <option value="content_delete">Content Delete</option>
            <option value="settings_update">Settings Update</option>
          </select>
        </div>
        <div className="filter-group">
          <label>User ID Filter</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. 64df5a..."
          />
        </div>
        <button onClick={() => { setAction(''); setUserId(''); }} className="btn-secondary">
          Reset Filters
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Retrieving audit index...</div>
      ) : (
        <div className="card-panel">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User Email</th>
                  <th>User ID</th>
                  <th>Target Collection</th>
                  <th>Target ID</th>
                  <th>Client IP</th>
                  <th>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="timestamp-cell">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <span className={`action-badge ${log.action}`}>
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{log.userEmail || 'System/Guest'}</td>
                    <td className="id-cell" title={log.userId}>{log.userId || 'N/A'}</td>
                    <td>{log.targetCollection || 'N/A'}</td>
                    <td className="id-cell" title={log.targetId}>{log.targetId || 'N/A'}</td>
                    <td>{log.ipAddress || 'Unknown'}</td>
                    <td>
                      {log.meta ? (
                        <pre className="meta-text">{JSON.stringify(log.meta)}</pre>
                      ) : (
                        <span className="no-meta">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => fetchLogs(page - 1)}
                className="btn-pagination"
              >
                &larr; Prev
              </button>
              <span className="pagination-info">
                Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} total records)
              </span>
              <button
                disabled={page >= pages}
                onClick={() => fetchLogs(page + 1)}
                className="btn-pagination"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .audit-logs-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }
        .page-subtitle {
          font-size: 14px;
          color: #64748B;
          margin-top: 4px;
        }
        .filter-bar {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .filter-group label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
        }
        .filter-group select, .filter-group input {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 14px;
          background-color: #ffffff;
          min-width: 200px;
        }
        .filter-group select:focus, .filter-group input:focus {
          outline: none;
          border-color: #00A8BC;
        }
        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          background-color: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        }
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .timestamp-cell {
          font-weight: 500;
          color: #64748B;
          white-space: nowrap;
        }
        .id-cell {
          font-family: monospace;
          color: #64748B;
          font-size: 12px;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .action-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        /* Custom action badge colors */
        .action-badge.login_success, .action-badge.login_success_2fa { background-color: #D1FAE5; color: #065F46; }
        .action-badge.login_failure, .action-badge.login_failure_2fa { background-color: #FEE2E2; color: #991B1B; }
        .action-badge.content_publish { background-color: #DBEAFE; color: #1E40AF; }
        .action-badge.content_unpublish { background-color: #FEF3C7; color: #92400E; }
        .action-badge.content_create { background-color: #F3E8FF; color: #6B21A8; }
        .action-badge.content_update { background-color: #E2E8F0; color: #334155; }
        .action-badge.content_delete { background-color: #FEE2E2; color: #991B1B; }
        .action-badge.settings_update { background-color: #E0F2FE; color: #0369A1; }
        
        .meta-text {
          font-family: monospace;
          font-size: 11px;
          color: #475569;
          white-space: pre-wrap;
          word-break: break-all;
          max-width: 250px;
        }
        .no-meta {
          color: #94A3B8;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
        }
        .btn-pagination {
          background-color: #ffffff;
          border: 1px solid #CBD5E1;
          color: #475569;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-pagination:hover:not(:disabled) {
          background-color: #F8FAFC;
          border-color: #94A3B8;
        }
        .btn-pagination:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-info {
          font-size: 13px;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}
