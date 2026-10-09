'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Hides the shared navbar, footer and grain on routes that supply their own
 * chrome.
 *
 * `/experience` is a scroll-driven page whose grammar requires its own bar and
 * an abrupt close: a global footer dropped after its final cut would turn the
 * ending into a trailing-off, which is exactly what that page is built not to
 * do. The root layout is a server component and cannot read the pathname, so
 * the decision lives here.
 */
const OWN_CHROME = ['/experience'];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const suppressed = OWN_CHROME.some((route) => pathname === route || pathname?.startsWith(`${route}/`));

  return suppressed ? null : <>{children}</>;
}
