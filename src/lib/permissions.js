/**
 * RBAC Permission Matrix
 *
 * Roles: super_admin | content_admin | content_editor
 *
 * Actions: read | write | publish | delete | manage_users | manage_settings
 *
 * Design: permission check is data-driven, not if/else per role,
 * so adding a new role or action is a one-line matrix change.
 */

const PERMISSION_MATRIX = {
  super_admin: {
    read: true,
    write: true,
    publish: true,
    delete: true,
    manage_users: true,
    manage_settings: true,
    view_audit_logs: true,
    manage_media: true,
    view_submissions: true,
  },
  content_admin: {
    read: true,
    write: true,
    publish: true,
    delete: true,
    manage_users: false,
    manage_settings: false,
    view_audit_logs: false,
    manage_media: true,
    view_submissions: true,
  },
  content_editor: {
    read: true,
    write: true,
    publish: false,
    delete: false,
    manage_users: false,
    manage_settings: false,
    view_audit_logs: false,
    manage_media: true,
    view_submissions: false,
  },
};

export const ROLES = Object.keys(PERMISSION_MATRIX);

/**
 * Check if a role has a specific permission.
 * @param {string} role
 * @param {string} action
 * @returns {boolean}
 */
export function hasPermission(role, action) {
  if (!role || !action) return false;
  const perms = PERMISSION_MATRIX[role];
  if (!perms) return false;
  return perms[action] === true;
}

/**
 * Middleware-style guard for API route handlers.
 * Returns { ok: true, session } or { ok: false, status, message }
 */
export function requirePermission(session, action) {
  if (!session) {
    return { ok: false, status: 401, message: 'Unauthenticated' };
  }
  if (!hasPermission(session.role, action)) {
    return {
      ok: false,
      status: 403,
      message: `Role '${session.role}' lacks '${action}' permission`,
    };
  }
  return { ok: true, session };
}

export { PERMISSION_MATRIX };
