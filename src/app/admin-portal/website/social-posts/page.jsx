'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { autoDetectPlatform, validateSocialUrl } from '@/lib/socialEmbed';

export default function SocialPostsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [activeItem, setActiveItem] = useState(null); // null means list view, {} or object means edit form
  const [formData, setFormData] = useState({
    platform: '',
    postUrl: '',
    embedHtml: '',
    thumbnailUrl: '',
    influencerName: '',
    influencerHandle: '',
    caption: '',
    status: 'draft',
    isFeatured: false,
    displayOrder: 0
  });

  const [fetchingOembed, setFetchingOembed] = useState(false);
  const [oembedError, setOembedError] = useState('');
  const [oembedSuccess, setOembedSuccess] = useState('');

  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/social-posts');
      if (!res.ok) throw new Error('Failed to load social posts');
      const data = await res.json();
      
      // Sort items by displayOrder asc, then createdAt desc
      const sorted = (data.items || []).sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setItems(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateNew = () => {
    setFormData({
      platform: '',
      postUrl: '',
      embedHtml: '',
      thumbnailUrl: '',
      influencerName: '',
      influencerHandle: '',
      caption: '',
      status: 'draft',
      isFeatured: false,
      displayOrder: items.length // Set at the end by default
    });
    setOembedError('');
    setOembedSuccess('');
    setActiveItem({ _isNew: true });
  };

  const handleEditItem = (item) => {
    setFormData({
      platform: item.platform || '',
      postUrl: item.postUrl || '',
      embedHtml: item.embedHtml || '',
      thumbnailUrl: item.thumbnailUrl || '',
      influencerName: item.influencerName || '',
      influencerHandle: item.influencerHandle || '',
      caption: item.caption || '',
      status: item.status || 'draft',
      isFeatured: item.isFeatured || false,
      displayOrder: item.displayOrder || 0
    });
    setOembedError('');
    setOembedSuccess('');
    setActiveItem(item);
  };

  const handleFormChange = (fieldName, val) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: val };
      // Auto detect platform when URL changes
      if (fieldName === 'postUrl') {
        const detected = autoDetectPlatform(val);
        if (detected) {
          updated.platform = detected;
        }
      }
      return updated;
    });
  };

  // oEmbed fetch trigger
  const handleFetchOembed = async () => {
    setOembedError('');
    setOembedSuccess('');
    
    const { postUrl, platform } = formData;
    if (!postUrl || !platform) {
      setOembedError('Please provide a URL and select a platform first.');
      return;
    }

    if (!validateSocialUrl(postUrl, platform)) {
      setOembedError(`The pasted URL does not match the validation pattern for ${platform}.`);
      return;
    }

    setFetchingOembed(true);
    try {
      const res = await fetch(`/api/social/oembed?url=${encodeURIComponent(postUrl)}&platform=${platform}`);
      const resData = await res.json();
      
      if (!res.ok) {
        throw new Error(resData.message || 'Failed to fetch oEmbed content.');
      }

      const { data } = resData;
      setFormData(prev => ({
        ...prev,
        embedHtml: data.embedHtml || prev.embedHtml,
        thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
        influencerName: data.influencerName || prev.influencerName,
        influencerHandle: data.influencerHandle || prev.influencerHandle,
        caption: data.caption || prev.caption,
      }));
      setOembedSuccess('Successfully fetched post preview from platform oEmbed services!');
    } catch (err) {
      setOembedError(`oEmbed services query failed: ${err.message}. You can still save this entry as a draft with a manual thumbnail URL as a fallback.`);
    } finally {
      setFetchingOembed(false);
    }
  };

  // Image Upload for fallback thumbnail
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    setUploadingThumbnail(true);
    setOembedError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('altEn', '');
      fd.append('altTa', '');
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'x-csrf-token': getCsrfToken() },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      handleFormChange('thumbnailUrl', data.media.url);
    } catch (err) {
      setOembedError(`Thumbnail upload failed: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Submit form (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { postUrl, platform } = formData;
    if (!validateSocialUrl(postUrl, platform)) {
      setError(`Cannot save: The URL does not match the selected platform (${platform}) requirements.`);
      return;
    }

    const isNew = activeItem._isNew;
    const url = isNew ? '/api/admin/social-posts' : `/api/admin/social-posts/${activeItem._id}`;
    const method = isNew ? 'POST' : 'PATCH';

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

      setSuccess(`Social post ${isNew ? 'registered' : 'updated'} successfully!`);
      setActiveItem(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete social post
  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to permanently delete this social feed post?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/social-posts/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': getCsrfToken()
        }
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Deletion failed');

      setSuccess('Social post removed successfully!');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  // Reorder buttons handler
  const handleMoveItem = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    setError('');
    setSuccess('');

    const itemA = items[index];
    const itemB = items[targetIndex];

    // Assign clean displayOrders
    const orderA = targetIndex;
    const orderB = index;

    try {
      const promises = [
        fetch(`/api/admin/social-posts/${itemA._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken()
          },
          body: JSON.stringify({ displayOrder: orderA })
        }),
        fetch(`/api/admin/social-posts/${itemB._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': getCsrfToken()
          },
          body: JSON.stringify({ displayOrder: orderB })
        })
      ];

      const responses = await Promise.all(promises);
      for (const res of responses) {
        if (!res.ok) throw new Error('Failed to update display order rankings.');
      }

      setSuccess('Feeds custom order updated successfully!');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="collection-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Social Media Feed Manager</h1>
          <p className="page-subtitle">Embed influencer recommendations, Facebook posts, TikTok videos, and YouTube reviews natively.</p>
        </div>
        {!activeItem && (
          <button onClick={handleCreateNew} className="btn-primary">
            ➕ Register Influencer Post
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {activeItem ? (
        <div className="card-panel">
          <div className="form-header">
            <h2>{activeItem._isNew ? 'Register Social Post' : 'Modify Social Post details'}</h2>
            <button onClick={() => setActiveItem(null)} className="btn-secondary">
              &larr; Back to List
            </button>
          </div>

          <form onSubmit={handleSubmit} className="entry-form">
            <div className="form-row">
              <div className="form-group">
                <label>Platform *</label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleFormChange('platform', e.target.value)}
                  required
                >
                  <option value="">-- Choose Platform --</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div className="form-group">
                <label>Post URL *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    value={formData.postUrl}
                    onChange={(e) => handleFormChange('postUrl', e.target.value)}
                    placeholder="https://www.instagram.com/p/..."
                    required
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleFetchOembed}
                    disabled={fetchingOembed || !formData.postUrl || !formData.platform}
                    className="btn-primary"
                    style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
                  >
                    {fetchingOembed ? '⏳ Fetching…' : '🔍 Fetch Preview'}
                  </button>
                </div>
              </div>
            </div>

            {oembedError && <div className="alert alert-error" style={{ fontSize: 13, padding: '8px 12px' }}>⚠️ {oembedError}</div>}
            {oembedSuccess && <div className="alert alert-success" style={{ fontSize: 13, padding: '8px 12px' }}>✓ {oembedSuccess}</div>}

            {/* Live preview section */}
            {formData.embedHtml && (
              <div className="form-group">
                <label>Embed Code Preview</label>
                <div 
                  className="oembed-preview-box"
                  style={{
                    padding: 16,
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                    overflow: 'hidden'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.embedHtml }}
                />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Influencer Name (Optional)</label>
                <input
                  type="text"
                  value={formData.influencerName}
                  onChange={(e) => handleFormChange('influencerName', e.target.value)}
                  placeholder="e.g. Dr. John Doe"
                />
              </div>

              <div className="form-group">
                <label>Influencer Handle (Optional)</label>
                <input
                  type="text"
                  value={formData.influencerHandle}
                  onChange={(e) => handleFormChange('influencerHandle', e.target.value)}
                  placeholder="e.g. @drjohndoe"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Caption / Title (Optional)</label>
              <textarea
                rows={3}
                value={formData.caption}
                onChange={(e) => handleFormChange('caption', e.target.value)}
                placeholder="Write a custom description or caption overlay if desired"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thumbnail / Fallback Image Path (Optional)</label>
                {formData.thumbnailUrl && (
                  <div style={{ marginBottom: 10, position: 'relative', display: 'inline-block' }}>
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail Preview"
                      style={{ maxWidth: 220, maxHeight: 140, borderRadius: 8, border: '1px solid #e2e8f0', objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleFormChange('thumbnailUrl', '')}
                      style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 7px', cursor: 'pointer', fontSize: 12 }}
                    >✕ Remove</button>
                  </div>
                )}
                <label
                  htmlFor="thumbnail-upload"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '20px 16px', borderRadius: 8, cursor: uploadingThumbnail ? 'wait' : 'pointer',
                    border: '2px dashed #94a3b8', background: '#f8fafc', color: '#64748b',
                    fontSize: 14, transition: 'border-color 0.2s',
                  }}
                >
                  {uploadingThumbnail
                    ? <><span style={{ fontSize: 24 }}>⏳</span> Uploading…</>
                    : <><span style={{ fontSize: 28 }}>🖼️</span> {formData.thumbnailUrl ? 'Replace Thumbnail' : 'Click to Upload Fallback Image'}<br /><small style={{ opacity: 0.7 }}>JPG, PNG, WebP, GIF • max 10 MB</small></>}
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={uploadingThumbnail}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailUpload(file);
                    e.target.value = '';
                  }}
                />
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={e => handleFormChange('thumbnailUrl', e.target.value)}
                  placeholder="…or paste image URL directly"
                  style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label>Workflow Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="draft">DRAFT</option>
                    <option value="published">PUBLISHED</option>
                  </select>
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleFormChange('isFeatured', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <label htmlFor="isFeatured" style={{ cursor: 'pointer', fontWeight: 600 }}>Feature this post in main highlights</label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setActiveItem(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                💾 Save Social Post
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List view */
        <div className="card-panel">
          {loading ? (
            <div className="loading-state">Loading social feeds index...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No social media posts embedded yet. Click "Register Influencer Post" above!</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>Order</th>
                    <th>Platform</th>
                    <th>Thumbnail</th>
                    <th>Influencer Details</th>
                    <th>Caption / Link</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                          <button
                            onClick={() => handleMoveItem(idx, 'up')}
                            disabled={idx === 0}
                            style={{ background: 'transparent', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1, fontSize: 14 }}
                            title="Move Up"
                          >
                            🔼
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{idx + 1}</span>
                          <button
                            onClick={() => handleMoveItem(idx, 'down')}
                            disabled={idx === items.length - 1}
                            style={{ background: 'transparent', border: 'none', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === items.length - 1 ? 0.3 : 1, fontSize: 14 }}
                            title="Move Down"
                          >
                            🔽
                          </button>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 24, marginRight: 6 }}>
                          {item.platform === 'youtube' && '🔴'}
                          {item.platform === 'tiktok' && '🖤'}
                          {item.platform === 'instagram' && '📸'}
                          {item.platform === 'facebook' && '🔵'}
                        </span>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: 13 }}>{item.platform}</span>
                      </td>
                      <td>
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt="Preview Thumbnail"
                            style={{ width: 70, height: 45, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          />
                        ) : (
                          <div style={{ width: 70, height: 45, borderRadius: 6, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8', border: '1px solid #e2e8f0' }}>No Image</div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 14 }}>{item.influencerName || 'N/A'}</span>
                          <span style={{ fontSize: 12, color: '#00A8BC', fontWeight: 500 }}>{item.influencerHandle || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}>
                          {item.caption ? (
                            <span style={{ fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.caption}>
                              {item.caption}
                            </span>
                          ) : (
                            <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No custom caption</span>
                          )}
                          <a href={item.postUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#64748b', textDecoration: 'underline', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 2 }}>
                            {item.postUrl}
                          </a>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                        {item.isFeatured && (
                          <span style={{ display: 'block', fontSize: 9, color: '#00A8BC', fontWeight: 800, textTransform: 'uppercase', marginTop: 4 }}>★ Featured</span>
                        )}
                      </td>
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
