'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';

export default function LinkInterceptor() {
  const { show } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const targetEl = (e.target as HTMLElement).closest('a');
      if (
        !targetEl ||
        targetEl.target === '_blank' ||
        targetEl.hasAttribute('data-no-loader') ||
        !targetEl.href.startsWith(window.location.origin)
      ) {
        return; // external, new-tab, or opted-out link
      }

      // Compute paths+hashes
      const current = window.location.pathname + window.location.hash;
      const href    = new URL(targetEl.getAttribute('href')!, window.location.origin);
      const target  = href.pathname + href.hash;

      // 👉 If clicking to the exact same route+hash, do nothing:
      if (target === current) return;

      // Otherwise intercept, show loader, then navigate
      e.preventDefault();
      show();
      router.push(href.pathname + href.search + href.hash);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router, show]);

  return null;
}
