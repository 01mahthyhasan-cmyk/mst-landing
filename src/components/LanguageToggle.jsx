'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

const LOCALE_COOKIE = 'mst_locale';

/**
 * LanguageToggle — fixed pill-style switcher matching the site's CSS theme.
 *
 * On switch: performs a FULL page reload via window.location.href so the
 * Next.js middleware (proxy.js) runs on the server and correctly handles
 * locale routing / cookie setting. Client-side router.push() bypasses
 * middleware, which is why the language only applied after a manual refresh.
 */
export default function LanguageToggle({ currentLocale }) {
  const pathname = usePathname();

  const switchLocale = useCallback(
    (targetLocale) => {
      if (targetLocale === currentLocale) return;

      // Strip any leading locale segment (/ta or /en) to get the canonical path.
      const canonicalPath = pathname.replace(/^\/(ta|en)(?=\/|$)/, '') || '/';

      let nextPath;
      if (targetLocale === 'en') {
        // Tamil → English: navigate to /en/<canonical>
        nextPath = '/en' + (canonicalPath === '/' ? '' : canonicalPath);
      } else {
        // English → Tamil: navigate to canonical path — middleware rewrites to /ta/*
        nextPath = canonicalPath;
      }

      // Set cookie eagerly so the middleware receives it immediately
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${LOCALE_COOKIE}=${targetLocale};path=/;max-age=${maxAge};samesite=lax`;

      // Full page reload — this goes through the server middleware (proxy.js)
      // which handles locale rewrites correctly. router.push() is client-side
      // only and bypasses middleware, so the language never updated without a refresh.
      window.location.href = nextPath;
    },
    [currentLocale, pathname]
  );

  const isTamil = currentLocale === 'ta';

  return (
    <>
      <style>{`
        .lang-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          align-items: center;
          background: var(--primary-color);
          border-radius: 30px;
          padding: 4px;
          gap: 2px;
          box-shadow: 0 4px 16px rgba(8, 54, 59, 0.25);
          transition: box-shadow 0.2s ease;
        }

        .lang-toggle:hover {
          box-shadow: 0 6px 20px rgba(8, 54, 59, 0.35);
        }

        .lang-toggle__btn {
          font-family: var(--default-font);
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          border: none;
          cursor: pointer;
          border-radius: 24px;
          padding: 8px 14px;
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .lang-toggle__btn:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .lang-toggle__btn--active {
          background: var(--accent-color);
          color: #ffffff;
          transform: scale(1.02);
        }

        .lang-toggle__btn--active:hover {
          color: #ffffff;
        }

        .lang-toggle__divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        /* Mobile: slightly smaller */
        @media (max-width: 576px) {
          .lang-toggle {
            top: 14px;
            right: 14px;
          }

          .lang-toggle__btn {
            font-size: 12px;
            padding: 7px 11px;
          }
        }
      `}</style>

      <div className="lang-toggle" role="group" aria-label="Language switcher">
        <button
          className={`lang-toggle__btn${isTamil ? ' lang-toggle__btn--active' : ''}`}
          onClick={() => switchLocale('ta')}
          aria-pressed={isTamil}
          aria-label="Switch to Tamil"
          lang="ta"
        >
          தமிழ்
        </button>

        <span className="lang-toggle__divider" aria-hidden="true" />

        <button
          className={`lang-toggle__btn${!isTamil ? ' lang-toggle__btn--active' : ''}`}
          onClick={() => switchLocale('en')}
          aria-pressed={!isTamil}
          aria-label="Switch to English"
          lang="en"
        >
          EN
        </button>
      </div>
    </>
  );
}
