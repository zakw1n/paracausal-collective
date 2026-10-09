'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TICKETS_URL, navLinks, upcomingEvent } from '@/lib/site';

/** Section links stay lit on their child routes, e.g. Events on /events/[id]. */
const isActive = (pathname: string | null, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || !!pathname?.startsWith(`${href}/`);

/**
 * Site navigation: a two-line burger floating in the top right corner at every
 * width, opening a full-screen menu. Nothing else is fixed to the page, so no
 * content has to be inset for it. Styles are in globals.css under `.pc-nav`.
 *
 * The menu stays mounted while closed so it can fade both ways; `inert` keeps
 * its links out of the tab order and away from screen readers until it opens.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav className={`pc-nav${open ? ' pc-nav--open' : ''}`} aria-label="Site">
      <button
        type="button"
        className="pc-nav-burger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="pc-nav-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>

      <div id="pc-nav-menu" className="pc-nav-menu" inert={!open}>
        <div className="pc-nav-list">
          {navLinks.map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`pc-nav-item${active ? ' pc-nav-item--active' : ''}`}
                aria-current={active ? 'page' : undefined}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : undefined }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {upcomingEvent && (
          <a href={TICKETS_URL} target="_blank" rel="noopener" className="pc-nav-foot" onClick={() => setOpen(false)}>
            Get tickets <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </nav>
  );
}
