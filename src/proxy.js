import { NextResponse } from 'next/server';

const LOCALES = ['ta', 'en'];
const DEFAULT_LOCALE = 'ta';
const LOCALE_COOKIE = 'mst_locale';

/**
 * Next.js 16 Proxy (formerly middleware).
 *
 * Routing strategy:
 *   - /en/*  → English  (locale = 'en', URL unchanged)
 *   - /*     → Tamil    (locale = 'ta', URL unchanged, internally rewritten to /ta/*)
 *
 * The `x-locale` request header is set so the root layout can apply
 * lang="" and the Noto Sans Tamil font without knowing [lang] params.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Detect locale from URL path ──────────────────────────────────────────
  const isEnglish =
    pathname.startsWith('/en/') || pathname === '/en';

  const locale = isEnglish ? 'en' : DEFAULT_LOCALE;

  // ── Build modified request headers (locale hint for root layout) ──────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  // ── English path: just pass through with header attached ─────────────────
  if (isEnglish) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.cookies.set(LOCALE_COOKIE, 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // ── Tamil path (already prefixed): pass through to avoid rewrite loop ────
  if (pathname.startsWith('/ta/') || pathname === '/ta') {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.cookies.set(LOCALE_COOKIE, 'ta', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // ── Tamil path: rewrite internally to /ta/* so [lang] param = 'ta' ───────
  const internalPath = '/ta' + (pathname === '/' ? '' : pathname);
  const rewriteUrl = new URL(internalPath, request.url);
  // Preserve query string
  rewriteUrl.search = request.nextUrl.search;

  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  response.cookies.set(LOCALE_COOKIE, 'ta', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Run proxy on all paths EXCEPT:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - api           (API routes)
     * - public files with extensions (images, css, js, fonts, icons…)
     */
    '/((?!_next/static|_next/image|api|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js|map)$).*)',
  ],
};
