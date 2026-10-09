import Image from 'next/image';
import { byline, site } from '@/lib/site';

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

      <div style={{ position: 'relative' }}>
        <div style={{ marginBottom: 44 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Image src="/logo.png" alt={site.name} width={131} height={22} style={{ height: 22, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, maxWidth: '34ch', margin: 0 }}>
              {site.blurb}
            </p>
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
          <p style={legal}>{`© ${new Date().getFullYear()} ${byline}`}</p>
          <p style={legal}>All experiences are at your own risk</p>
        </div>
      </div>
    </footer>
  );
}
