'use client';

import { useState, useEffect, useRef } from 'react';

export default function ReportOtpVerify({ token, maskedPhone }) {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Timers
  const [cooldown, setCooldown] = useState(0); // Cooldown for resending OTP (30s)
  const [expiry, setExpiry] = useState(0); // OTP expiration timer (300s / 5 min)
  
  const cooldownIntervalRef = useRef(null);
  const expiryIntervalRef = useRef(null);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
      if (expiryIntervalRef.current) clearInterval(expiryIntervalRef.current);
    };
  }, []);

  // Handle cooldown countdown
  useEffect(() => {
    if (cooldown > 0) {
      cooldownIntervalRef.current = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else {
      if (cooldownIntervalRef.current) clearTimeout(cooldownIntervalRef.current);
    }
  }, [cooldown]);

  // Handle OTP expiry countdown
  useEffect(() => {
    if (expiry > 0) {
      expiryIntervalRef.current = setTimeout(() => {
        setExpiry(prev => prev - 1);
      }, 1000);
    } else if (expiry === 0 && step === 2) {
      setError('The verification code has expired. Please request a new one.');
      if (expiryIntervalRef.current) clearTimeout(expiryIntervalRef.current);
    }
  }, [expiry, step]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/reports/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      setStep(2);
      setSuccess('Verification code sent successfully.');
      setCooldown(30); // 30 seconds cooldown
      setExpiry(300); // 5 minutes expiration
      setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/reports/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      setSuccess('Verified successfully! Redirecting...');
      
      // Full page redirect to dashboard (lets proxy verify cookie)
      window.location.href = '/reports/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="otp-container">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="otp-form">
          <h2>Verify Your Identity</h2>
          <p className="description">
            To view your medical reports, we need to send a secure verification code (OTP) to your phone number.
          </p>

          <div className="phone-display">
            <span className="label">Registered Phone Number</span>
            <span className="phone-number">{maskedPhone}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Sending Code...' : 'Send OTP via SMS'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="otp-form">
          <h2>Enter Verification Code</h2>
          <p className="description">
            A 6-digit code has been sent to your registered phone number <strong style={{ color: '#08363B' }}>{maskedPhone}</strong>.
          </p>

          <div className="form-group">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              disabled={loading || expiry === 0}
              className="otp-input"
              required
              autoFocus
            />
          </div>

          <div className="timer-info">
            {expiry > 0 ? (
              <span className="expiry-timer">Code expires in: <strong>{formatTime(expiry)}</strong></span>
            ) : (
              <span className="expired-text">Code expired</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || expiry === 0 || otp.length !== 6}
            className="btn btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify & View Reports'}
          </button>

          <div className="resend-section">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || cooldown > 0}
              className="btn-resend"
            >
              {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Verification Code'}
            </button>
          </div>
        </form>
      )}

      <style jsx>{`
        .otp-container {
          text-align: left;
        }
        .otp-form h2 {
          font-size: 20px;
          color: #08363B;
          font-weight: 700;
          margin-bottom: 8px;
          text-align: center;
        }
        .description {
          font-size: 14px;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 24px;
          text-align: center;
        }
        .phone-display {
          background: #f0f7f8;
          border: 1px solid #d0e8ea;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
        .phone-display .label {
          font-size: 11px;
          color: #00A8BC;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .phone-display .phone-number {
          font-size: 18px;
          color: #08363B;
          font-weight: 700;
        }
        .form-group {
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
        }
        .otp-input {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 8px;
          padding: 10px;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          width: 100%;
          max-width: 220px;
          outline: none;
          transition: border-color 0.2s;
        }
        .otp-input:focus {
          border-color: #00A8BC;
        }
        .timer-info {
          text-align: center;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .expiry-timer {
          color: #64748B;
        }
        .expiry-timer strong {
          color: #ef4444;
        }
        .expired-text {
          color: #ef4444;
          font-weight: 600;
        }
        .btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
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
        .resend-section {
          text-align: center;
          margin-top: 16px;
        }
        .btn-resend {
          background: transparent;
          border: none;
          color: #00A8BC;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-resend:hover:not(:disabled) {
          color: #08363B;
          text-decoration: underline;
        }
        .btn-resend:disabled {
          color: #94a3b8;
          cursor: not-allowed;
        }
        .alert {
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: left;
          line-height: 1.4;
        }
        .alert-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }
        .alert-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }
      `}</style>
    </div>
  );
}
