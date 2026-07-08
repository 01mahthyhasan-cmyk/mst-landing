'use client';

import { useState, useEffect } from 'react';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper to read CSRF token
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/site-settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data.settings || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFieldChange = (field, value, subfield = null) => {
    setSettings(prev => ({
      ...prev,
      [field]: subfield 
        ? { ...prev[field], [subfield]: value }
        : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save settings');
      }

      setSuccess('Global site settings updated successfully!');
      fetchSettings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading global settings...</div>;

  return (
    <div className="settings-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Site Settings</h1>
          <p className="page-subtitle">Configure contact lines, address locations, opening hours, logo routes, and social accounts.</p>
        </div>
      </div>

      <div className="card-panel">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSave} className="settings-form">
          {/* General Brand info */}
          <div className="form-section-header">
            <h2>Brand Registry</h2>
          </div>
          <div className="form-group">
            <label>Site Title</label>
            <input
              type="text"
              value={settings?.siteTitle || ''}
              onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Site Description (English)</label>
              <textarea
                rows={2}
                value={settings?.siteDescription?.en || ''}
                onChange={(e) => handleFieldChange('siteDescription', e.target.value, 'en')}
                required
              />
            </div>
            <div className="form-group">
              <label>Site Description (Tamil)</label>
              <textarea
                rows={2}
                value={settings?.siteDescription?.ta || ''}
                onChange={(e) => handleFieldChange('siteDescription', e.target.value, 'ta')}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Site Logo Path / Asset URL</label>
              <input
                type="text"
                value={settings?.logo || ''}
                onChange={(e) => handleFieldChange('logo', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Favicon Path / Asset URL</label>
              <input
                type="text"
                value={settings?.favicon || ''}
                onChange={(e) => handleFieldChange('favicon', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="form-section-header">
            <h2>Contact Registry</h2>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Phone Number</label>
              <input
                type="text"
                value={settings?.phone1 || ''}
                onChange={(e) => handleFieldChange('phone1', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Secondary Phone Number</label>
              <input
                type="text"
                value={settings?.phone2 || ''}
                onChange={(e) => handleFieldChange('phone2', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tertiary Phone Number</label>
              <input
                type="text"
                value={settings?.phone3 || ''}
                onChange={(e) => handleFieldChange('phone3', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Support Email Address</label>
              <input
                type="email"
                value={settings?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Physical Address (English)</label>
              <textarea
                rows={2}
                value={settings?.address?.en || ''}
                onChange={(e) => handleFieldChange('address', e.target.value, 'en')}
                required
              />
            </div>
            <div className="form-group">
              <label>Physical Address (Tamil)</label>
              <textarea
                rows={2}
                value={settings?.address?.ta || ''}
                onChange={(e) => handleFieldChange('address', e.target.value, 'ta')}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Clinic Hours (English)</label>
              <input
                type="text"
                value={settings?.clinicHours?.en || ''}
                onChange={(e) => handleFieldChange('clinicHours', e.target.value, 'en')}
                required
              />
            </div>
            <div className="form-group">
              <label>Clinic Hours (Tamil)</label>
              <input
                type="text"
                value={settings?.clinicHours?.ta || ''}
                onChange={(e) => handleFieldChange('clinicHours', e.target.value, 'ta')}
                required
              />
            </div>
          </div>

          {/* Social Accounts */}
          <div className="form-section-header">
            <h2>Social Link Profiles</h2>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Facebook Profile Link</label>
              <input
                type="text"
                value={settings?.facebookLink || ''}
                onChange={(e) => handleFieldChange('facebookLink', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Instagram Profile Link</label>
              <input
                type="text"
                value={settings?.instagramLink || ''}
                onChange={(e) => handleFieldChange('instagramLink', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>WhatsApp Link</label>
              <input
                type="text"
                value={settings?.whatsappLink || ''}
                onChange={(e) => handleFieldChange('whatsappLink', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Twitter Link</label>
              <input
                type="text"
                value={settings?.twitterLink || ''}
                onChange={(e) => handleFieldChange('twitterLink', e.target.value)}
              />
            </div>
          </div>

          {/* Copyright text */}
          <div className="form-section-header">
            <h2>Footer Copyright Notice</h2>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Copyright (English)</label>
              <input
                type="text"
                value={settings?.copyright?.en || ''}
                onChange={(e) => handleFieldChange('copyright', e.target.value, 'en')}
                required
              />
            </div>
            <div className="form-group">
              <label>Copyright (Tamil)</label>
              <input
                type="text"
                value={settings?.copyright?.ta || ''}
                onChange={(e) => handleFieldChange('copyright', e.target.value, 'ta')}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .settings-container {
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
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-section-header {
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
          margin-top: 10px;
        }
        .form-section-header h2 {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
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
        .form-group input, .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #00A8BC;
        }
      `}</style>
    </div>
  );
}
