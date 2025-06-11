'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';

export default function LinkInterceptor() {
  const { show } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor &&
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.hasAttribute('data-no-loader') &&
        !anchor.target // skip external/tab links
      ) {
        // Prevent default behavior
        e.preventDefault();

        // Show loader
        show();

        // Let router navigate after a short delay (smooth animation)
        setTimeout(() => {
          router.push(anchor.pathname + anchor.search + anchor.hash);
        }, 100); // optional delay
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router, show]);

  return null;
}
