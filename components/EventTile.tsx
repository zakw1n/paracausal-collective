import Image from 'next/image';
import Tag from '@/components/ds/Tag';
import { artistsForEvent, type PastEvent } from '@/lib/site';

const meta = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

/**
 * Archive tile for a past night.
 * `compact` is the 3-up home preview; the full variant adds the genre tag and
 * the "Archive" corner stamp used on the events page.
 */
export default function EventTile({ event, compact = false }: { event: PastEvent; compact?: boolean }) {
  const lineup = compact ? [] : artistsForEvent(event.id);

  return (
    <div
      className="rd-card"
      style={{
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
        style={{ objectFit: 'cover', opacity: compact ? 0.62 : 0.6 }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(5,6,10,0) ${compact ? '30%' : '25%'}, rgba(5,6,10,${compact ? 0.9 : 0.92}) 100%)`,
        }}
      />

      {!compact && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
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
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: compact ? 20 : 22 }}>
        <p style={{ ...meta, margin: `0 0 ${compact ? 6 : 8}px` }}>{event.date}</p>
        <h3
          style={{
            fontFamily: 'var(--font-techno)',
            fontWeight: 700,
            fontSize: compact ? 'clamp(1.2rem,2.2vw,1.7rem)' : 'clamp(1.3rem,2.4vw,1.9rem)',
            color: '#fff',
            textTransform: 'uppercase',
            margin: compact ? 0 : '0 0 10px',
          }}
        >
          {event.title}
        </h3>

        {compact ? (
          <p style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)', margin: '8px 0 0' }}>{event.venue}</p>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Tag color="violet" variant="outline" size="sm">{event.genre}</Tag>
              <span style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)' }}>{event.venue}</span>
            </div>
            {lineup.length > 0 && (
              <p style={{ ...meta, fontSize: 'var(--fs-3xs)', color: 'var(--text-faint)', margin: '10px 0 0', lineHeight: 1.6 }}>
                {lineup.map((artist) => artist.name).join(' · ')}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
