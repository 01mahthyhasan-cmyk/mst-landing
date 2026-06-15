'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * HtmlContent – Client Component wrapper for raw HTML template strings.
 *
 * Marking this as 'use client' ensures React never attempts a server→client
 * hydration diff on the raw HTML, completely eliminating the hydration mismatch
 * warnings that occur when dangerouslySetInnerHTML is used inside a Server
 * Component on Windows (CRLF vs LF, browser-extension mutations, etc.)
 */
export default function HtmlContent({ html }) {
  const pathname = usePathname();
  const [processedHtml, setProcessedHtml] = useState(html);

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

  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
