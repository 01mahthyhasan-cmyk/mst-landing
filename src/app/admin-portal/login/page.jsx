'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: 2FA verification
  const [step, setStep] = useState('credentials'); // 'credentials' | '2fa'
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'session_expired' || reason === 'idle_timeout') {
      setError(
        reason === 'idle_timeout'
          ? 'You were logged out due to inactivity.'
          : 'Your session has expired. Please log in again.'
      );
    }
  }, [searchParams]);

  // ── Step 1: Submit credentials ──────────────────────────────────────────────
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.twoFactorRequired) {
        // Transition to step 2
        setTempToken(data.tempToken);
        setStep('2fa');
        setError('');
        return;
      }

      // No 2FA — session cookies are already set, redirect
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        const from = searchParams.get('from') || '/admin-portal/dashboard';
        router.push(from);
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Submit 2FA code ─────────────────────────────────────────────────
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code: twoFactorCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '2FA verification failed');
      }

      setSuccess('Authentication complete! Redirecting...');
      setTimeout(() => {
        const from = searchParams.get('from') || '/admin-portal/dashboard';
        router.push(from);
      }, 800);
    } catch (err) {
      setError(err.message);
      setTwoFactorCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand header */}
        <div className="logo-section">
          <img src="/images/mst_logo.png" alt="MST Health Care Logo" className="logo" />
          <h1>Admin Portal</h1>
          <p className="subtitle">
            {step === '2fa' ? '2-Factor Authentication Required' : 'Secure Internal Access'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="step-bar">
          <div className={`step-dot ${step === 'credentials' ? 'active' : 'done'}`}>1</div>
          <div className={`step-line ${step === '2fa' ? 'active' : ''}`}></div>
          <div className={`step-dot ${step === '2fa' ? 'active' : ''}`}>2</div>
        </div>
        <div className="step-labels">
          <span>Credentials</span>
          <span>2FA Verify</span>
        </div>

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">{success}</div>}

        {/* ── STEP 1: Email + Password ── */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialSubmit} className="login-form" id="login-credentials-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@msthealthcare.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" id="login-submit-btn" className="btn-submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="spinner-sm"></span> Authenticating...</span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: TOTP Code ── */}
        {step === '2fa' && (
          <form onSubmit={handle2FASubmit} className="login-form" id="login-2fa-form">
            <div className="two-fa-info">
              <div className="two-fa-icon">🔐</div>
              <p>Open your authenticator app and enter the 6-digit code for <strong>MST Admin Portal</strong>.</p>
            </div>

            <div className="form-group">
              <label htmlFor="totp-code">Authenticator Code</label>
              <input
                type="text"
                id="totp-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000 000"
                required
                autoFocus
                disabled={loading}
                className="totp-input"
              />
              <small className="field-hint">Code changes every 30 seconds. Use your latest code.</small>
            </div>

            <button type="submit" id="login-2fa-submit-btn" className="btn-submit" disabled={loading || twoFactorCode.length !== 6}>
              {loading ? (
                <span className="btn-loading"><span className="spinner-sm"></span> Verifying...</span>
              ) : (
                'Verify & Sign In →'
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setError(''); setTwoFactorCode(''); }}
              className="btn-back"
            >
              ← Back to Login
            </button>
          </form>
        )}

        <p className="security-notice">
          🔒 All access attempts are logged and monitored.
        </p>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #06282d 0%, #08363B 50%, #00768a 100%);
          padding: 20px;
          font-family: 'Rethink Sans', system-ui, -apple-system, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          padding: 44px 40px;
          animation: slideUp 0.35s ease-out both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-section {
          text-align: center;
          margin-bottom: 28px;
        }

        .logo {
          height: 64px;
          margin-bottom: 16px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        h1 {
          font-size: 22px;
          color: #08363B;
          margin: 0 0 6px 0;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .subtitle {
          color: #64748B;
          font-size: 13px;
          margin: 0;
          font-weight: 500;
        }

        /* Step bar */
        .step-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 6px;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          background-color: #E2E8F0;
          color: #94A3B8;
          transition: all 0.3s;
        }

        .step-dot.active {
          background-color: #00A8BC;
          color: #ffffff;
        }

        .step-dot.done {
          background-color: #16A34A;
          color: #ffffff;
        }

        .step-line {
          height: 2px;
          width: 80px;
          background-color: #E2E8F0;
          transition: background-color 0.3s;
        }

        .step-line.active {
          background-color: #00A8BC;
        }

        .step-labels {
          display: flex;
          justify-content: space-between;
          padding: 4px 14px;
          margin-bottom: 24px;
          font-size: 11px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
          padding: 12px 16px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          color: #0F172A;
          background-color: #F8FAFC;
        }

        input:focus {
          border-color: #00A8BC;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 168, 188, 0.15);
        }

        .totp-input {
          text-align: center;
          font-size: 28px !important;
          font-weight: 700 !important;
          letter-spacing: 8px;
          color: #08363B !important;
          padding: 14px 16px !important;
        }

        .field-hint {
          font-size: 11px;
          color: #94A3B8;
          margin-top: 2px;
        }

        .btn-submit {
          background: linear-gradient(135deg, #08363B 0%, #00A8BC 100%);
          color: #ffffff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          margin-top: 4px;
          letter-spacing: 0.3px;
        }

        .btn-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-back {
          background: transparent;
          border: 1.5px solid #E2E8F0;
          color: #64748B;
          padding: 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner-sm {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .two-fa-info {
          background-color: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #1E40AF;
          font-size: 14px;
          line-height: 1.5;
        }

        .two-fa-icon {
          font-size: 22px;
          flex-shrink: 0;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 16px;
          font-weight: 500;
          line-height: 1.4;
        }

        .alert-error {
          background-color: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .alert-success {
          background-color: #F0FDF4;
          color: #166534;
          border: 1px solid #BBF7D0;
        }

        .security-notice {
          text-align: center;
          font-size: 11px;
          color: #94A3B8;
          margin-top: 24px;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
