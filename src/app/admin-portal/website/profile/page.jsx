'use client';

import { useState, useEffect } from 'react';

export default function ProfileSecurityPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Enroll flow state
  const [enrollStep, setEnrollStep] = useState('idle'); // idle | scanning | verifying
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/me');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Start 2FA enrollment ────────────────────────────────────────────────────
  const handleStartEnroll = async () => {
    setError('');
    setSuccess('');
    setEnrolling(true);

    try {
      const res = await fetch('/api/admin/auth/2fa/enroll', {
        method: 'POST',
        headers: { 'x-csrf-token': getCsrfToken() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to start enrollment');

      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
      setEnrollStep('scanning');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  // ── Verify TOTP to activate 2FA ─────────────────────────────────────────────
  const handleVerifyEnroll = async (e) => {
    e.preventDefault();
    setError('');
    setEnrolling(true);

    try {
      const res = await fetch('/api/admin/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({ code: verifyCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      setSuccess('🔒 2FA is now active on your account!');
      setEnrollStep('idle');
      setQrCodeUrl('');
      setSecret('');
      setVerifyCode('');
      fetchMe();
    } catch (err) {
      setError(err.message);
      setVerifyCode('');
    } finally {
      setEnrolling(false);
    }
  };

  // ── Disable 2FA ─────────────────────────────────────────────────────────────
  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? Your account will be less secure.')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/auth/2fa/disable', {
        method: 'POST',
        headers: { 'x-csrf-token': getCsrfToken() }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to disable 2FA');

      setSuccess('2FA has been disabled.');
      fetchMe();
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Change Password ─────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');

      setSuccess('Password updated successfully!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <div className="loading-state">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Security Profile</h1>
          <p className="page-subtitle">Manage your two-factor authentication settings and password credentials.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Profile Card */}
      <div className="profile-grid">
        <div className="card-panel profile-info-card">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className={`role-badge ${user?.role}`}>
              {user?.role?.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <div className="profile-meta">
            <div className="meta-row">
              <span className="meta-label">Last Login</span>
              <span className="meta-value">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">2FA Status</span>
              <span className={`meta-value ${user?.twoFactorEnabled ? 'text-green' : 'text-muted'}`}>
                {user?.twoFactorEnabled ? '🔒 Enabled & Active' : '🔓 Not Enabled'}
              </span>
            </div>
          </div>
        </div>

        {/* 2FA Management Panel */}
        <div className="card-panel two-fa-panel">
          <h2 className="panel-title">Two-Factor Authentication (TOTP)</h2>
          <p className="panel-desc">
            TOTP 2FA adds a second layer of security. After enabling, you will need your authenticator app 
            (Google Authenticator, Authy, etc.) every time you sign in.
          </p>

          {user?.twoFactorEnabled ? (
            /* Already enrolled */
            <div className="two-fa-active-state">
              <div className="active-badge">
                <span className="active-icon">✅</span>
                <div>
                  <strong>2FA is Active</strong>
                  <p>Your account is protected with time-based one-time passwords.</p>
                </div>
              </div>
              <button onClick={handleDisable2FA} className="btn-danger">
                Disable 2FA
              </button>
            </div>
          ) : enrollStep === 'idle' ? (
            /* Not yet enrolled */
            <div className="two-fa-idle-state">
              <div className="inactive-badge">
                <span>⚠️</span>
                <div>
                  <strong>2FA is Not Enabled</strong>
                  <p>Your account is less secure without 2FA. We strongly recommend enabling it.</p>
                </div>
              </div>
              <button onClick={handleStartEnroll} disabled={enrolling} className="btn-primary">
                {enrolling ? 'Generating...' : '🔐 Enable Two-Factor Authentication'}
              </button>
            </div>
          ) : enrollStep === 'scanning' ? (
            /* Show QR code for scanning */
            <div className="two-fa-scan-state">
              <div className="scan-instructions">
                <h3>Step 1: Scan the QR Code</h3>
                <p>Open your authenticator app and scan this QR code. If you can't scan it, enter the secret key manually.</p>
              </div>

              <div className="qr-container">
                <img src={qrCodeUrl} alt="2FA QR Code" className="qr-image" />
              </div>

              <div className="secret-key-box">
                <label>Manual entry secret key:</label>
                <code className="secret-code">{secret}</code>
              </div>

              <button
                onClick={() => setEnrollStep('verifying')}
                className="btn-primary"
              >
                I've Scanned It → Enter Verification Code
              </button>

              <button
                onClick={() => { setEnrollStep('idle'); setQrCodeUrl(''); setSecret(''); }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Verify TOTP code */
            <div className="two-fa-verify-state">
              <div className="scan-instructions">
                <h3>Step 2: Confirm Your Authenticator</h3>
                <p>Enter the 6-digit code from your authenticator app to activate 2FA.</p>
              </div>

              <form onSubmit={handleVerifyEnroll} className="verify-form">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  className="totp-input"
                />
                <button
                  type="submit"
                  disabled={enrolling || verifyCode.length !== 6}
                  className="btn-primary"
                >
                  {enrolling ? 'Activating...' : '✅ Activate 2FA'}
                </button>
                <button
                  type="button"
                  onClick={() => setEnrollStep('scanning')}
                  className="btn-cancel"
                >
                  ← Back to QR Code
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Password Change Panel */}
        <div className="card-panel password-panel">
          <h2 className="panel-title">Change Password</h2>
          <p className="panel-desc">
            Update your portal password. New passwords must be at least 8 characters with uppercase, 
            lowercase, a number, and a special character.
          </p>

          {!showPasswordForm ? (
            <button onClick={() => setShowPasswordForm(true)} className="btn-secondary">
              🔑 Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, upper, lower, number, special"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={changingPassword} className="btn-primary">
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 28px;
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
        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .alert-error {
          background-color: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        }
        .alert-success {
          background-color: #DCFCE7;
          color: #15803D;
          border: 1px solid #86EFAC;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          grid-template-rows: auto auto;
          gap: 24px;
        }
        .profile-info-card {
          grid-row: span 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }
        .two-fa-panel {
          grid-column: 2;
        }
        .password-panel {
          grid-column: 2;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00A8BC, #08363B);
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-weight: 800;
        }
        .profile-details h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .profile-email {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 8px;
        }
        .role-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .role-badge.super_admin { background-color: #E0F2FE; color: #0369A1; }
        .role-badge.content_admin { background-color: #F0FDF4; color: #166534; }
        .role-badge.content_editor { background-color: #F1F5F9; color: #475569; }
        .profile-meta {
          width: 100%;
          border-top: 1px solid #F1F5F9;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .meta-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-label {
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }
        .meta-value {
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }
        .text-green { color: #16A34A; }
        .text-muted { color: #94A3B8; }

        .panel-desc {
          font-size: 14px;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        /* 2FA States */
        .two-fa-active-state, .two-fa-idle-state {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .active-badge, .inactive-badge {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border-radius: 10px;
          font-size: 14px;
          line-height: 1.5;
        }
        .active-badge {
          background-color: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #15803D;
        }
        .inactive-badge {
          background-color: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #92400E;
        }
        .active-icon { font-size: 20px; }
        .active-badge strong, .inactive-badge strong {
          display: block;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .active-badge p, .inactive-badge p { margin: 0; }

        /* Scan state */
        .two-fa-scan-state, .two-fa-verify-state {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .scan-instructions h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 4px;
        }
        .scan-instructions p {
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }
        .qr-container {
          display: flex;
          justify-content: center;
          padding: 16px;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
        }
        .qr-image {
          width: 180px;
          height: 180px;
          image-rendering: pixelated;
        }
        .secret-key-box {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .secret-key-box label {
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
        }
        .secret-code {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #08363B;
          font-weight: 700;
          word-break: break-all;
          letter-spacing: 2px;
        }
        .totp-input {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 10px;
          color: #08363B;
          padding: 14px 16px;
          border: 1.5px solid #CBD5E1;
          border-radius: 10px;
          width: 100%;
          outline: none;
          background-color: #F8FAFC;
        }
        .totp-input:focus {
          border-color: #00A8BC;
          box-shadow: 0 0 0 3px rgba(0,168,188,0.15);
          background-color: #ffffff;
        }

        .verify-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Password Panel */
        .password-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }
        .form-group input {
          padding: 10px 12px;
          border: 1.5px solid #E2E8F0;
          border-radius: 8px;
          font-size: 14px;
          color: #0F172A;
          background-color: #F8FAFC;
          outline: none;
        }
        .form-group input:focus {
          border-color: #00A8BC;
          background-color: #ffffff;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-danger {
          background-color: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          align-self: flex-start;
        }
        .btn-danger:hover {
          background-color: #FEE2E2;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid #E2E8F0;
          color: #64748B;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover {
          background-color: #F8FAFC;
        }
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}
