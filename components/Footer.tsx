import Link from 'next/link';
import Image from 'next/image';
import { navLinks, socials } from '@/lib/site';

const metaLink = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
} as const;

const columnHeading = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '0 0 16px',
} as const;

const legal = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  letterSpacing: 'var(--ls-wide)',
  color: 'var(--text-faint)',
  margin: 0,
} as const;

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(48px,7vh,72px) clamp(20px,5vw,64px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(60% 60% at 50% 120%, rgba(139,92,246,0.08) 0%, transparent 60%)',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
        <div className="rd-footer-grid" style={{ marginBottom: 44 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Image src="/logo.png" alt="paracausal" width={131} height={22} style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, maxWidth: '34ch', margin: 0 }}>
              Underground psychedelic experiences. Cape Town, South Africa. Existing at the edge of perception.
            </p>
          </div>

          <div>
            <p style={columnHeading}>Navigate</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={metaLink}>{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p style={columnHeading}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {socials.slice(0, 3).map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener" style={metaLink}>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: 28,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <p style={legal}>© 2026 Paracausal Collective · Cape Town</p>
          <p style={legal}>All experiences are at your own risk</p>
        </div>
      </div>
    </footer>
  );
}
