'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

const COLLECTION_CONFIGS = {
  'services': {
    title: 'Services Registry',
    subtitle: 'Manage OPD clinics, physiotherapy rooms, labs, and specialized medical camps.',
    apiPath: '/api/admin/services',
    labelField: 'name',
    hasSlug: true,
    fields: [
      { name: 'name', label: 'Service Name', type: 'localized', required: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'iconClass', label: 'FontAwesome Icon Class', type: 'text', placeholder: 'fa-solid fa-stethoscope' },
      { name: 'listingIcon', label: 'Listing Icon Path / Asset URL', type: 'text' },
      { name: 'heroImage', label: 'Hero Image Path / Asset URL', type: 'text' },
      { name: 'benefitImage', label: 'Benefit Image Path / Asset URL', type: 'text' },
      { name: 'desc1', label: 'Primary Description', type: 'localized_textarea' },
      { name: 'desc2', label: 'Secondary Description', type: 'localized_textarea' },
      { name: 'status', label: 'Workflow Status', type: 'select', options: ['draft', 'published'] }
    ]
  },
  'blog-posts': {
    title: 'Blog Articles',
    subtitle: 'Publish health tips, clinical announcements, and community wellness updates.',
    apiPath: '/api/admin/blog-posts',
    labelField: 'title',
    hasSlug: true,
    fields: [
      { name: 'title', label: 'Article Title', type: 'localized', required: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'localized' },
      { name: 'image', label: 'Featured Image Path / Asset URL', type: 'text' },
      { name: 'author', label: 'Author Name', type: 'localized' },
      { name: 'content', label: 'Article Content Body', type: 'localized_textarea' },
      { name: 'status', label: 'Workflow Status', type: 'select', options: ['draft', 'published'] }
    ]
  },
  'team-members': {
    title: 'Medical Team Profiles',
    subtitle: 'Register medical practitioners, education details, clinical positions, and location info.',
    apiPath: '/api/admin/team-members',
    labelField: 'name',
    hasSlug: true,
    fields: [
      { name: 'name', label: 'Full Name', type: 'localized', required: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'role', label: 'Medical Role / Specialty', type: 'localized', required: true },
      { name: 'image', label: 'Profile Picture Path / Asset URL', type: 'text' },
      { name: 'phone', label: 'Office Phone Line', type: 'text' },
      { name: 'email', label: 'Professional Email', type: 'text' },
      { name: 'bio', label: 'Professional Bio', type: 'localized_textarea' },
      { name: 'status', label: 'Workflow Status', type: 'select', options: ['draft', 'published'] }
    ]
  },
  'case-studies': {
    title: 'Clinical Case Studies',
    subtitle: 'Document critical treatments, medical evaluations, challenges, and client outcomes.',
    apiPath: '/api/admin/case-studies',
    labelField: 'title',
    hasSlug: true,
    fields: [
      { name: 'title', label: 'Case Study Title', type: 'localized', required: true },
      { name: 'slug', label: 'URL Slug', type: 'text', required: true },
      { name: 'category', label: 'Medical Category', type: 'localized' },
      { name: 'image', label: 'Featured Image Path / Asset URL', type: 'text' },
      { name: 'client', label: 'Client / Community Type', type: 'localized' },
      { name: 'result', label: 'Clinical Result', type: 'localized' },
      { name: 'overview', label: 'Treatment Overview', type: 'localized_textarea' },
      { name: 'challenge', label: 'Clinical Challenge', type: 'localized_textarea' },
      { name: 'status', label: 'Workflow Status', type: 'select', options: ['draft', 'published'] }
    ]
  },
  'testimonials': {
    title: 'Testimonials Listing',
    subtitle: 'Showcase patient feedback, recovery comments, and experience reviews.',
    apiPath: '/api/admin/testimonials',
    labelField: 'authorName',
    hasSlug: false,
    fields: [
      { name: 'authorName', label: 'Patient Name', type: 'localized', required: true },
      { name: 'authorRole', label: 'Patient Role / Subtitle', type: 'localized' },
      { name: 'authorImage', label: 'Patient Avatar Path / Asset URL', type: 'text' },
      { name: 'quote', label: 'Patient Testimonial Quote', type: 'localized_textarea', required: true },
      { name: 'status', label: 'Workflow Status', type: 'select', options: ['draft', 'published'] }
    ]
  }
};

export default function GenericCollectionPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const collectionName = params.collection;
  const config = COLLECTION_CONFIGS[collectionName];

  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing/Creating modal states
  const [activeItem, setActiveItem] = useState(null); // null means list view, {} or object means edit form
  const [formData, setFormData] = useState({});

  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchItems = async () => {
    if (!config) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(config.apiPath);
      if (!res.ok) throw new Error(`Failed to load ${collectionName}`);
      const data = await res.json();
      setItems(data.data || data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveItem(null);
    fetchItems();
  }, [collectionName]);

  if (!config) {
    return <div className="loading-state">Unsupported collection catalog route: {collectionName}</div>;
  }

  const handleCreateNew = () => {
    const initData = {};
    config.fields.forEach(f => {
      if (f.type === 'localized' || f.type === 'localized_textarea') {
        initData[f.name] = { en: '', ta: '' };
      } else if (f.name === 'status') {
        initData[f.name] = 'draft';
      } else {
        initData[f.name] = '';
      }
    });
    setFormData(initData);
    setActiveItem({ _isNew: true });
  };

  const handleEditItem = (item) => {
    const editData = {};
    config.fields.forEach(f => {
      if (f.type === 'localized' || f.type === 'localized_textarea') {
        editData[f.name] = {
          en: item[f.name]?.en || '',
          ta: item[f.name]?.ta || ''
        };
      } else {
        editData[f.name] = item[f.name] || '';
      }
    });
    setFormData(editData);
    setActiveItem(item);
  };

  const handleFormChange = (fieldName, val, locale = null) => {
    setFormData(prev => {
      if (locale) {
        return {
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            [locale]: val
          }
        };
      }
      return {
        ...prev,
        [fieldName]: val
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isNew = activeItem._isNew;
    const url = isNew ? config.apiPath : `${config.apiPath}/${activeItem._id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(formData)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Operation failed');

      setSuccess(`${isNew ? 'Created' : 'Updated'} item successfully!`);
      setActiveItem(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${config.apiPath}/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': getCsrfToken()
        }
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Deletion failed');

      setSuccess('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderFieldValue = (item, field) => {
    const val = item[field.name];
    if (field.type === 'localized' || field.type === 'localized_textarea') {
      return (
        <div className="loc-value-preview">
          <span>🇬🇧 {val?.en || <span className="empty-text">Empty</span>}</span>
          <span>🇱🇰 {val?.ta || <span className="empty-text">Empty</span>}</span>
        </div>
      );
    }
    return val?.toString() || '-';
  };

  return (
    <div className="collection-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-subtitle">{config.subtitle}</p>
        </div>
        {!activeItem && (
          <button onClick={handleCreateNew} className="btn-primary">
            ➕ Add New Entry
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Main Form Edit view */}
      {activeItem ? (
        <div className="card-panel">
          <div className="form-header">
            <h2>{activeItem._isNew ? 'Create New Entry' : 'Edit Entry details'}</h2>
            <button onClick={() => setActiveItem(null)} className="btn-secondary">
              &larr; Back to List
            </button>
          </div>

          <form onSubmit={handleSubmit} className="entry-form">
            {config.fields.map(f => {
              if (f.type === 'localized') {
                return (
                  <div key={f.name} className="form-row">
                    <div className="form-group">
                      <label>{f.label} (English)</label>
                      <input
                        type="text"
                        value={formData[f.name]?.en || ''}
                        onChange={(e) => handleFormChange(f.name, e.target.value, 'en')}
                        required={f.required}
                        placeholder={f.placeholder}
                      />
                    </div>
                    <div className="form-group">
                      <label>{f.label} (Tamil)</label>
                      <input
                        type="text"
                        value={formData[f.name]?.ta || ''}
                        onChange={(e) => handleFormChange(f.name, e.target.value, 'ta')}
                        required={f.required}
                        placeholder={f.placeholder}
                      />
                    </div>
                  </div>
                );
              }
              if (f.type === 'localized_textarea') {
                return (
                  <div key={f.name} className="form-row">
                    <div className="form-group">
                      <label>{f.label} (English)</label>
                      <textarea
                        rows={4}
                        value={formData[f.name]?.en || ''}
                        onChange={(e) => handleFormChange(f.name, e.target.value, 'en')}
                        required={f.required}
                        placeholder={f.placeholder}
                      />
                    </div>
                    <div className="form-group">
                      <label>{f.label} (Tamil)</label>
                      <textarea
                        rows={4}
                        value={formData[f.name]?.ta || ''}
                        onChange={(e) => handleFormChange(f.name, e.target.value, 'ta')}
                        required={f.required}
                        placeholder={f.placeholder}
                      />
                    </div>
                  </div>
                );
              }
              if (f.type === 'select') {
                return (
                  <div key={f.name} className="form-group">
                    <label>{f.label}</label>
                    <select
                      value={formData[f.name] || ''}
                      onChange={(e) => handleFormChange(f.name, e.target.value)}
                    >
                      {f.options.map(opt => (
                        <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              return (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  <input
                    type="text"
                    value={formData[f.name] || ''}
                    onChange={(e) => handleFormChange(f.name, e.target.value)}
                    required={f.required}
                    placeholder={f.placeholder}
                  />
                </div>
              );
            })}

            <div className="form-actions">
              <button type="button" onClick={() => setActiveItem(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                💾 Save Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List view */
        <div className="card-panel">
          {loading ? (
            <div className="loading-state">Loading registry index...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No registry logs added yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    {config.fields.filter(f => f.name !== 'desc1' && f.name !== 'desc2' && f.name !== 'content' && f.name !== 'overview' && f.name !== 'challenge' && f.name !== 'bio').map(f => (
                      <th key={f.name}>{f.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      {config.fields.filter(f => f.name !== 'desc1' && f.name !== 'desc2' && f.name !== 'content' && f.name !== 'overview' && f.name !== 'challenge' && f.name !== 'bio').map(f => (
                        <td key={f.name}>
                          {f.name === 'status' ? (
                            <span className={`status-badge ${item.status}`}>
                              {item.status}
                            </span>
                          ) : (
                            renderFieldValue(item, f)
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="actions-cell">
                          <button onClick={() => handleEditItem(item)} className="btn-edit">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDeleteItem(item._id)} className="btn-delete">
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .collection-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
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
        .loading-state, .empty-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .form-header h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
        }
        .entry-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
        .form-group input, .form-group textarea, .form-group select {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          outline: none;
          border-color: #00A8BC;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #E2E8F0;
          padding-top: 20px;
          margin-top: 10px;
        }
        .loc-value-preview {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
        }
        .empty-text {
          color: #94A3B8;
          font-style: italic;
        }
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        .btn-edit, .btn-delete {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-edit {
          color: #00A8BC;
        }
        .btn-edit:hover {
          background-color: #EDF9FC;
        }
        .btn-delete {
          color: #EF4444;
        }
        .btn-delete:hover {
          background-color: #FEE2E2;
        }
      `}</style>
    </div>
  );
}
