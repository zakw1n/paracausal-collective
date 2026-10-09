import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/components/ds/Tag';
import { artistsForEvent, type SiteEvent } from '@/lib/site';

const meta = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

const title = {
  fontFamily: 'var(--font-techno)',
  fontStretch: '125%',
  fontWeight: 700,
  color: '#fff',
  textTransform: 'uppercase',
} as const;

/**
 * Archive tile for a night.
 *
 * Tiles are 3:1 to match the banner artwork — anything squarer crops the sides off.
 *
 * `compact` is the 3-up home preview: art dimmed under a permanent gradient with
 * the caption always visible. The full variant used on /events leaves the artwork
 * undimmed and reveals its caption on hover (see .rd-veil / .rd-caption in
 * globals.css, which pin open on touch devices).
 *
 * `seamless` drops the frame for the gutterless /events archive, where tiles butt
 * together and a border would read as a double-thickness line between neighbours.
 * It is a prop rather than a stylesheet override because the frame is set inline,
 * and a CSS rule would have to win with !important.
 */
export default function EventTile({ event, compact = false, seamless = false }: { event: SiteEvent; compact?: boolean; seamless?: boolean }) {
  const lineup = compact ? [] : artistsForEvent(event.id);

  return (
    <Link
      href={`/events/${event.id}`}
      className="rd-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        aspectRatio: '3 / 1',
        overflow: 'hidden',
        border: seamless ? 0 : '1px solid var(--border)',
        borderRadius: seamless ? 0 : 'var(--r-lg)',
        background: '#000',
      }}
    >
      <Image
        src={event.banner}
        alt={event.title}
        fill
        sizes="(max-width: 900px) 100vw, 880px"
        style={{ objectFit: 'cover', opacity: compact ? 0.62 : 1 }}
      />

      {compact ? (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(5,6,10,0) 30%, rgba(5,6,10,0.9) 100%)',
            }}
          />
          {/* Tight margins: a 3:1 tile is short, and this caption always shows. */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px 16px' }}>
            <p style={{ ...meta, margin: '0 0 4px' }}>{event.date}</p>
            <h3 style={{ ...title, fontSize: 'clamp(1.05rem,1.9vw,1.4rem)', margin: 0 }}>{event.title}</h3>
            <p style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)', margin: '4px 0 0' }}>{event.venue}</p>
          </div>
        </>
      ) : (
        <>
          <div className="rd-veil" />
          <div className="rd-caption">
            <p style={{ ...meta, margin: '0 0 6px' }}>{event.date}</p>
            <h3 style={{ ...title, fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', margin: '0 0 8px' }}>{event.title}</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Tag color="violet" variant="outline" size="sm">{event.genre}</Tag>
              <span style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)' }}>{event.venue}</span>
            </div>

            {lineup.length > 0 && (
              <p style={{ ...meta, fontSize: 'var(--fs-3xs)', color: 'var(--text-faint)', margin: '10px 0 0', lineHeight: 1.6 }}>
                {lineup.map((artist) => artist.name).join(' · ')}
              </p>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
