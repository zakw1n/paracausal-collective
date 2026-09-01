import Image from 'next/image';
import Tag from '@/components/ds/Tag';
import { eventsForArtist, type Artist } from '@/lib/site';

const meta = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

const linkStyle = {
  ...meta,
  fontSize: 'var(--fs-3xs)',
  color: 'var(--pc-cyan)',
  textDecoration: 'none',
  border: '1px solid color-mix(in oklab, var(--pc-cyan) 40%, transparent)',
  borderRadius: 'var(--r-pill)',
  padding: '3px 9px',
  lineHeight: 1,
} as const;

/** Initials for the no-photo fallback: 'Dark Sun' -> 'DS', 'Voidwalker' -> 'VO'. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Roster card for an artist who has played a Paracausal night.
 * Photo-led; falls back to an initials tile over the aura gradient when no
 * press shot has been sourced yet, so the grid never renders broken images.
 */
export default function ArtistCard({ artist }: { artist: Artist }) {
  const played = eventsForArtist(artist);
  const links = Object.entries(artist.links ?? {}).filter(([, href]) => Boolean(href));

  return (
    <div
      className="rd-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--r-lg)',
        background: 'var(--surface-raised, #10131C)',
        boxShadow: 'var(--glow-soft)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4 / 5', background: '#000' }}>
        {artist.photo ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            sizes="(max-width: 860px) 50vw, 240px"
            style={{ objectFit: 'cover', opacity: 0.78 }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--pc-grad-aura)',
              opacity: 0.14,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-techno)',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem,6vw,4rem)',
                color: 'var(--pc-white)',
                letterSpacing: 'var(--ls-wide)',
              }}
            >
              {initials(artist.name)}
            </span>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(5,6,10,0) 40%, rgba(5,6,10,0.92) 100%)',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 18 }}>
        <h3
          style={{
            fontFamily: 'var(--font-techno)',
            fontWeight: 700,
            fontSize: 'clamp(1.05rem,2vw,1.35rem)',
            color: '#fff',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {artist.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Tag color="violet" variant="outline" size="sm">{artist.genre}</Tag>
          {artist.location && <span style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)' }}>{artist.location}</span>}
        </div>

        {played.length > 0 && (
          <p style={{ ...meta, fontSize: 'var(--fs-3xs)', color: 'var(--text-faint)', margin: 0, lineHeight: 1.6 }}>
            {played.map((event) => event.title).join(' · ')}
          </p>
        )}

        {links.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            {links.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                {label === 'ra' ? 'RA' : label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
