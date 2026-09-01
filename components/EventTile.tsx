import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/components/ds/Tag';
import { artistsForEvent, type PastEvent } from '@/lib/site';

const meta = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

const title = {
  fontFamily: 'var(--font-techno)',
  fontWeight: 700,
  color: '#fff',
  textTransform: 'uppercase',
} as const;

/**
 * Archive tile for a night.
 *
 * `compact` is the 3-up home preview: art dimmed under a permanent gradient with
 * the caption always visible. The full variant used on /events leaves the artwork
 * undimmed and reveals its caption on hover (see .rd-veil / .rd-caption in
 * globals.css, which pin open on touch devices).
 */
export default function EventTile({ event, compact = false }: { event: PastEvent; compact?: boolean }) {
  const lineup = compact ? [] : artistsForEvent(event.id);

  return (
    <Link
      href={`/events/${event.id}`}
      className="rd-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        aspectRatio: compact ? '16 / 10' : '16 / 9',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        background: '#000',
      }}
    >
      <Image
        src={event.banner}
        alt={event.title}
        fill
        sizes="(max-width: 860px) 100vw, 33vw"
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
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
            <p style={{ ...meta, margin: '0 0 6px' }}>{event.date}</p>
            <h3 style={{ ...title, fontSize: 'clamp(1.2rem,2.2vw,1.7rem)', margin: 0 }}>{event.title}</h3>
            <p style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)', margin: '8px 0 0' }}>{event.venue}</p>
          </div>
        </>
      ) : (
        <>
          <div className="rd-veil" />
          <div className="rd-caption">
            <p style={{ ...meta, margin: '0 0 8px' }}>{event.date}</p>
            <h3 style={{ ...title, fontSize: 'clamp(1.3rem,2.4vw,1.9rem)', margin: '0 0 10px' }}>{event.title}</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Tag color="violet" variant="outline" size="sm">{event.genre}</Tag>
              <span style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)' }}>{event.venue}</span>
            </div>

            {lineup.length > 0 && (
              <p style={{ ...meta, fontSize: 'var(--fs-3xs)', color: 'var(--text-faint)', margin: '10px 0 0', lineHeight: 1.6 }}>
                {lineup.map((artist) => artist.name).join(' · ')}
              </p>
            )}

            <span
              style={{
                display: 'inline-block',
                marginTop: 12,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: 'var(--ls-wider)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                background: 'rgba(5,6,10,0.5)',
                padding: '4px 9px',
                borderRadius: 'var(--r-sm)',
              }}
            >
              Archive
            </span>
          </div>
        </>
      )}
    </Link>
  );
}
