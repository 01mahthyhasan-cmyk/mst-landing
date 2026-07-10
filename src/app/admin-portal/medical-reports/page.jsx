'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicalReports() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Business logic states
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loadingReports, setLoadingReports] = useState(false);
  const [phoneFilter, setPhoneFilter] = useState('');
  
  // Upload form states
  const [phoneInput, setPhoneInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper to read CSRF token from cookies
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  // 1. Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUser(data.user);
        setAuthLoading(false);
      } catch (err) {
        router.push('/admin-portal/login?from=/admin-portal/medical-reports');
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch reports
  const fetchReports = async (pageNum = page, filter = phoneFilter) => {
    setLoadingReports(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      });
      if (filter) {
        queryParams.append('phone', filter);
      }

      const res = await fetch(`/api/admin/reports?${queryParams}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch reports');
      
      setReports(data.reports || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  // Fetch when authenticated
  useEffect(() => {
    if (user) {
      fetchReports(1);
    }
  }, [user]);

  // 3. Handle File Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneInput) {
      setError('Phone number is required');
      return;
    }
    if (!fileInput) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('phone', phoneInput);
      formData.append('file', fileInput);
      if (titleInput) {
        formData.append('title', titleInput);
      }

      const res = await fetch('/api/admin/reports/upload', {
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setSuccess('Medical report uploaded and secure link sent successfully!');
      
      // Reset form
      setPhoneInput('');
      setTitleInput('');
      setFileInput(null);
      // Reset file input value manually
      const fileField = document.getElementById('report-file');
      if (fileField) fileField.value = '';

      // Refresh list
      fetchReports(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // 4. Handle Link Resend
  const handleResend = async (reportId) => {
    setError('');
    setSuccess('');

    if (!confirm('Are you sure you want to regenerate the access token and resend the link to this patient?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reports/${reportId}/resend`, {
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Resend failed');

      setSuccess('Access token regenerated and SMS resent successfully!');
      fetchReports(page);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports(1, phoneFilter);
  };

  const handleClearSearch = () => {
    setPhoneFilter('');
    setPage(1);
    fetchReports(1, '');
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading module...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #f8fafc;
            color: #64748b;
          }
          .spinner {
            border: 4px solid #e2e8f0;
            border-top: 4px solid #08363B;
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
    <div className="module-layout">
      <header className="header">
        <div className="brand" onClick={() => router.push('/admin-portal/dashboard')} style={{ cursor: 'pointer' }}>
          <img src="/images/mst_logo.png" alt="MST Logo" className="logo" />
          <span className="divider">|</span>
          <span className="module-name">Medical Reports Module</span>
        </div>
        <button onClick={() => router.push('/admin-portal/dashboard')} className="back-btn">&larr; Dashboard</button>
      </header>

      <main className="main-content">
        <div className="grid-container">
          {/* Left panel: Upload form */}
          <section className="form-panel">
            <div className="card">
              <h2>Upload Medical Report</h2>
              <p className="subtitle">
                Upload a patient report (PDF or image format, max 10MB). An access link will be generated and dispatched automatically via SMS.
              </p>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleUpload} className="upload-form">
                <div className="form-group">
                  <label htmlFor="patient-phone">Patient Phone Number</label>
                  <input
                    type="tel"
                    id="patient-phone"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 0771234567 or +94771234567"
                    required
                  />
                  <small className="help-text">Sri Lankan mobile formats supported. Normalized automatically.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="report-title">Report Title (Optional)</label>
                  <input
                    type="text"
                    id="report-title"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Full Blood Count, Lipid Profile"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="report-file">Select Document (PDF / Image)</label>
                  <input
                    type="file"
                    id="report-file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => setFileInput(e.target.files[0])}
                    required
                  />
                  <small className="help-text">Supported formats: PDF, JPG, JPEG, PNG. Max file size: 10MB.</small>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading ? 'Uploading & Processing...' : 'Upload & Send Secure Link'}
                </button>
              </form>
            </div>
          </section>

          {/* Right panel: Upload history */}
          <section className="history-panel">
            <div className="card">
              <div className="history-header">
                <h2>Dispatch History</h2>
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <input
                    type="text"
                    placeholder="Search phone number..."
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                  />
                  <button type="submit" className="btn-search">Search</button>
                  {phoneFilter && (
                    <button type="button" onClick={handleClearSearch} className="btn-clear">Clear</button>
                  )}
                </form>
              </div>

              {loadingReports ? (
                <div className="loading-state">Loading history...</div>
              ) : reports.length === 0 ? (
                <div className="empty-state">No medical reports found.</div>
              ) : (
                <div className="table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Phone</th>
                        <th>Uploaded By</th>
                        <th>Uploaded At</th>
                        <th>SMS Dispatched</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report._id}>
                          <td className="col-title">
                            <span className={`format-badge ${report.cloudinaryFormat}`}>
                              {report.cloudinaryFormat?.toUpperCase()}
                            </span>
                            <span className="title-text">{report.title}</span>
                          </td>
                          <td className="col-phone">{report.phone}</td>
                          <td className="col-uploader">{report.uploadedBy?.name || 'System'}</td>
                          <td className="col-date">
                            {new Date(report.uploadedAt).toLocaleString('en-GB', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="col-status">
                            {report.linkSentAt ? (
                              <span className="status-sent" title={`Sent: ${new Date(report.linkSentAt).toLocaleString()}`}>
                                ✓ Sent
                              </span>
                            ) : (
                              <span className="status-pending">Pending</span>
                            )}
                          </td>
                          <td className="col-actions">
                            <button
                              onClick={() => handleResend(report._id)}
                              className="btn-resend"
                              title="Regenerate link token and resend SMS"
                            >
                              Resend SMS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="pagination">
                      <button
                        disabled={page === 1}
                        onClick={() => {
                          setPage(prev => prev - 1);
                          fetchReports(page - 1);
                        }}
                        className="btn-page"
                      >
                        &larr; Prev
                      </button>
                      <span className="page-info">Page {page} of {pages} ({total} total)</span>
                      <button
                        disabled={page === pages}
                        onClick={() => {
                          setPage(prev => prev + 1);
                          fetchReports(page + 1);
                        }}
                        className="btn-page"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .module-layout {
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
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
          border-bottom: 4px solid #00A8BC;
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
          color: #00A8BC;
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
        .main-content {
          flex: 1;
          padding: 40px;
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 30px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
        }
        .card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .card h2 {
          font-size: 18px;
          color: #08363B;
          font-weight: 700;
          margin: 0 0 6px 0;
        }
        .subtitle {
          color: #64748B;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        .form-group input {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
        }
        .form-group input:focus {
          outline: none;
          border-color: #00A8BC;
          box-shadow: 0 0 0 2px rgba(0, 168, 188, 0.2);
        }
        .help-text {
          font-size: 11px;
          color: #94A3B8;
          line-height: 1.4;
        }
        .btn {
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s, opacity 0.2s;
        }
        .btn-primary {
          background-color: #08363B;
          color: #ffffff;
        }
        .btn-primary:hover:not(:disabled) {
          background-color: #00A8BC;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert {
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          line-height: 1.4;
        }
        .alert-error {
          background-color: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
        }
        .alert-success {
          background-color: #DCFCE7;
          border: 1px solid #86EFAC;
          color: #15803D;
        }
        
        /* History panel styles */
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .search-form {
          display: flex;
          gap: 8px;
        }
        .search-form input {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 13px;
          width: 180px;
        }
        .btn-search {
          background-color: #08363B;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-search:hover {
          background-color: #00A8BC;
        }
        .btn-clear {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-clear:hover {
          background-color: #e2e8f0;
        }
        .loading-state, .empty-state {
          text-align: center;
          padding: 48px;
          color: #64748B;
          font-size: 14px;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .report-table th, .report-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #E2E8F0;
          font-size: 13px;
        }
        .report-table th {
          background-color: #F8FAFC;
          font-weight: 600;
          color: #475569;
        }
        .col-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .format-badge {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .format-badge.pdf {
          background-color: #FEE2E2;
          color: #EF4444;
        }
        .format-badge.jpg, .format-badge.jpeg, .format-badge.png {
          background-color: #E0F2FE;
          color: #0EA5E9;
        }
        .title-text {
          font-weight: 600;
          color: #0F172A;
        }
        .col-phone {
          font-family: monospace;
          color: #334155;
          font-weight: 500;
        }
        .col-uploader {
          color: #64748B;
        }
        .col-date {
          color: #64748B;
        }
        .status-sent {
          color: #16A34A;
          font-weight: 600;
        }
        .status-pending {
          color: #D97706;
          font-weight: 600;
        }
        .btn-resend {
          background-color: #F0F7F8;
          color: #08363B;
          border: 1px solid #d0e8ea;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-resend:hover {
          background-color: #08363B;
          color: #ffffff;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }
        .btn-page {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }
        .btn-page:hover:not(:disabled) {
          background-color: #f1f5f9;
        }
        .btn-page:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 13px;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}
