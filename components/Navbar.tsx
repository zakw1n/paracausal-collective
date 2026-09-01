'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from '@/components/ds/Button';
import { TICKETS_URL, navLinks } from '@/lib/site';

const linkStyle = {
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  textDecoration: 'none',
} as const;

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const colorFor = (href: string) =>
    pathname === href ? 'var(--pc-cyan)' : 'rgba(198,204,218,0.7)';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          height: 72,
          padding: '0 clamp(20px,4vw,48px)',
          background: '#000',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="paracausal" width={155} height={26} priority style={{ height: 26, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ ...linkStyle, color: colorFor(link.href) }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <Button size="sm" variant="primary">Tickets</Button>
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="nav-burger"
          aria-label="Menu"
          aria-expanded={menuOpen}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--r-sm)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: '#08090D',
            padding: '96px 32px 40px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              width: 40,
              height: 40,
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--r-sm)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-widest)', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Explore
          </p>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-techno)',
                fontWeight: 700,
                fontSize: 32,
                color: '#fff',
                textTransform: 'uppercase',
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </Link>
          ))}

          <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ marginTop: 28, textDecoration: 'none' }}>
            <Button size="lg" variant="primary" block>Get tickets</Button>
          </a>
        </div>
      )}
    </>
  );
}
