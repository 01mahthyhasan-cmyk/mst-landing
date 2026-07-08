import { getAdminSession } from './auth.js';
import { requirePermission } from './permissions.js';
import { getClientIP } from './auditLog.js';

/**
 * Standard admin API helper.
 * Verifies the session JWT and checks RBAC permission in one call.
 *
 * Usage inside a route handler:
 *   const { session, ip, error } = await adminGuard(request, 'publish');
 *   if (error) return error;
 *
 * @param {Request} request
 * @param {string} action - Permission to check (read|write|publish|delete|manage_users|...)
 * @returns {{ session, ip, error?: Response }}
 */
export async function adminGuard(request, action) {
  const session = await getAdminSession();
  const ip = getClientIP(request);

  const check = requirePermission(session, action);
  if (!check.ok) {
    return {
      session: null,
      ip,
      error: Response.json(
        { success: false, message: check.message },
        { status: check.status }
      ),
    };
  }

  return { session, ip, error: null };
}

/**
 * Standard success response shape.
 */
export function apiOk(data, status = 200) {
  return Response.json({ success: true, ...data }, { status });
}

/**
 * Standard error response shape.
 */
export function apiError(message, status = 400, details = null) {
  return Response.json(
    { success: false, message, ...(details ? { details } : {}) },
    { status }
  );
}

/**
 * Parse and validate JSON body, returning apiError on failure.
 */
export async function parseBody(request) {
  try {
    return { body: await request.json(), error: null };
  } catch {
    return { body: null, error: apiError('Invalid JSON body', 400) };
  }
}
