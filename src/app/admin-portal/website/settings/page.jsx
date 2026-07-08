'use client';

import { useState, useEffect } from 'react';

// ─── Module-level helpers (stable references = no focus loss on re-render) ────

function formatLabel(key) {
  if (!key) return '';
  const last = key.split('.').pop() || key;
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

function isLongField(path) {
  const p = path.toLowerCase();
  return p.includes('desc') || p.includes('overview') || p.includes('bio') ||
    p.includes('quote') || p.includes('answer') || p.includes('content') ||
    p.includes('address') || p.includes('copyright') || p.includes('hours');
}

// Stable RepeaterField component
function RepeaterField({ label, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    if (items.length > 0) {
      const clearValues = (obj) => {
        if (typeof obj === 'string') return '';
        if (Array.isArray(obj)) return [];
        if (typeof obj === 'object' && obj !== null) {
          const out = {};
          for (const k of Object.keys(obj)) out[k] = clearValues(obj[k]);
          return out;
        }
        return obj;
      };
      onChange([...items, clearValues(JSON.parse(JSON.stringify(items[0])))]);
    } else {
      if (label.toLowerCase().includes('link') || label.toLowerCase().includes('nav') || label.toLowerCase().includes('social')) {
        onChange([...items, { label: { en: 'New Link', ta: 'புதிய இணைப்பு' }, href: '/' }]);
      } else {
        onChange([...items, { en: '', ta: '' }]);
      }
    }
  };

  const handleRemove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const handleChange = (i, v) => { const u = [...items]; u[i] = v; onChange(u); };

  return (
    <div className="repeater-field-container">
      <div className="repeater-header">
        <span className="repeater-title">{label}</span>
        <button type="button" onClick={handleAdd} className="btn-add-item">+ Add Entry</button>
      </div>
      <div className="repeater-list">
        {items.map((item, idx) => (
          <div key={idx} className="repeater-card">
            <div className="repeater-item-header">
              <span className="repeater-item-index">Item #{idx + 1}</span>
              <button type="button" onClick={() => handleRemove(idx)} className="btn-remove-item">Remove</button>
            </div>
            <div className="repeater-item-body">
              <FormNode path="" value={item} onChange={(v) => handleChange(idx, v)} />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="repeater-empty-state">No items yet. Click "Add Entry" to begin.</div>
        )}
      </div>
    </div>
  );
}

// Stable FormNode component
function FormNode({ path, value, onChange }) {
  if (value === null || value === undefined) return null;

  // ── A. Object node ─────────────────────────────────────────────────────────
  if (typeof value === 'object' && !Array.isArray(value)) {
    const keys = Object.keys(value);
    const hasOnlyLocaleKeys = keys.length > 0 && keys.every(k => k === 'en' || k === 'ta');

    if (hasOnlyLocaleKeys) {
      const enVal = value.en;
      const taVal = value.ta;

      // A1. Locale-bucketed: {en: {fields…}, ta: {fields…}} — transpose to per-field EN/TA pairs
      if (typeof enVal === 'object' && enVal !== null && !Array.isArray(enVal)) {
        const fieldKeys = Array.from(new Set([
          ...Object.keys(enVal || {}),
          ...Object.keys(taVal || {}),
        ]));
        return (
          <div className="locale-bucket-group">
            {fieldKeys.map(fk => {
              const fVal = { en: enVal?.[fk], ta: taVal?.[fk] };
              return (
                <FormNode
                  key={fk}
                  path={path ? `${path}.${fk}` : fk}
                  value={fVal}
                  onChange={(newFVal) => onChange({
                    en: { ...(enVal || {}), [fk]: newFVal.en },
                    ta: { ...(taVal || {}), [fk]: newFVal.ta },
                  })}
                />
              );
            })}
          </div>
        );
      }

      // A2. Localized arrays: {en: [...], ta: [...]}
      if (Array.isArray(enVal)) {
        const label = formatLabel(path);
        return (
          <div className="form-group localized-group">
            {label && <label className="field-label">{label}</label>}
            <div className="locale-fields-grid">
              <div className="locale-input-wrapper">
                <span className="locale-badge en-badge">EN</span>
                <textarea rows={3} value={(enVal || []).join('\n')}
                  onChange={e => onChange({ ...value, en: e.target.value.split('\n') })}
                  placeholder="One item per line…" />
              </div>
              <div className="locale-input-wrapper">
                <span className="locale-badge ta-badge">TA</span>
                <textarea rows={3} value={(taVal || []).join('\n')}
                  onChange={e => onChange({ ...value, ta: e.target.value.split('\n') })}
                  placeholder="ஒரு வரிக்கு ஒரு உருப்படி…" />
              </div>
            </div>
          </div>
        );
      }

      // A3. Primitive localized leaf: {en: "string", ta: "string"}
      const label = formatLabel(path);
      const long = isLongField(path) ||
        (typeof enVal === 'string' && enVal.length > 80) ||
        (typeof taVal === 'string' && taVal.length > 80);
      return (
        <div className="form-group localized-group">
          {label && <label className="field-label">{label}</label>}
          <div className="locale-fields-grid">
            <div className="locale-input-wrapper">
              <span className="locale-badge en-badge">EN</span>
              {long
                ? <textarea rows={3} value={typeof enVal === 'string' ? enVal : ''}
                    onChange={e => onChange({ ...value, en: e.target.value })}
                    placeholder="English…" />
                : <input type="text" value={typeof enVal === 'string' ? enVal : ''}
                    onChange={e => onChange({ ...value, en: e.target.value })}
                    placeholder="English…" />}
            </div>
            <div className="locale-input-wrapper">
              <span className="locale-badge ta-badge">TA</span>
              {long
                ? <textarea rows={3} value={typeof taVal === 'string' ? taVal : ''}
                    onChange={e => onChange({ ...value, ta: e.target.value })}
                    placeholder="தமிழ்…" />
                : <input type="text" value={typeof taVal === 'string' ? taVal : ''}
                    onChange={e => onChange({ ...value, ta: e.target.value })}
                    placeholder="தமிழ்…" />}
            </div>
          </div>
        </div>
      );
    }

    // ── A4. Regular nested object ──────────────────────────────────────────
    const depth = path ? path.split('.').length : 0;
    const children = keys.map(k => (
      <FormNode
        key={k}
        path={path ? `${path}.${k}` : k}
        value={value[k]}
        onChange={(nv) => onChange({ ...value, [k]: nv })}
      />
    ));

    if (depth === 0) return <div className="nested-fields-wrapper">{children}</div>;
    if (depth === 1) {
      return (
        <div className="form-section-card card-panel">
          <h3 className="section-title-header">{formatLabel(path)}</h3>
          <div className="section-fields-container">{children}</div>
        </div>
      );
    }
    return (
      <div className="sub-section-group">
        <h4 className="sub-section-title">{formatLabel(path)}</h4>
        <div className="sub-section-body">{children}</div>
      </div>
    );
  }

  // ── B. Array ───────────────────────────────────────────────────────────────
  if (Array.isArray(value)) {
    return <RepeaterField label={formatLabel(path)} value={value} onChange={onChange} />;
  }

  // ── C. Scalar ─────────────────────────────────────────────────────────────
  return (
    <div className="form-group">
      <label className="field-label">{formatLabel(path)}</label>
      <input type="text" value={value !== null ? String(value) : ''}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active Tab: 'form' or 'json'
  const [activeTab, setActiveTab] = useState('form');
  const [settingsJson, setSettingsJson] = useState('{}');

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
      const sData = data.settings || {};
      setSettings(sData);
      
      // Clean internal fields for JSON editing
      const { _id, __v, singletonKey, createdAt, updatedAt, ...cleanData } = sData;
      setSettingsJson(JSON.stringify(cleanData, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFieldChange = (field, val, subfield = null) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        [field]: subfield 
          ? { ...prev[field], [subfield]: val }
          : val
      };
      
      const { _id, __v, singletonKey, createdAt, updatedAt, ...cleanData } = updated;
      setSettingsJson(JSON.stringify(cleanData, null, 2));
      return updated;
    });
  };

  const handleJsonChange = (val) => {
    setSettingsJson(val);
    try {
      const parsed = JSON.parse(val);
      setSettings(prev => ({
        ...prev,
        ...parsed
      }));
    } catch (e) {
      // Ignore invalid JSON while typing
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    let payload = {};
    try {
      payload = JSON.parse(settingsJson);
    } catch (err) {
      setError('Invalid JSON content: ' + err.message);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({
          ...settings,
          ...payload
        })
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

  // Destructure clean data to build forms
  const { _id, __v, singletonKey, createdAt, updatedAt, ...formFields } = settings;

  return (
    <div className="settings-container">
      <div className="page-header-banner">
        <div>
          <h1 className="page-title">Global Site Settings</h1>
          <p className="page-subtitle">Configure contact lines, address locations, opening hours, navigation links, and shared blocks.</p>
        </div>
      </div>

      <div className="card-panel">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="editor-tabs">
          <button 
            onClick={() => setActiveTab('form')} 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          >
            📝 Form Editor
          </button>
          <button 
            onClick={() => setActiveTab('json')} 
            className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          >
            💻 Advanced JSON
          </button>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          {activeTab === 'form' ? (
            <div className="form-builder-area">
              {/* Brand & Main Configs */}
              <div className="form-section-card card-panel">
                <h3 className="section-title-header">Brand Identity</h3>
                <div className="form-group">
                  <label className="field-label">Site Title</label>
                  <input
                    type="text"
                    value={settings?.siteTitle || ''}
                    onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                    required
                  />
                </div>
                <FormNode
                  path="siteDescription"
                  value={settings?.siteDescription}
                  onChange={(newVal) => handleFieldChange('siteDescription', newVal)}
                />
                <div className="form-row">
                  <div className="form-group">
                    <label className="field-label">Logo Asset Path</label>
                    <input
                      type="text"
                      value={settings?.logo || ''}
                      onChange={(e) => handleFieldChange('logo', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Favicon Asset Path</label>
                    <input
                      type="text"
                      value={settings?.favicon || ''}
                      onChange={(e) => handleFieldChange('favicon', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Direct Contact Numbers */}
              <div className="form-section-card card-panel">
                <h3 className="section-title-header">Direct Contact Info</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="field-label">Primary Phone</label>
                    <input
                      type="text"
                      value={settings?.phone1 || ''}
                      onChange={(e) => handleFieldChange('phone1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Secondary Phone</label>
                    <input
                      type="text"
                      value={settings?.phone2 || ''}
                      onChange={(e) => handleFieldChange('phone2', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Tertiary Phone</label>
                    <input
                      type="text"
                      value={settings?.phone3 || ''}
                      onChange={(e) => handleFieldChange('phone3', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="field-label">Support Email</label>
                  <input
                    type="email"
                    value={settings?.email || ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="form-section-card card-panel">
                <h3 className="section-title-header">Social Media Links</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="field-label">Facebook Profile</label>
                    <input
                      type="text"
                      value={settings?.facebookLink || ''}
                      onChange={(e) => handleFieldChange('facebookLink', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Instagram Link</label>
                    <input
                      type="text"
                      value={settings?.instagramLink || ''}
                      onChange={(e) => handleFieldChange('instagramLink', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="field-label">WhatsApp Number / API Link</label>
                    <input
                      type="text"
                      value={settings?.whatsappLink || ''}
                      onChange={(e) => handleFieldChange('whatsappLink', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Twitter Link</label>
                    <input
                      type="text"
                      value={settings?.twitterLink || ''}
                      onChange={(e) => handleFieldChange('twitterLink', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Recursive Form Builder for Nested Items (menus, footer columns, blocks) */}
              <FormNode
                path="address"
                value={settings?.address}
                onChange={(newVal) => handleFieldChange('address', newVal)}
              />
              <FormNode
                path="clinicHours"
                value={settings?.clinicHours}
                onChange={(newVal) => handleFieldChange('clinicHours', newVal)}
              />
              <FormNode
                path="copyright"
                value={settings?.copyright}
                onChange={(newVal) => handleFieldChange('copyright', newVal)}
              />
              <FormNode
                path="navigation"
                value={settings?.navigation}
                onChange={(newVal) => handleFieldChange('navigation', newVal)}
              />
              <FormNode
                path="footer"
                value={settings?.footer}
                onChange={(newVal) => handleFieldChange('footer', newVal)}
              />
              <FormNode
                path="sharedBlocks"
                value={settings?.sharedBlocks}
                onChange={(newVal) => handleFieldChange('sharedBlocks', newVal)}
              />
            </div>
          ) : (
            <div className="json-editor-area">
              <div className="form-group">
                <label className="field-label">Raw Site Settings Catalog (JSON)</label>
                <textarea
                  className="json-textarea"
                  rows={25}
                  value={settingsJson}
                  onChange={(e) => handleJsonChange(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-submit-bar">
            <button type="submit" disabled={saving} className="btn-primary btn-save-action">
              {saving ? 'Saving Settings...' : '💾 Save Site Settings'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .settings-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        .page-header-banner {
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
        .editor-tabs {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 24px;
          gap: 16px;
        }
        .tab-btn {
          background: transparent;
          border: none;
          padding: 10px 4px;
          font-size: 14px;
          font-weight: 700;
          color: #64748B;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #0F172A;
        }
        .tab-btn.active {
          color: #00A8BC;
          border-bottom-color: #00A8BC;
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
          padding: 60px;
          color: #64748B;
          font-weight: 500;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-section-card {
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background-color: #ffffff;
        }
        .section-title-header {
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #F1F5F9;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .form-group input, .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
          transition: all 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #00A8BC;
          box-shadow: 0 0 0 3px rgba(0, 168, 188, 0.1);
        }
        .localized-group {
          background-color: #F8FAFC;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          margin-bottom: 12px;
        }
        .locale-bucket-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sub-section-group {
          margin-bottom: 16px;
          padding: 14px;
          background-color: #FAFAFA;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          border-left: 3px solid #00A8BC;
        }
        .sub-section-title {
          font-size: 12px;
          font-weight: 800;
          color: #00A8BC;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .sub-section-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .locale-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .locale-input-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
        }
        .locale-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid #CBD5E1;
          border-right: none;
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
          user-select: none;
        }
        .en-badge {
          background-color: #EFF6FF;
          color: #1D4ED8;
          border-color: #BFDBFE;
        }
        .ta-badge {
          background-color: #F0FDF4;
          color: #15803D;
          border-color: #BBF7D0;
        }
        .locale-input-wrapper input, .locale-input-wrapper textarea {
          flex: 1;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding: 10px;
          border: 1px solid #CBD5E1;
          font-size: 14px;
        }
        .locale-input-wrapper textarea {
          resize: vertical;
        }
        .json-textarea {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          background-color: #0F172A !important;
          color: #38BDF8 !important;
          border-color: #1E293B !important;
          border-radius: 8px;
        }
        .repeater-field-container {
          background-color: #F1F5F9;
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed #CBD5E1;
          margin-bottom: 20px;
        }
        .repeater-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .repeater-title {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
        }
        .btn-add-item {
          background-color: #ffffff;
          color: #00A8BC;
          border: 1px solid #00A8BC;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-add-item:hover {
          background-color: #EDF9FC;
        }
        .repeater-card {
          background-color: #ffffff;
          padding: 14px;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid #E2E8F0;
        }
        .repeater-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
        }
        .repeater-item-index {
          font-size: 12px;
          font-weight: 800;
          color: #64748B;
        }
        .btn-remove-item {
          background: transparent;
          border: none;
          color: #EF4444;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-remove-item:hover {
          text-decoration: underline;
        }
        .repeater-empty-state {
          text-align: center;
          padding: 20px;
          color: #64748B;
          font-size: 13px;
          font-style: italic;
        }
        .form-submit-bar {
          position: sticky;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 16px 0;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: flex-end;
          z-index: 10;
        }
        .btn-save-action {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 8px;
          background-color: #00A8BC;
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 168, 188, 0.25);
        }
        .btn-save-action:hover {
          background-color: #008E9F;
        }
      `}</style>
    </div>
  );
}
