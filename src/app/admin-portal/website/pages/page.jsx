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
    p.includes('address') || p.includes('copyright') || p.includes('hours') ||
    p.includes('heading') || p.includes('caption');
}

// Collapsible nested section component for depth > 0
function CollapsibleSubSection({ label, children, depth }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="sub-section-group" style={{
      borderLeft: `3px solid rgba(0, 168, 188, ${Math.max(0.2, 1 - depth * 0.15)})`,
      paddingLeft: '12px',
      marginLeft: `${depth > 1 ? 8 : 0}px`,
      marginBottom: '12px'
    }}>
      <div className="sub-section-header" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <h4 className="sub-section-title" style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#00A8BC', textTransform: 'uppercase' }}>{label}</h4>
        <span className="collapse-chevron" style={{ fontSize: '10px', color: '#64748B' }}>{expanded ? '▼' : '▶'}</span>
      </div>
      {expanded && <div className="sub-section-body" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>}
    </div>
  );
}

// Collapsible top-level section container for Pages Editor
function CollapsibleSection({ title, children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className={`form-section-card card-panel ${expanded ? 'is-expanded' : 'is-collapsed'}`}>
      <div className="section-header-row" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <h3 className="section-title-header" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-title-text">{title}</span>
        </h3>
        <span className="collapse-chevron" style={{ fontSize: '14px', color: '#64748B' }}>{expanded ? '▼' : '▲'}</span>
      </div>
      {expanded && (
        <div className="section-fields-container" style={{ marginTop: '16px' }}>
          {children}
        </div>
      )}
    </section>
  );
}

// Collapsible RepeaterCard with Drag and Drop capabilities
function RepeaterCard({ item, index, onRemove, onDuplicate, onChange, onMove, totalItems }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSummary = () => {
    if (!item) return `Item #${index + 1}`;
    const labelVal = item.label || item.title || item.name || item.heading;
    let labelText = '';
    if (typeof labelVal === 'object' && labelVal !== null) {
      labelText = labelVal.en || labelVal.ta || '';
    } else if (typeof labelVal === 'string') {
      labelText = labelVal;
    }
    const hrefVal = item.href || item.link || item.url || '';
    let summary = labelText ? `"${labelText}"` : `Item #${index + 1}`;
    if (hrefVal) {
      summary += ` ➔ ${hrefVal}`;
    }
    return summary;
  };

  const hrefVal = item?.href || item?.link || item?.url || '';

  return (
    <div 
      className={`repeater-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(index));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(fromIndex) && fromIndex !== index) {
          onMove(fromIndex, index);
        }
      }}
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        marginBottom: '8px',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="repeater-card-header" style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none', borderRadius: isExpanded ? '8px 8px 0 0' : '8px' }}>
        <div className="drag-handle" title="Drag to reorder" style={{ cursor: 'grab', marginRight: '10px', color: '#94A3B8', fontSize: '16px', userSelect: 'none' }}>☰</div>
        <div className="summary-text" onClick={() => setIsExpanded(!isExpanded)} style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
          <span className="index-badge" style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#EDF9FC', color: '#00A8BC', padding: '2px 6px', borderRadius: '4px' }}>#{index + 1}</span>
          <span className="summary-label" style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{getSummary()}</span>
        </div>
        <div className="repeater-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hrefVal && typeof hrefVal === 'string' && (
            <a 
              href={hrefVal.startsWith('http') ? hrefVal : `https://${hrefVal}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-visit-link" 
              title="Visit Link"
              style={{ textDecoration: 'none', padding: '4px 6px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '12px' }}
            >
              🔗
            </a>
          )}
          <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="btn-expand-card" style={{ padding: '4px 8px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button type="button" onClick={onDuplicate} className="btn-duplicate-card" title="Duplicate" style={{ padding: '4px 8px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: '#0F172A' }}>
            👯 Duplicate
          </button>
          <button type="button" onClick={onRemove} className="btn-remove-card" title="Delete" style={{ padding: '4px 8px', border: '1px solid #FCA5A5', borderRadius: '4px', backgroundColor: '#FFF5F5', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: '#EF4444' }}>
            ❌ Remove
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="repeater-card-body" style={{ padding: '14px' }}>
          <FormNode path="" value={item} onChange={onChange} depth={0} />
        </div>
      )}
    </div>
  );
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
  
  const handleDuplicate = (i) => {
    const newItems = [...items];
    const duplicated = JSON.parse(JSON.stringify(items[i]));
    newItems.splice(i + 1, 0, duplicated);
    onChange(newItems);
  };

  const handleChange = (i, v) => {
    const u = [...items];
    u[i] = v;
    onChange(u);
  };

  const handleMove = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [dragged] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, dragged);
    onChange(newItems);
  };

  return (
    <div className="repeater-field-container">
      <div className="repeater-header">
        <span className="repeater-title">{label}</span>
        <button type="button" onClick={handleAdd} className="btn-add-item">+ Add Entry</button>
      </div>
      <div className="repeater-list">
        {items.map((item, idx) => (
          <RepeaterCard
            key={idx}
            item={item}
            index={idx}
            onRemove={() => handleRemove(idx)}
            onDuplicate={() => handleDuplicate(idx)}
            onChange={(v) => handleChange(idx, v)}
            onMove={handleMove}
            totalItems={items.length}
          />
        ))}
        {items.length === 0 && (
          <div className="repeater-empty-state">No items yet. Click "Add Entry" to begin.</div>
        )}
      </div>
    </div>
  );
}

// Stable FormNode component
function FormNode({ path, value, onChange, depth = 0 }) {
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
                  depth={depth}
                />
              );
            })}
          </div>
        );
      }

      // A2. Localized arrays: {en: [...], ta: [...]}
      if (Array.isArray(enVal)) {
        const label = formatLabel(path);
        const enMissing = !enVal || enVal.length === 0;
        const taMissing = !taVal || taVal.length === 0;
        return (
          <div className="form-group localized-group">
            <div className="field-label-row">
              {label && <label className="field-label">{label}</label>}
              {(enMissing || taMissing) && (
                <span className="missing-badge">
                  ⚠️ Missing {enMissing && taMissing ? 'EN & TA' : enMissing ? 'EN' : 'TA'}
                </span>
              )}
            </div>
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
      const enMissing = !enVal;
      const taMissing = !taVal;
      const long = isLongField(path) ||
        (typeof enVal === 'string' && enVal.length > 80) ||
        (typeof taVal === 'string' && taVal.length > 80);
      return (
        <div className="form-group localized-group">
          <div className="field-label-row">
            {label && <label className="field-label">{label}</label>}
            {(enMissing || taMissing) && (
              <span className="missing-badge">
                ⚠️ Missing {enMissing && taMissing ? 'EN & TA' : enMissing ? 'EN' : 'TA'}
              </span>
            )}
          </div>
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
    const children = keys.map(k => (
      <FormNode
        key={k}
        path={path ? `${path}.${k}` : k}
        value={value[k]}
        onChange={(nv) => onChange({ ...value, [k]: nv })}
        depth={depth + 1}
      />
    ));

    if (depth === 0) return <div className="nested-fields-wrapper">{children}</div>;
    if (depth === 1) {
      return (
        <CollapsibleSection title={formatLabel(path)}>
          {children}
        </CollapsibleSection>
      );
    }
    return (
      <CollapsibleSubSection label={formatLabel(path)} depth={depth}>
        {children}
      </CollapsibleSubSection>
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

      <style jsx global>{`
        .pages-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        .pages-container .page-header-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .pages-container .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }
        .pages-container .page-subtitle {
          font-size: 14px;
          color: #64748B;
          margin-top: 4px;
        }
        .pages-container .btn-preview-toggle {
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
        .pages-container .btn-preview-toggle:hover {
          background-color: #E2E8F0;
        }
        .pages-container .btn-preview-toggle.active {
          background-color: #EDF9FC;
          color: #00A8BC;
          border-color: #B2E5EE;
        }
        .pages-container .pages-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 20px;
          align-items: start;
        }
        .pages-container .pages-layout-grid.preview-active {
          grid-template-columns: 200px 1fr 1fr;
        }
        .pages-container .slugs-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pages-container .slug-btn {
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
        .pages-container .slug-btn:hover {
          background-color: #F1F5F9;
          color: #00A8BC;
        }
        .pages-container .slug-btn.active {
          background-color: #EDF9FC;
          color: #00A8BC;
        }
        .pages-container .editor-tabs {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 24px;
          gap: 16px;
        }
        .pages-container .tab-btn {
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
        .pages-container .tab-btn:hover {
          color: #0F172A;
        }
        .pages-container .tab-btn.active {
          color: #00A8BC;
          border-bottom-color: #00A8BC;
        }
        .pages-container .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .pages-container .alert-error {
          background-color: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        }
        .pages-container .alert-success {
          background-color: #DCFCE7;
          color: #15803D;
          border: 1px solid #86EFAC;
        }
        .pages-container .loading-state {
          text-align: center;
          padding: 60px;
          color: #64748B;
          font-weight: 500;
        }
        .pages-container .page-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .pages-container .form-section-card {
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background-color: #ffffff;
        }
        .pages-container .section-title-header {
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #F1F5F9;
        }
        .pages-container .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .pages-container .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .pages-container .field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .pages-container .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .pages-container .missing-badge {
          font-size: 10px;
          font-weight: 700;
          background-color: #FFF5F5;
          color: #E53E3E;
          border: 1px solid #FEB2B2;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .pages-container .form-group input, .pages-container .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
          transition: all 0.2s;
        }
        .pages-container .form-group input:focus, .pages-container .form-group textarea:focus {
          outline: none;
          border-color: #00A8BC;
          box-shadow: 0 0 0 3px rgba(0, 168, 188, 0.1);
        }
        .pages-container .localized-group {
          background-color: #F8FAFC;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          margin-bottom: 12px;
        }
        .pages-container .locale-bucket-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pages-container .sub-section-group {
          margin-bottom: 16px;
          padding: 14px;
          background-color: #FAFAFA;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
        }
        .pages-container .sub-section-header {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
        }
        .pages-container .sub-section-title {
          font-size: 12px;
          font-weight: 800;
          color: #00A8BC;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pages-container .sub-section-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pages-container .locale-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .pages-container .locale-input-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
        }
        .pages-container .locale-badge {
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
        .pages-container .en-badge {
          background-color: #EFF6FF;
          color: #1D4ED8;
          border-color: #BFDBFE;
        }
        .pages-container .ta-badge {
          background-color: #F0FDF4;
          color: #15803D;
          border-color: #BBF7D0;
        }
        .pages-container .locale-input-wrapper input, .pages-container .locale-input-wrapper textarea {
          flex: 1;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding: 10px;
          border: 1px solid #CBD5E1;
          font-size: 14px;
        }
        .pages-container .locale-input-wrapper textarea {
          resize: vertical;
        }
        .pages-container .json-textarea {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          background-color: #0F172A !important;
          color: #38BDF8 !important;
          border-color: #1E293B !important;
          border-radius: 8px;
        }
        .pages-container .repeater-field-container {
          background-color: #F1F5F9;
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed #CBD5E1;
          margin-bottom: 20px;
        }
        .pages-container .repeater-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .pages-container .repeater-title {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pages-container .btn-add-item {
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
        .pages-container .btn-add-item:hover {
          background-color: #EDF9FC;
        }
        .pages-container .repeater-card {
          background-color: #ffffff;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .pages-container .repeater-card:active {
          cursor: grabbing;
          transform: scale(0.99);
          box-shadow: 0 4px 6px rgba(0,0,0,0.08);
        }
        .pages-container .repeater-empty-state {
          text-align: center;
          padding: 20px;
          color: #64748B;
          font-size: 13px;
          font-style: italic;
        }
        .pages-container .form-submit-bar {
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
        .pages-container .btn-save-action {
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
        .pages-container .btn-save-action:hover {
          background-color: #008E9F;
        }

        /* Live Preview Styles */
        .pages-container .preview-simulator-panel {
          border-left: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
          position: sticky;
          top: 80px;
          padding: 14px;
          background-color: #F8FAFC;
        }
        .pages-container .preview-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 12px;
        }
        .pages-container .preview-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10B981;
          display: inline-block;
          margin-right: 6px;
        }
        .pages-container .preview-title {
          font-size: 14px;
          font-weight: 800;
          color: #0F172A;
          flex: 1;
        }
        .pages-container .device-size-selector {
          display: flex;
          gap: 6px;
        }
        .pages-container .device-btn {
          background: #ffffff;
          border: 1px solid #CBD5E1;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
        }
        .pages-container .device-btn.active {
          background: #00A8BC;
          color: #ffffff;
          border-color: #00A8BC;
        }
        .pages-container .simulator-viewport-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: #E2E8F0;
          border-radius: 8px;
          padding: 10px;
        }
        .pages-container .simulator-frame-wrapper {
          height: 100%;
          transition: all 0.3s ease;
          background: #ffffff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .pages-container .simulator-frame-wrapper.desktop {
          width: 100%;
        }
        .pages-container .simulator-frame-wrapper.tablet {
          width: 768px;
          max-width: 100%;
          border-radius: 12px;
          border: 8px solid #334155;
        }
        .pages-container .simulator-frame-wrapper.mobile {
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
