'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebsiteDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin-portal/website/pages');
  }, [router]);

  return null;
}
