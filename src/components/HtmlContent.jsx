'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

/**
 * HtmlContent – Client Component wrapper for raw HTML template strings.
 *
 * Marking this as 'use client' ensures React never attempts a server→client
 * hydration diff on the raw HTML, completely eliminating the hydration mismatch
 * warnings that occur when dangerouslySetInnerHTML is used inside a Server
 * Component on Windows (CRLF vs LF, browser-extension mutations, etc.)
 *
 * Also intercepts clicks on internal <a> tags and routes them through
 * Next.js router for proper SPA navigation (no full-page reloads).
 */
export default function HtmlContent({ html }) {
  const pathname = usePathname();
  const router = useRouter();
  const [processedHtml, setProcessedHtml] = useState(html);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname;
      // Extract the basePath by removing the page pathname from the end
      let basePath = '';
      if (fullPath.endsWith(pathname)) {
        basePath = fullPath.substring(0, fullPath.length - pathname.length);
      } else if (fullPath.endsWith(pathname + '/')) {
        basePath = fullPath.substring(0, fullPath.length - (pathname.length + 1));
      }

      // Normalize basePath (remove trailing slash if any)
      if (basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
      }

      if (basePath) {
        // Replace all href="/..." with href="basePath/..."
        const rewritten = html
          .replace(/href="\/([^"]*)"/g, (match, p1) => {
            if (p1.startsWith('http') || p1.startsWith('mailto:') || p1.startsWith('tel:')) {
              return match;
            }
            return `href="${basePath}/${p1}"`;
          })
          .replace(/href='\/([^']*)'/g, (match, p1) => {
            if (p1.startsWith('http') || p1.startsWith('mailto:') || p1.startsWith('tel:')) {
              return match;
            }
            return `href='${basePath}/${p1}'`;
          });
        setProcessedHtml(rewritten);
      } else {
        setProcessedHtml(html);
      }
    }
  }, [html, pathname]);

  // Intercept clicks on internal anchor tags and use Next.js router
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip external links, mailto, tel, hash-only, and popup-video links
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href === '#' ||
        anchor.classList.contains('popup-video') ||
        anchor.hasAttribute('target')
      ) {
        return;
      }

      // It's an internal link — handle with Next.js router
      e.preventDefault();
      router.push(href);
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [router, processedHtml]);

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
