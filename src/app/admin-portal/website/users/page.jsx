'use client';

import { useState, useEffect } from 'react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states for creating a new user
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('content_editor');
  const [password, setPassword] = useState('');

  // Form states for editing a user
  const [editingUser, setEditingUser] = useState(null);

  // Helper to read CSRF token
  const getCsrfToken = () => {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/mst_csrf=([^;]+)/);
    return match ? match[1] : '';
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify({ name, email, role, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create user');

      setSuccess('User created successfully!');
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setRole('content_editor');
      setPassword('');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken()
        },
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');

      setSuccess('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForceLogout = async (userId) => {
    if (!confirm('Are you sure you want to force log out this user? All active sessions will be terminated.')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${userId}/logout`, {
        method: 'POST',
        headers: {
          'x-csrf-token': getCsrfToken()
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to force log out user');

      setSuccess('User session terminated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset2FA = async (userId) => {
    if (!confirm('Are you sure you want to reset 2FA for this user? This will disable 2FA and clear their secret.')) return;
    handleUpdateUser(userId, { twoFactorEnabled: false });
  };

  return (
    <div className="users-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Configure portal administrators, roles, security policies, and 2FA resets.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          ➕ Create / Invite Admin
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-state">Loading user index...</div>
      ) : (
        <div className="card-panel">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>2FA Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-name-cell">
                        <span className="avatar-small">{u.name?.charAt(0).toUpperCase()}</span>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role?.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.status}`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td>
                      {u.twoFactorEnabled ? (
                        <span className="badge-2fa enabled">🔒 Enabled</span>
                      ) : (
                        <span className="badge-2fa disabled">🔓 Disabled</span>
                      )}
                    </td>
                    <td>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button onClick={() => setEditingUser(u)} className="btn-edit">
                          ✏️ Edit
                        </button>
                        {u.twoFactorEnabled && (
                          <button onClick={() => handleReset2FA(u._id)} className="btn-reset-2fa">
                            🔑 Reset 2FA
                          </button>
                        )}
                        <button onClick={() => handleForceLogout(u._id)} className="btn-force-logout">
                          ⚡ Force Out
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Invite New Administrator</h2>
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@msthealthcare.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Access Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="content_editor">Content Editor (Drafts Only)</option>
                  <option value="content_admin">Content Admin (Full CMS Edit)</option>
                  <option value="super_admin">Super Admin (Global System Access)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Temporary Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Must contain Upper, Lower, Number, Special"
                  required
                />
                <small className="help-text">Password requires at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.</small>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Edit Access Profile</h2>
            <p className="modal-user-label">{editingUser.email}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const roleVal = form.role.value;
                const statusVal = form.status.value;
                handleUpdateUser(editingUser._id, { role: roleVal, status: statusVal });
              }}
              className="modal-form"
            >
              <div className="form-group">
                <label>Access Role</label>
                <select name="role" defaultValue={editingUser.role}>
                  <option value="content_editor">Content Editor (Drafts Only)</option>
                  <option value="content_admin">Content Admin (Full CMS Edit)</option>
                  <option value="super_admin">Super Admin (Global System Access)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Status</label>
                <select name="status" defaultValue={editingUser.status || 'active'}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended / Deactivated</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingUser(null)} className="btn-secondary">
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
        .users-container {
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
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #64748B;
        }
        .user-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #E2E8F0;
          color: #475569;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          font-size: 13px;
        }
        .role-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .role-badge.super_admin {
          background-color: #E0F2FE;
          color: #0369A1;
        }
        .role-badge.content_admin {
          background-color: #F0FDF4;
          color: #166534;
        }
        .role-badge.content_editor {
          background-color: #F1F5F9;
          color: #475569;
        }
        .badge-2fa {
          font-size: 12px;
          font-weight: 600;
        }
        .badge-2fa.enabled {
          color: #16A34A;
        }
        .badge-2fa.disabled {
          color: #94A3B8;
        }
        .actions-cell {
          display: flex;
          gap: 8px;
        }
        .btn-edit, .btn-reset-2fa, .btn-force-logout {
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
        .btn-reset-2fa {
          color: #D97706;
        }
        .btn-reset-2fa:hover {
          background-color: #FFFBEB;
        }
        .btn-force-logout {
          color: #EF4444;
        }
        .btn-force-logout:hover {
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
          font-size: 14px;
          color: #64748B;
          margin-bottom: 20px;
        }
        .modal-form {
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
        .form-group input, .form-group select {
          padding: 10px 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background-color: #ffffff;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #00A8BC;
          box-shadow: 0 0 0 2px rgba(0, 168, 188, 0.2);
        }
        .help-text {
          font-size: 11px;
          color: #64748B;
          line-height: 1.4;
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
