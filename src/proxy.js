import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const LOCALES = ['ta', 'en'];
const DEFAULT_LOCALE = 'ta';
const LOCALE_COOKIE = 'mst_locale';
const ADMIN_COOKIE = process.env.ADMIN_COOKIE_NAME || 'mst_admin_session';
const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_change_in_prod'
);

// ─── Admin Security Headers ─────────────────────────────────────────────────

function applyAdminSecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // needed for React dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  return response;
}

function generateCSRF() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 36; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ─── Admin Auth Guard ───────────────────────────────────────────────────────

async function handleAdminRoute(request) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin-portal/login';
  const isAdminApiAuth = pathname.startsWith('/api/admin/auth/');

  // ── CSRF Check for State-Changing API Mutations ───────────────────────────
  const method = request.method;
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  const isApi = pathname.startsWith('/api/admin/');

  if (isApi && isMutation && pathname !== '/api/admin/auth/login') {
    const csrfCookie = request.cookies.get('mst_csrf')?.value;
    const csrfHeader = request.headers.get('x-csrf-token');

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'CSRF token mismatch or missing' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Login page and auth API routes are public within the portal
  if (isLoginPage || isAdminApiAuth) {
    const response = NextResponse.next();
    applyAdminSecurityHeaders(response);
    // Ensure CSRF token cookie is set
    if (!request.cookies.has('mst_csrf')) {
      response.cookies.set('mst_csrf', generateCSRF(), { path: '/', sameSite: 'lax' });
    }
    return response;
  }

  // All other /admin-portal/** routes require a valid access token
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL('/admin-portal/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    if (!request.cookies.has('mst_csrf')) {
      response.cookies.set('mst_csrf', generateCSRF(), { path: '/', sameSite: 'lax' });
    }
    return response;
  }

  try {
    await jwtVerify(token, ACCESS_SECRET);
    const response = NextResponse.next();
    applyAdminSecurityHeaders(response);
    if (!request.cookies.has('mst_csrf')) {
      response.cookies.set('mst_csrf', generateCSRF(), { path: '/', sameSite: 'lax' });
    }
    return response;
  } catch {
    // Token invalid or expired — redirect to login
    const loginUrl = new URL('/admin-portal/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('reason', 'session_expired');
    const response = NextResponse.redirect(loginUrl);
    // Clear stale cookie
    response.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' });
    if (!request.cookies.has('mst_csrf')) {
      response.cookies.set('mst_csrf', generateCSRF(), { path: '/', sameSite: 'lax' });
    }
    return response;
  }
}

// ─── Public Site Locale Routing ─────────────────────────────────────────────

function handlePublicRoute(request) {
  const { pathname } = request.nextUrl;

  const isEnglish = pathname.startsWith('/en/') || pathname === '/en';
  const locale = isEnglish ? 'en' : DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  if (isEnglish) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return response;
  }

  if (pathname.startsWith('/ta/') || pathname === '/ta') {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, 'ta', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return response;
  }

  const internalPath = '/ta' + (pathname === '/' ? '' : pathname);
  const rewriteUrl = new URL(internalPath, request.url);
  rewriteUrl.search = request.nextUrl.search;

  const response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, 'ta', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return response;
}

// ─── Main Proxy ─────────────────────────────────────────────────────────────

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Route admin portal requests through the auth guard
  if (pathname.startsWith('/admin-portal') || pathname.startsWith('/api/admin/')) {
    return handleAdminRoute(request);
  }

  return handlePublicRoute(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js|map)$).*)',
  ],
};
