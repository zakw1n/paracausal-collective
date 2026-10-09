'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PLACEHOLDER_IMAGE, TICKETS_URL, navLinks, site, upcomingEvent } from '@/lib/site';

/** One line icon, drawn to fill its 24px box edge to edge so it carries the
    same visual weight as the app icons the nav is modelled on. Colour and
    stroke weight come from CSS so the active
    link can thicken its icon without a second set of paths. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="pc-nav-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Keyed by href so the set of links stays owned by `navLinks` in lib/site.ts. */
const icons: Record<(typeof navLinks)[number]['href'], ReactNode> = {
  '/': (
    <Icon>
      <path d="M2.5 10 12 2.5l9.5 7.5v11a1 1 0 0 1-1 1H15v-6.5H9V22H3.5a1 1 0 0 1-1-1z" />
    </Icon>
  ),
  '/events': (
    <Icon>
      <rect x="2.5" y="4" width="19" height="18" rx="3" />
      <path d="M2.5 9.5h19M7.5 2v4M16.5 2v4" />
    </Icon>
  ),
  '/artists': (
    <Icon>
      <path d="M3.5 15v-3a8.5 8.5 0 0 1 17 0v3" />
      <rect x="2" y="14" width="5.5" height="8" rx="2" />
      <rect x="16.5" y="14" width="5.5" height="8" rx="2" />
    </Icon>
  ),
  '/gallery': (
    <Icon>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
      <path d="M8.8 2.5v19M15.2 2.5v19M2.5 8.8h19M2.5 15.2h19" />
    </Icon>
  ),
  '/about': (
    <Icon>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 11v6.5M12 7v.01" />
    </Icon>
  ),
  '/contact': (
    <Icon>
      <rect x="2" y="4.5" width="20" height="15" rx="3" />
      <path d="m2.5 7 9.5 6.5L21.5 7" />
    </Icon>
  ),
};

const ticketIcon = (
  <Icon>
    <path d="M2 9V6a1.5 1.5 0 0 1 1.5-1.5h17A1.5 1.5 0 0 1 22 6v3a3 3 0 0 0 0 6v3a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18v-3a3 3 0 0 0 0-6z" />
    <path d="M14.5 4.5v2.5M14.5 10.75v2.5M14.5 17v2.5" />
  </Icon>
);

/** Section links stay lit on their child routes, e.g. Events on /events/[id]. */
const isActive = (pathname: string | null, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || !!pathname?.startsWith(`${href}/`);

/**
 * Site navigation, laid out like an app's: a bar of icons fixed to the foot of
 * the screen on a phone, and from 768px a rail down the left edge that widens
 * on hover to show each icon's label. All of the layout — including the insets
 * that keep page content out from under it — is in globals.css under `.pc-nav`.
 */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="pc-nav" aria-label="Site">
      <Link href="/" className="pc-nav-brand" aria-label={`${site.name} home`}>
        <Image src={PLACEHOLDER_IMAGE} alt="" width={24} height={24} style={{ borderRadius: '50%', flexShrink: 0 }} />
      </Link>

      <div className="pc-nav-list">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`pc-nav-item${active ? ' pc-nav-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              /* The label is hidden on the phone bar and clipped on the
                 collapsed rail, so the name is carried here instead. */
              aria-label={link.label}
            >
              {icons[link.href]}
              <span className="pc-nav-label">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {upcomingEvent && (
        <a href={TICKETS_URL} target="_blank" rel="noopener" className="pc-nav-item pc-nav-foot" aria-label="Tickets">
          {ticketIcon}
          <span className="pc-nav-label">Tickets</span>
        </a>
      )}
    </nav>
  );
}
