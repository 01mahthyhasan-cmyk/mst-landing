'use client';

import { useState, useEffect } from 'react';

const PAGES = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'about', label: 'About Page' },
  { slug: 'services', label: 'Services Page' },
  { slug: 'blog', label: 'Blog Listing Page' },
  { slug: 'case-study', label: 'Case Study Listing Page' },
  { slug: 'team', label: 'Team Listing Page' },
  { slug: 'testimonials', label: 'Testimonials Page' },
  { slug: 'image-gallery', label: 'Image Gallery Page' },
  { slug: 'video-gallery', label: 'Video Gallery Page' },
  { slug: 'pricing', label: 'Pricing Page' },
  { slug: 'faqs', label: 'FAQs Page' },
  { slug: 'contact', label: 'Contact Page' },
  { slug: 'book-appointment', label: 'Book Appointment Page' },
  { slug: '404', label: '404 Error Page' }
];

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

// Stable RepeaterField component — must live outside parent
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
      onChange([...items, { en: '', ta: '' }]);
    }
  };

  const handleRemove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const handleChange = (i, v) => { const u = [...items]; u[i] = v; onChange(u); };

  return (
    <div className="repeater-field-container">
      <div className="repeater-header">
        <span className="repeater-title">{label}</span>
        <button type="button" onClick={handleAdd} className="btn-add-item">+ Add Item</button>
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
          <div className="repeater-empty-state">No items yet. Click "Add Item" to begin.</div>
        )}
      </div>
    </div>
  );
}

// Stable FormNode component — must live outside parent to prevent re-mounting on keypress
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

export default function PagesManagementPage() {
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active Tab: 'form' or 'json'
  const [activeTab, setActiveTab] = useState('form');

  // Live Preview States
  const [showPreview, setShowPreview] = useState(false);
  const [previewToken, setPreviewToken] = useState('');
  const [deviceSize, setDeviceSize] = useState('desktop'); // desktop, tablet, mobile

  // Content JSON String (kept in sync with form state)
  const [contentJson, setContentJson] = useState('{}');

  // Helper to read CSRF token
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchPageData = async (slug) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/pages/${slug}`);
      if (!res.ok) throw new Error('Failed to load page content');
      const data = await res.json();
      const pData = data.page || {};
      setPageData(pData);
      setContentJson(JSON.stringify(pData.content || {}, null, 2));

      // Fetch preview token if preview is active
      if (showPreview) {
        await fetchPreviewToken(slug);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviewToken = async (slug) => {
    try {
      const res = await fetch('/api/admin/preview-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({ slug })
      });
      if (!res.ok) throw new Error('Failed to generate preview token');
      const data = await res.json();
      setPreviewToken(data.token);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPageData(selectedSlug);
  }, [selectedSlug]);

  // Generate preview token when showPreview is toggled on
  useEffect(() => {
    if (showPreview && selectedSlug) {
      fetchPreviewToken(selectedSlug);
    }
  }, [showPreview, selectedSlug]);

  // Debounced Sync to Preview Store (Step 4)
  useEffect(() => {
    if (!pageData || loading) return;

    const timer = setTimeout(async () => {
      try {
        await fetch('/api/admin/preview-store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken()
          },
          body: JSON.stringify({
            slug: selectedSlug,
            pageData
          })
        });
        
        // Reload iframe
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
          iframe.src = iframe.src;
        }
      } catch (err) {
        console.error('Preview sync failed:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pageData, selectedSlug]);

  const handleFieldChange = (field, subfield, value) => {
    setPageData(prev => ({
      ...prev,
      [field]: subfield 
        ? { ...prev[field], [subfield]: value }
        : value
    }));
  };

  const handleBreadcrumbChange = (key, locale, value) => {
    setPageData(prev => ({
      ...prev,
      breadcrumb: {
        ...prev.breadcrumb,
        [key]: {
          ...prev.breadcrumb?.[key],
          [locale]: value
        }
      }
    }));
  };

  const handleContentChange = (newContent) => {
    setPageData(prev => ({
      ...prev,
      content: newContent
    }));
    setContentJson(JSON.stringify(newContent, null, 2));
  };

  const handleJsonTextareaChange = (val) => {
    setContentJson(val);
    try {
      const parsed = JSON.parse(val);
      setPageData(prev => ({
        ...prev,
        content: parsed
      }));
    } catch (e) {
      // Keep typing, don't update state yet if invalid JSON
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    let parsedContent = {};
    try {
      parsedContent = JSON.parse(contentJson);
    } catch (jsonErr) {
      setError('Invalid JSON content: ' + jsonErr.message);
      setSaving(false);
      return;
    }

    const payload = {
      ...pageData,
      content: parsedContent
    };

    try {
      const res = await fetch(`/api/admin/pages/${selectedSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save page contents');
      }

      setSuccess('Page settings updated successfully!');
      fetchPageData(selectedSlug);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="pages-container">
      <div className="page-header-banner">
        <div>
          <h1 className="page-title">Page Singletons Editor</h1>
          <p className="page-subtitle">Expose localized content, breadcrumbs, search meta, and arrays with real form controls.</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            onClick={() => setShowPreview(!showPreview)} 
            className={`btn-preview-toggle ${showPreview ? 'active' : ''}`}
          >
            {showPreview ? '👁️ Close Live Preview' : '👁️ Open Live Preview'}
          </button>
        </div>
      </div>

      <div className={`pages-layout-grid ${showPreview ? 'preview-active' : ''}`}>
        {/* Sidebar Page Selector */}
        <div className="selector-panel card-panel">
          <h2 className="panel-title">Select Page</h2>
          <div className="slugs-list">
            {PAGES.map(p => (
              <button
                key={p.slug}
                onClick={() => setSelectedSlug(p.slug)}
                className={`slug-btn ${selectedSlug === p.slug ? 'active' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Editor panel */}
        <div className="editor-panel card-panel">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="loading-state">Fetching page details...</div>
          ) : (
            <div className="editor-content-wrapper">
              {/* Tab Selector */}
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

              {/* Main Form */}
              <form onSubmit={handleSave} className="page-form">
                {activeTab === 'form' ? (
                  <div className="form-builder-area">
                    {/* SEO & Meta */}
                    <div className="form-section-card card-panel">
                      <h3 className="section-title-header">Search Engine Optimization (SEO)</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="field-label">Meta Title (English)</label>
                          <input
                            type="text"
                            value={pageData?.metaTitle?.en || ''}
                            onChange={(e) => handleFieldChange('metaTitle', 'en', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="field-label">Meta Title (Tamil)</label>
                          <input
                            type="text"
                            value={pageData?.metaTitle?.ta || ''}
                            onChange={(e) => handleFieldChange('metaTitle', 'ta', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="field-label">Meta Description (English)</label>
                          <textarea
                            rows={2}
                            value={pageData?.metaDescription?.en || ''}
                            onChange={(e) => handleFieldChange('metaDescription', 'en', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="field-label">Meta Description (Tamil)</label>
                          <textarea
                            rows={2}
                            value={pageData?.metaDescription?.ta || ''}
                            onChange={(e) => handleFieldChange('metaDescription', 'ta', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="form-section-card card-panel">
                      <h3 className="section-title-header">Page Navigation Breadcrumbs</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="field-label">Breadcrumb Home Label (English)</label>
                          <input
                            type="text"
                            value={pageData?.breadcrumb?.home?.en || ''}
                            onChange={(e) => handleBreadcrumbChange('home', 'en', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="field-label">Breadcrumb Home Label (Tamil)</label>
                          <input
                            type="text"
                            value={pageData?.breadcrumb?.home?.ta || ''}
                            onChange={(e) => handleBreadcrumbChange('home', 'ta', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="field-label">Current Page Label (English)</label>
                          <input
                            type="text"
                            value={pageData?.breadcrumb?.current?.en || ''}
                            onChange={(e) => handleBreadcrumbChange('current', 'en', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="field-label">Current Page Label (Tamil)</label>
                          <input
                            type="text"
                            value={pageData?.breadcrumb?.current?.ta || ''}
                            onChange={(e) => handleBreadcrumbChange('current', 'ta', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Fields generator */}
                    <div className="dynamic-fields-root">
                      <FormNode
                        path=""
                        value={pageData?.content || {}}
                        onChange={handleContentChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="json-editor-area">
                    <div className="form-group">
                      <label className="field-label">Raw Page Content Catalog (JSON)</label>
                      <textarea
                        className="json-textarea"
                        rows={25}
                        value={contentJson}
                        onChange={(e) => handleJsonTextareaChange(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="form-submit-bar">
                  <button type="submit" disabled={saving} className="btn-primary btn-save-action">
                    {saving ? 'Saving changes...' : '💾 Save Page Contents'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Live Preview Panel (Step 4) */}
        {showPreview && (
          <div className="preview-simulator-panel card-panel">
            <div className="preview-header-bar">
              <span className="preview-indicator-dot"></span>
              <h3 className="preview-title">Live Preview Simulator</h3>
              <div className="device-size-selector">
                <button 
                  type="button" 
                  onClick={() => setDeviceSize('desktop')} 
                  className={`device-btn ${deviceSize === 'desktop' ? 'active' : ''}`}
                  title="Desktop Size"
                >
                  🖥️
                </button>
                <button 
                  type="button" 
                  onClick={() => setDeviceSize('tablet')} 
                  className={`device-btn ${deviceSize === 'tablet' ? 'active' : ''}`}
                  title="Tablet Size"
                >
                  平板 (Tab)
                </button>
                <button 
                  type="button" 
                  onClick={() => setDeviceSize('mobile')} 
                  className={`device-btn ${deviceSize === 'mobile' ? 'active' : ''}`}
                  title="Mobile Size"
                >
                  📱
                </button>
              </div>
            </div>

            <div className="simulator-viewport-container">
              {previewToken ? (
                <div className={`simulator-frame-wrapper ${deviceSize}`}>
                  <iframe
                    id="preview-iframe"
                    className="preview-iframe"
                    src={`/en/preview?token=${previewToken}`}
                    title="Live Preview frame"
                  />
                </div>
              ) : (
                <div className="preview-loading">Generating secure session token...</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .pages-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        .page-header-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
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
        .btn-preview-toggle {
          background-color: #F1F5F9;
          color: #334155;
          border: 1px solid #CBD5E1;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-preview-toggle:hover {
          background-color: #E2E8F0;
        }
        .btn-preview-toggle.active {
          background-color: #EDF9FC;
          color: #00A8BC;
          border-color: #B2E5EE;
        }
        .pages-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 20px;
          align-items: start;
        }
        .pages-layout-grid.preview-active {
          grid-template-columns: 200px 1fr 1fr;
        }
        .slugs-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .slug-btn {
          text-align: left;
          background: transparent;
          border: none;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slug-btn:hover {
          background-color: #F1F5F9;
          color: #00A8BC;
        }
        .slug-btn.active {
          background-color: #EDF9FC;
          color: #00A8BC;
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
        .page-form {
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

        /* Live Preview Styles */
        .preview-simulator-panel {
          border-left: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
          position: sticky;
          top: 80px;
          padding: 14px;
          background-color: #F8FAFC;
        }
        .preview-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 12px;
        }
        .preview-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10B981;
          display: inline-block;
          margin-right: 6px;
        }
        .preview-title {
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
          flex: 1;
        }
        .device-size-selector {
          display: flex;
          gap: 6px;
        }
        .device-btn {
          background: #ffffff;
          border: 1px solid #CBD5E1;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
        }
        .device-btn.active {
          background: #00A8BC;
          color: #ffffff;
          border-color: #00A8BC;
        }
        .simulator-viewport-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: #E2E8F0;
          border-radius: 8px;
          padding: 10px;
        }
        .simulator-frame-wrapper {
          height: 100%;
          transition: all 0.3s ease;
          background: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .simulator-frame-wrapper.desktop {
          width: 100%;
        }
        .simulator-frame-wrapper.tablet {
          width: 768px;
          max-width: 100%;
          border-radius: 12px;
          border: 8px solid #334155;
        }
        .simulator-frame-wrapper.mobile {
          width: 375px;
          max-width: 100%;
          height: 85%;
          border-radius: 24px;
          border: 10px solid #334155;
        }
        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #ffffff;
        }
        .preview-loading {
          color: #64748B;
          font-style: italic;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
