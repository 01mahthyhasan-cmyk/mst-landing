'use client';

import { useState, useEffect } from 'react';

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  // Upload Form states
  const [file, setFile] = useState(null);
  const [altEn, setAltEn] = useState('');
  const [altTa, setAltTa] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Edit altText modal states
  const [editingItem, setEditingItem] = useState(null);
  const [editAltEn, setEditAltEn] = useState('');
  const [editAltTa, setEditAltTa] = useState('');
  const [editTags, setEditTags] = useState('');

  // Helper to read CSRF token
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/media?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (tagFilter) url += `tag=${encodeURIComponent(tagFilter)}&`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      setMediaItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [search, tagFilter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText_en', altEn);
    formData.append('altText_ta', altTa);
    formData.append('tags', tagsInput);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken()
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setSuccess('Media file uploaded successfully!');
      setFile(null);
      setAltEn('');
      setAltTa('');
      setTagsInput('');
      fetchMedia();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to permanently delete this media file?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/media/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-csrf-token': getCsrfToken()
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete media');

      setSuccess('Media deleted successfully!');
      fetchMedia();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditAltEn(item.altText?.en || '');
    setEditAltTa(item.altText?.ta || '');
    setEditTags(item.tags?.join(', ') || '');
  };

  const handleSaveAltText = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/media/${editingItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({
          altText: { en: editAltEn, ta: editAltTa },
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update alt text');

      setSuccess('Alt text updated successfully!');
      setEditingItem(null);
      fetchMedia();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="media-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Upload, preview, tag, and inspect file references across pages and custom collections.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="media-layout">
        {/* Upload Panel */}
        <div className="upload-panel card-panel">
          <h2 className="panel-title">Upload New File</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Select File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <div className="form-group">
              <label>Alt Text (English)</label>
              <input
                type="text"
                value={altEn}
                onChange={(e) => setAltEn(e.target.value)}
                placeholder="Description of the image..."
              />
            </div>
            <div className="form-group">
              <label>Alt Text (Tamil)</label>
              <input
                type="text"
                value={altTa}
                onChange={(e) => setAltTa(e.target.value)}
                placeholder="படத்தின் விளக்கம்..."
              />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. hero, logo, gallery"
              />
            </div>
            <button type="submit" disabled={uploading} className="btn-primary">
              {uploading ? 'Uploading...' : '⬆️ Start Upload'}
            </button>
          </form>
        </div>

        {/* Media Browser Panel */}
        <div className="browser-panel card-panel">
          <div className="browser-header">
            <h2 className="panel-title">Library Assets</h2>
            <div className="search-controls">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="search-input"
              />
              <input
                type="text"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="Filter by tag..."
                className="search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading media grid...</div>
          ) : mediaItems.length === 0 ? (
            <div className="empty-state">No media items found in this query.</div>
          ) : (
            <div className="media-grid">
              {mediaItems.map((item) => (
                <div key={item._id} className="media-card">
                  <div className="media-preview-container">
                    <img src={item.url} alt={item.altText?.en || ''} className="media-img" />
                  </div>
                  <div className="media-details">
                    <span className="media-filename" title={item.originalName}>
                      {item.originalName}
                    </span>
                    <span className="media-meta-info">
                      {item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : ''} | {item.mimeType?.split('/')[1]?.toUpperCase()}
                    </span>
                    <div className="media-tags-list">
                      {item.tags?.map(t => (
                        <span key={t} className="media-tag-badge">{t}</span>
                      ))}
                    </div>
                    <div className="media-card-actions">
                      <button onClick={() => openEditModal(item)} className="btn-card-edit">
                        📝 Edit Alt/Tags
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="btn-card-delete">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Alt/Tags Modal */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Edit Media Metadata</h2>
            <p className="modal-user-label">{editingItem.originalName}</p>
            <form onSubmit={handleSaveAltText} className="modal-form">
              <div className="form-group">
                <label>Alt Text (English)</label>
                <input
                  type="text"
                  value={editAltEn}
                  onChange={(e) => setEditAltEn(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Alt Text (Tamil)</label>
                <input
                  type="text"
                  value={editAltTa}
                  onChange={(e) => setEditAltTa(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .media-container {
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
        .media-layout {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 30px;
          align-items: start;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
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
        .form-group input {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
        }
        .form-group input:focus {
          outline: none;
          border-color: #00A8BC;
        }
        .browser-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .search-controls {
          display: flex;
          gap: 12px;
        }
        .search-input {
          padding: 8px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 13px;
          width: 180px;
        }
        .search-input:focus {
          outline: none;
          border-color: #00A8BC;
        }
        .loading-state, .empty-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .media-card {
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s;
        }
        .media-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .media-preview-container {
          height: 140px;
          background-color: #F8FAFC;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid #E2E8F0;
        }
        .media-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        .media-details {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }
        .media-filename {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .media-meta-info {
          font-size: 11px;
          color: #64748B;
        }
        .media-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
          flex-grow: 1;
        }
        .media-tag-badge {
          background-color: #F1F5F9;
          color: #475569;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .media-card-actions {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #F1F5F9;
          padding-top: 8px;
          margin-top: 8px;
        }
        .btn-card-edit, .btn-card-delete {
          background: transparent;
          border: none;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
        }
        .btn-card-edit {
          color: #00A8BC;
        }
        .btn-card-edit:hover {
          background-color: #EDF9FC;
        }
        .btn-card-delete {
          color: #EF4444;
        }
        .btn-card-delete:hover {
          background-color: #FEE2E2;
        }
        
        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 32px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .modal-content h2 {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 8px;
        }
        .modal-user-label {
          font-size: 13px;
          color: #64748B;
          margin-bottom: 20px;
          word-break: break-all;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
}
