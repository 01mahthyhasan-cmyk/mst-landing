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

export default function PagesManagementPage() {
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Content JSON String
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
      setPageData(data.page || {});
      setContentJson(JSON.stringify(data.page?.content || {}, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData(selectedSlug);
  }, [selectedSlug]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Validate and parse content JSON
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Page Singletons</h1>
          <p className="page-subtitle">Configure search engine metadata, breadcrumbs, and arbitrary dynamic text regions for all 14 pages.</p>
        </div>
      </div>

      <div className="pages-layout">
        {/* Selector sidebar */}
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

        {/* Editor Form */}
        <div className="editor-panel card-panel">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="loading-state">Fetching page details...</div>
          ) : (
            <form onSubmit={handleSave} className="page-form">
              <div className="form-section-header">
                <h2>SEO & Meta Configuration</h2>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Meta Title (English)</label>
                  <input
                    type="text"
                    value={pageData?.metaTitle?.en || ''}
                    onChange={(e) => handleFieldChange('metaTitle', 'en', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Meta Title (Tamil)</label>
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
                  <label>Meta Description (English)</label>
                  <textarea
                    rows={2}
                    value={pageData?.metaDescription?.en || ''}
                    onChange={(e) => handleFieldChange('metaDescription', 'en', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Meta Description (Tamil)</label>
                  <textarea
                    rows={2}
                    value={pageData?.metaDescription?.ta || ''}
                    onChange={(e) => handleFieldChange('metaDescription', 'ta', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section-header">
                <h2>Breadcrumbs</h2>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Breadcrumb Home Label (English)</label>
                  <input
                    type="text"
                    value={pageData?.breadcrumb?.home?.en || ''}
                    onChange={(e) => handleBreadcrumbChange('home', 'en', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Breadcrumb Home Label (Tamil)</label>
                  <input
                    type="text"
                    value={pageData?.breadcrumb?.home?.ta || ''}
                    onChange={(e) => handleBreadcrumbChange('home', 'ta', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Current Page Label (English)</label>
                  <input
                    type="text"
                    value={pageData?.breadcrumb?.current?.en || ''}
                    onChange={(e) => handleBreadcrumbChange('current', 'en', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Current Page Label (Tamil)</label>
                  <input
                    type="text"
                    value={pageData?.breadcrumb?.current?.ta || ''}
                    onChange={(e) => handleBreadcrumbChange('current', 'ta', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-section-header">
                <h2>Custom Page Content (JSON Catalog)</h2>
                <small className="help-text">Direct dictionary values mapped for this specific singleton page. Ensure correct JSON structure.</small>
              </div>
              <div className="form-group">
                <textarea
                  className="json-textarea"
                  rows={15}
                  value={contentJson}
                  onChange={(e) => setContentJson(e.target.value)}
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : '💾 Save Page Contents'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .pages-container {
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
        .pages-layout {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 30px;
          align-items: start;
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
        .page-form {
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
        .json-textarea {
          font-family: 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.5;
          background-color: #0F172A !important;
          color: #38BDF8 !important;
          border-color: #1E293B !important;
        }
        .help-text {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
