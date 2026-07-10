'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Top Level Sections Definition ───────────────────────────────────────────
const SECTIONS = [
  { id: 'brand', label: 'Brand Identity', icon: '🏷️' },
  { id: 'contact', label: 'Contact Info', icon: '📞' },
  { id: 'social', label: 'Social Links', icon: '🔗' },
  { id: 'address', label: 'Address Info', icon: '📍' },
  { id: 'clinicHours', label: 'Clinic Hours', icon: '🕒' },
  { id: 'copyright', label: 'Copyright Info', icon: '📝' },
  { id: 'navigation', label: 'Navigation Links', icon: '🧭' },
  { id: 'footer', label: 'Footer Layout', icon: '👣' },
  { id: 'sharedBlocks', label: 'Shared Blocks', icon: '📦' }
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

// Collapsible top-level section container
function CollapsibleSection({ id, title, icon, isExpanded, onToggle, isDirty, children }) {
  return (
    <section id={`section-${id}`} className={`form-section-card card-panel ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
      <div className="section-header-row" onClick={onToggle} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <h3 className="section-title-header" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-icon">{icon}</span>
          <span className="section-title-text">{title}</span>
          {isDirty && <span className="dirty-dot" title="Unsaved changes" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />}
        </h3>
        <span className="collapse-chevron" style={{ fontSize: '14px', color: '#64748B' }}>{isExpanded ? '▼' : '▲'}</span>
      </div>
      {isExpanded && (
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
      const enMissing = !enVal || (typeof enVal === 'string' && enVal.trim() === '');
      const taMissing = !taVal || (typeof taVal === 'string' && taVal.trim() === '');
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

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [initialSettings, setInitialSettings] = useState(null); // Dirty checks
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Tab layout state
  const [activeTab, setActiveTab] = useState('form');
  const [settingsJson, setSettingsJson] = useState('{}');
  const [jsonError, setJsonError] = useState(null);

  // Collapsible settings state
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    contact: true,
    social: false,
    address: false,
    clinicHours: false,
    copyright: false,
    navigation: false,
    footer: false,
    sharedBlocks: false
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Active section track (Scrollspy)
  const [activeSection, setActiveSection] = useState('brand');

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      const sData = data.settings || {};
      
      setSettings(sData);
      setInitialSettings(JSON.parse(JSON.stringify(sData)));
      
      const { _id, __v, singletonKey, createdAt, updatedAt, ...cleanData } = sData;
      setSettingsJson(JSON.stringify(cleanData, null, 2));
      setJsonError(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Dirty checks
  const isDirty = initialSettings && JSON.stringify(settings) !== JSON.stringify(initialSettings);

  // Tab close prevention
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Scrollspy observer
  useEffect(() => {
    if (activeTab !== 'form' || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '');
            setActiveSection(id);
          }
        });
      },
      { root: null, rootMargin: '-10% 0px -70% 0px' }
    );

    SECTIONS.forEach(sec => {
      const el = document.getElementById(`section-${sec.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      SECTIONS.forEach(sec => {
        const el = document.getElementById(`section-${sec.id}`);
        if (el) observer.unobserve(el);
      });
    };
  }, [activeTab, loading]);

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
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const handlePrettifyJson = () => {
    try {
      const parsed = JSON.parse(settingsJson);
      setSettingsJson(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      addToast('JSON prettified', 'info');
    } catch (e) {
      setJsonError('Cannot format: ' + e.message);
      addToast('Prettify failed: invalid JSON syntax', 'error');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(settingsJson);
    addToast('JSON copied to clipboard', 'info');
  };

  const handleDiscard = () => {
    if (window.confirm('Discard all unsaved changes and reset form?')) {
      setSettings(JSON.parse(JSON.stringify(initialSettings)));
      const { _id, __v, singletonKey, createdAt, updatedAt, ...cleanData } = initialSettings;
      setSettingsJson(JSON.stringify(cleanData, null, 2));
      setJsonError(null);
      addToast('Changes discarded', 'info');
    }
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const next = {};
    SECTIONS.forEach(sec => { next[sec.id] = true; });
    setExpandedSections(next);
  };

  const handleCollapseAll = () => {
    const next = {};
    SECTIONS.forEach(sec => { next[sec.id] = false; });
    setExpandedSections(next);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpandedSections(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (activeTab === 'json' && jsonError) {
      addToast('Cannot save: please fix JSON errors first', 'error');
      return;
    }

    setSaving(true);
    let payload = {};
    try {
      payload = JSON.parse(settingsJson);
    } catch (err) {
      addToast('Invalid JSON content: ' + err.message, 'error');
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
        throw new Error(data.message || 'Failed to save site settings');
      }

      addToast('Global site settings updated successfully!');
      fetchSettings();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isSectionDirty = (sectionId) => {
    if (!initialSettings || !settings) return false;
    let keys = [];
    if (sectionId === 'brand') keys = ['siteTitle', 'siteDescription', 'logo', 'favicon'];
    else if (sectionId === 'contact') keys = ['phone1', 'phone2', 'phone3', 'email'];
    else if (sectionId === 'social') keys = ['facebookLink', 'instagramLink', 'whatsappLink', 'twitterLink'];
    else keys = [sectionId];

    return keys.some(k => JSON.stringify(settings[k]) !== JSON.stringify(initialSettings[k]));
  };

  if (loading) return <div className="loading-state">Loading global settings...</div>;

  return (
    <div className="settings-container">
      <div className="page-header-banner">
        <div>
          <h1 className="page-title">Global Site Settings</h1>
          <p className="page-subtitle">Configure contact lines, address locations, opening hours, navigation links, and shared blocks.</p>
        </div>
      </div>

      <div className="card-panel">
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
            <div className="settings-layout-grid">
              {/* Sticky Sidebar Navigation */}
              <aside className="sidebar-nav-container">
                <nav className="sidebar-nav">
                  <div className="sidebar-header-row">
                    <span className="sidebar-header-title">Navigation</span>
                  </div>
                  <ul className="sidebar-list">
                    {SECTIONS.map(sec => {
                      const dirty = isSectionDirty(sec.id);
                      const active = activeSection === sec.id;
                      return (
                        <li key={sec.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(sec.id)}
                            className={`sidebar-item ${active ? 'active' : ''}`}
                          >
                            <span className="item-icon">{sec.icon}</span>
                            <span className="item-label">{sec.label}</span>
                            {dirty && <span className="dirty-dot-indicator" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="sidebar-global-controls">
                    <button type="button" onClick={handleExpandAll} className="btn-sidebar-action">Expand All</button>
                    <button type="button" onClick={handleCollapseAll} className="btn-sidebar-action">Collapse All</button>
                  </div>
                </nav>
              </aside>

              {/* Main Form Fields Container */}
              <div className="form-builder-area">
                {/* Brand Section */}
                <CollapsibleSection
                  id="brand"
                  title="Brand Identity"
                  icon="🏷️"
                  isExpanded={expandedSections.brand}
                  onToggle={() => toggleSection('brand')}
                  isDirty={isSectionDirty('brand')}
                >
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
                    depth={0}
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
                </CollapsibleSection>

                {/* Contact Info Section */}
                <CollapsibleSection
                  id="contact"
                  title="Direct Contact Info"
                  icon="📞"
                  isExpanded={expandedSections.contact}
                  onToggle={() => toggleSection('contact')}
                  isDirty={isSectionDirty('contact')}
                >
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
                </CollapsibleSection>

                {/* Social Links Section */}
                <CollapsibleSection
                  id="social"
                  title="Social Media Links"
                  icon="🔗"
                  isExpanded={expandedSections.social}
                  onToggle={() => toggleSection('social')}
                  isDirty={isSectionDirty('social')}
                >
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
                </CollapsibleSection>

                {/* Address Section */}
                <CollapsibleSection
                  id="address"
                  title="Address Info"
                  icon="📍"
                  isExpanded={expandedSections.address}
                  onToggle={() => toggleSection('address')}
                  isDirty={isSectionDirty('address')}
                >
                  <FormNode
                    path="address"
                    value={settings?.address}
                    onChange={(newVal) => handleFieldChange('address', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>

                {/* Clinic Hours */}
                <CollapsibleSection
                  id="clinicHours"
                  title="Clinic Hours"
                  icon="🕒"
                  isExpanded={expandedSections.clinicHours}
                  onToggle={() => toggleSection('clinicHours')}
                  isDirty={isSectionDirty('clinicHours')}
                >
                  <FormNode
                    path="clinicHours"
                    value={settings?.clinicHours}
                    onChange={(newVal) => handleFieldChange('clinicHours', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>

                {/* Copyright */}
                <CollapsibleSection
                  id="copyright"
                  title="Copyright Info"
                  icon="📝"
                  isExpanded={expandedSections.copyright}
                  onToggle={() => toggleSection('copyright')}
                  isDirty={isSectionDirty('copyright')}
                >
                  <FormNode
                    path="copyright"
                    value={settings?.copyright}
                    onChange={(newVal) => handleFieldChange('copyright', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>

                {/* Navigation Links */}
                <CollapsibleSection
                  id="navigation"
                  title="Navigation Links"
                  icon="🧭"
                  isExpanded={expandedSections.navigation}
                  onToggle={() => toggleSection('navigation')}
                  isDirty={isSectionDirty('navigation')}
                >
                  <FormNode
                    path="navigation"
                    value={settings?.navigation}
                    onChange={(newVal) => handleFieldChange('navigation', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>

                {/* Footer Layout */}
                <CollapsibleSection
                  id="footer"
                  title="Footer Layout"
                  icon="👣"
                  isExpanded={expandedSections.footer}
                  onToggle={() => toggleSection('footer')}
                  isDirty={isSectionDirty('footer')}
                >
                  <FormNode
                    path="footer"
                    value={settings?.footer}
                    onChange={(newVal) => handleFieldChange('footer', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>

                {/* Shared Blocks */}
                <CollapsibleSection
                  id="sharedBlocks"
                  title="Shared Blocks"
                  icon="📦"
                  isExpanded={expandedSections.sharedBlocks}
                  onToggle={() => toggleSection('sharedBlocks')}
                  isDirty={isSectionDirty('sharedBlocks')}
                >
                  <FormNode
                    path="sharedBlocks"
                    value={settings?.sharedBlocks}
                    onChange={(newVal) => handleFieldChange('sharedBlocks', newVal)}
                    depth={0}
                  />
                </CollapsibleSection>
              </div>
            </div>
          ) : (
            <div className="json-editor-area">
              <div className="json-controls-bar">
                <button type="button" onClick={handlePrettifyJson} className="btn-json-action">✨ Format & Prettify</button>
                <button type="button" onClick={handleCopyJson} className="btn-json-action">📋 Copy JSON</button>
                {jsonError ? (
                  <span className="json-status json-status-invalid">❌ Invalid JSON: {jsonError}</span>
                ) : (
                  <span className="json-status json-status-valid">✓ Valid JSON Syntax</span>
                )}
              </div>
              <div className="form-group">
                <textarea
                  className={`json-textarea ${jsonError ? 'has-error' : ''}`}
                  rows={25}
                  value={settingsJson}
                  onChange={(e) => handleJsonChange(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Sticky Bottom Actions Bar */}
          <div className="form-submit-bar">
            {isDirty && (
              <span className="unsaved-changes-badge">
                ⚠️ Unsaved Changes Detected
              </span>
            )}
            <button 
              type="button" 
              onClick={handleDiscard} 
              disabled={saving || !isDirty} 
              className="btn-discard-action"
            >
              🔄 Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={saving || (activeTab === 'json' && !!jsonError)} 
              className="btn-primary btn-save-action"
            >
              {saving ? 'Saving Settings...' : '💾 Save Site Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Floating toast notifications anchor */}
      <div className="toasts-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-message">{t.message}</span>
            <button type="button" className="toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>×</button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .settings-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 10px;
        }
        .settings-container .page-header-banner {
          margin-bottom: 24px;
        }
        .settings-container .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
        }
        .settings-container .page-subtitle {
          font-size: 14px;
          color: #64748B;
          margin-top: 4px;
        }
        .settings-container .editor-tabs {
          display: flex;
          border-bottom: 1px solid #E2E8F0;
          margin-bottom: 24px;
          gap: 16px;
        }
        .settings-container .tab-btn {
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
        .settings-container .tab-btn:hover {
          color: #0F172A;
        }
        .settings-container .tab-btn.active {
          color: #00A8BC;
          border-bottom-color: #00A8BC;
        }
        .settings-container .loading-state {
          text-align: center;
          padding: 60px;
          color: #64748B;
          font-weight: 500;
        }
        .settings-container .settings-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        /* Layout Grid */
        .settings-container .settings-layout-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
          align-items: start;
        }
        
        /* Sticky Sidebar Navigation */
        .settings-container .sidebar-nav-container {
          position: sticky;
          top: 80px;
        }
        .settings-container .sidebar-nav {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
        }
        .settings-container .sidebar-header-row {
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #E2E8F0;
        }
        .settings-container .sidebar-header-title {
          font-size: 11px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .settings-container .sidebar-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .settings-container .sidebar-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          position: relative;
        }
        .settings-container .sidebar-item:hover {
          background-color: #F1F5F9;
          color: #00A8BC;
        }
        .settings-container .sidebar-item.active {
          background-color: #EDF9FC;
          color: #00A8BC;
          font-weight: 700;
        }
        .settings-container .dirty-dot-indicator {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #EF4444;
        }
        .settings-container .sidebar-global-controls {
          display: flex;
          gap: 8px;
          margin-top: 14px;
          border-top: 1px solid #E2E8F0;
          padding-top: 12px;
        }
        .settings-container .btn-sidebar-action {
          flex: 1;
          background-color: #ffffff;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-container .btn-sidebar-action:hover {
          background-color: #F1F5F9;
          border-color: #94A3B8;
        }
        
        /* Collapsible Top Level Cards */
        .settings-container .form-section-card {
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .settings-container .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .settings-container .section-title-header {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .settings-container .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        .settings-container .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }
        .settings-container .field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .settings-container .field-label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .settings-container .missing-badge {
          font-size: 10px;
          font-weight: 700;
          background-color: #FFF5F5;
          color: #E53E3E;
          border: 1px solid #FEB2B2;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .settings-container .form-group input, .settings-container .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
          transition: all 0.2s;
        }
        .settings-container .form-group input:focus, .settings-container .form-group textarea:focus {
          outline: none;
          border-color: #00A8BC;
          box-shadow: 0 0 0 3px rgba(0, 168, 188, 0.1);
        }
        .settings-container .localized-group {
          background-color: #F8FAFC;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          margin-bottom: 12px;
        }
        .settings-container .locale-bucket-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .settings-container .locale-fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .settings-container .locale-input-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
        }
        .settings-container .locale-badge {
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
        .settings-container .en-badge {
          background-color: #EFF6FF;
          color: #1D4ED8;
          border-color: #BFDBFE;
        }
        .settings-container .ta-badge {
          background-color: #F0FDF4;
          color: #15803D;
          border-color: #BBF7D0;
        }
        .settings-container .locale-input-wrapper input, .settings-container .locale-input-wrapper textarea {
          flex: 1;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          padding: 10px;
          border: 1px solid #CBD5E1;
          font-size: 14px;
        }
        .settings-container .locale-input-wrapper textarea {
          resize: vertical;
        }
        
        /* Sub-sections */
        .settings-container .sub-section-group {
          transition: all 0.2s;
          background-color: #FAFAFA;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
        }
        .settings-container .sub-section-header {
          padding: 8px 12px;
          background-color: #F1F5F9;
          border-bottom: 1px solid #E2E8F0;
          border-radius: 8px 8px 0 0;
        }
        .settings-container .sub-section-title {
          font-size: 12px;
          font-weight: 800;
          color: #00A8BC;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .settings-container .sub-section-body {
          padding: 12px;
        }
        
        /* JSON Editor */
        .settings-container .json-controls-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .settings-container .btn-json-action {
          background-color: #ffffff;
          border: 1px solid #CBD5E1;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-container .btn-json-action:hover {
          background-color: #F1F5F9;
          border-color: #94A3B8;
        }
        .settings-container .json-status {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .settings-container .json-status-valid {
          background-color: #DCFCE7;
          color: #15803D;
        }
        .settings-container .json-status-invalid {
          background-color: #FEE2E2;
          color: #B91C1C;
        }
        .settings-container .json-textarea {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          background-color: #0F172A !important;
          color: #38BDF8 !important;
          border-color: #1E293B !important;
          border-radius: 8px;
          width: 100%;
          padding: 16px;
        }
        .settings-container .json-textarea.has-error {
          border: 2px solid #EF4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
        }
        
        /* Repeater Controls */
        .settings-container .repeater-field-container {
          background-color: #F1F5F9;
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed #CBD5E1;
          margin-bottom: 20px;
        }
        .settings-container .repeater-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .settings-container .repeater-title {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
          text-transform: uppercase;
        }
        .settings-container .btn-add-item {
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
        .settings-container .btn-add-item:hover {
          background-color: #EDF9FC;
        }
        .settings-container .repeater-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .settings-container .repeater-card:active {
          cursor: grabbing;
          transform: scale(0.99);
          box-shadow: 0 4px 6px rgba(0,0,0,0.08);
        }
        .settings-container .repeater-empty-state {
          text-align: center;
          padding: 20px;
          color: #64748B;
          font-size: 13px;
          font-style: italic;
        }
        
        /* Sticky Bottom Bar */
        .settings-container .form-submit-bar {
          position: sticky;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 16px 20px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          z-index: 10;
          border-radius: 0 0 12px 12px;
        }
        .settings-container .unsaved-changes-badge {
          margin-right: auto;
          font-size: 12px;
          font-weight: 800;
          color: #D97706;
          background-color: #FEF3C7;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #FCD34D;
        }
        .settings-container .btn-discard-action {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          background-color: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .settings-container .btn-discard-action:hover:not(:disabled) {
          background-color: #F8FAFC;
          border-color: #94A3B8;
        }
        .settings-container .btn-discard-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .settings-container .btn-save-action {
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
        .settings-container .btn-save-action:hover:not(:disabled) {
          background-color: #008E9F;
        }
        .settings-container .btn-save-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        
        /* Floating Toasts */
        .settings-container .toasts-container {
          position: fixed;
          bottom: 80px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
          max-width: 320px;
        }
        .settings-container .toast {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          animation: slideIn 0.2s ease-out;
        }
        .settings-container .toast-success {
          background-color: #10B981;
        }
        .settings-container .toast-error {
          background-color: #EF4444;
        }
        .settings-container .toast-info {
          background-color: #3B82F6;
        }
        .settings-container .toast-close {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-left: 12px;
          opacity: 0.8;
        }
        .settings-container .toast-close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* Responsive Layout Breakpoints */
        @media (max-width: 768px) {
          .settings-container .settings-layout-grid {
            grid-template-columns: 1fr;
          }
          .settings-container .sidebar-nav-container {
            position: sticky;
            top: 0;
            z-index: 20;
          }
          .settings-container .sidebar-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
            scroll-behavior: smooth;
          }
          .settings-container .sidebar-item {
            white-space: nowrap;
            width: auto;
            flex-shrink: 0;
          }
          .settings-container .sidebar-global-controls {
            display: none;
          }
          .settings-container .form-submit-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .settings-container .unsaved-changes-badge {
            margin-right: 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
