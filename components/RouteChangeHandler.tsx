'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoader } from '@/context/LoaderContext';

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const { hide } = useLoader();

  useEffect(() => {
    // This runs every time the route changes (i.e., new page is fully loaded)
    hide();
  }, [pathname]);

  return null;
}
