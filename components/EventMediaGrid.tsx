'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import type { EventMedia } from '@/lib/site';

const caption = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: 0,
} as const;

/** Photos and clips from a night. Click any tile to open it full-screen. */
export default function EventMediaGrid({ media, eventTitle }: { media: EventMedia[]; eventTitle: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : media[openIndex];

  if (media.length === 0) {
    return (
      <div
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: 'clamp(36px,7vw,64px) 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Image
          src="/logo/sphere.png"
          alt=""
          width={52}
          height={52}
          style={{ objectFit: 'contain', opacity: 0.35, filter: 'drop-shadow(0 0 14px rgba(52,231,222,0.3))' }}
        />
        <p style={{ ...caption, color: 'var(--text-faint)' }}>Frames incoming</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
        {media.map((item, index) => (
          <button
            key={item.src}
            onClick={() => setOpenIndex(index)}
            className="rd-card"
            aria-label={item.caption ?? `${eventTitle} — ${item.type} ${index + 1}`}
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              background: '#000',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Image
              src={item.thumb ?? item.src}
              alt={item.caption ?? `${eventTitle} — ${item.type} ${index + 1}`}
              fill
              sizes="(max-width: 860px) 50vw, 220px"
              style={{ objectFit: 'cover', opacity: 0.8 }}
            />
            {item.type === 'video' && (
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  background: 'rgba(5,6,10,0.5)',
                }}
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="#fff"><polygon points="6 4 20 12 6 20 6 4" /></svg>
              </span>
            )}
            {item.caption && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '22px 14px 12px',
                  background: 'linear-gradient(180deg, rgba(5,6,10,0) 0%, rgba(5,6,10,0.9) 100%)',
                  ...caption,
                  fontSize: 'var(--fs-3xs)',
                  textAlign: 'left',
                }}
              >
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <Lightbox open={active !== null} onClose={() => setOpenIndex(null)}>
        {active && (
          <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#000' }}>
            {active.type === 'video' ? (
              <video src={active.src} autoPlay controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <Image
                src={active.src}
                alt={active.caption ?? eventTitle}
                fill
                sizes="1000px"
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
        )}
      </Lightbox>
    </>
  );
}
