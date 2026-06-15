'use client';

/**
 * HtmlContent – Client Component wrapper for raw HTML template strings.
 *
 * Marking this as 'use client' ensures React never attempts a server→client
 * hydration diff on the raw HTML, completely eliminating the hydration mismatch
 * warnings that occur when dangerouslySetInnerHTML is used inside a Server
 * Component on Windows (CRLF vs LF, browser-extension mutations, etc.)
 */
export default function HtmlContent({ html }) {
  return (
    <div
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
