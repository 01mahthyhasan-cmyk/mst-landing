'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScriptsLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.jQuery) {
        const $ = window.jQuery;
        
        // 1. Clear previous SlickNav menus to prevent duplication
        $('.responsive-menu').empty();
        
        // 2. Clean up GSAP ScrollTriggers to avoid overlaps/memory leaks
        if (window.ScrollTrigger) {
          window.ScrollTrigger.getAll().forEach(t => t.kill());
        }
        
        // 3. Re-initialize all jquery plugins/initializers
        if (typeof window.initTemplate === 'function') {
          window.initTemplate();
        }
      }
    };

    // Delay initialization slightly to let Next.js finish DOM updates
    const timer = setTimeout(handleRouteChange, 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
