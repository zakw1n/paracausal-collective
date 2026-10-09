'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import { PLACEHOLDER_IMAGE, streamEmbedUrl, type EventMedia } from '@/lib/site';

const caption = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: 0,
} as const;

/** Stable key — streams have no src, files have no id. */
function mediaKey(item: EventMedia, index: number): string {
  return item.type === 'stream' ? `${item.provider}:${item.id}` : `${item.src}:${index}`;
}

/**
 * Local poster for a tile, or null when there is nothing to show.
 * Stream thumbnails are deliberately local files — a remote one would need
 * `images.remotePatterns` in next.config.ts before next/image would load it.
 */
function tileImage(item: EventMedia): string | null {
  if (item.type === 'photo') return item.src;
  return item.thumb ?? null;
}

function PlaceholderTile() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(140deg, rgba(52,231,222,0.05), rgba(139,92,246,0.05))',
      }}
    >
      <Image
        src={PLACEHOLDER_IMAGE}
        alt=""
        width={44}
        height={44}
        style={{ objectFit: 'contain', opacity: 0.35, filter: 'drop-shadow(0 0 14px rgba(52,231,222,0.3))' }}
      />
    </div>
  );
}

/** Photos, self-hosted clips, and streamed video from a night. Click to open full-screen. */
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
          src={PLACEHOLDER_IMAGE}
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
        {media.map((item, index) => {
          const poster = tileImage(item);
          const label = item.caption ?? `${eventTitle} — ${item.type} ${index + 1}`;

          return (
            <button
              key={mediaKey(item, index)}
              onClick={() => setOpenIndex(index)}
              className="rd-card"
              aria-label={label}
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
              {poster ? (
                <Image
                  src={poster}
                  alt={label}
                  fill
                  sizes="(max-width: 860px) 50vw, 220px"
                  style={{ objectFit: 'cover', opacity: 0.8 }}
                />
              ) : (
                <PlaceholderTile />
              )}

              {item.type !== 'photo' && (
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
          );
        })}
      </div>

      <Lightbox open={active !== null} onClose={() => setOpenIndex(null)}>
        {active && (
          <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#000' }}>
            {active.type === 'photo' && (
              <Image src={active.src} alt={active.caption ?? eventTitle} fill sizes="1000px" style={{ objectFit: 'contain' }} />
            )}

            {active.type === 'video' && (
              <video src={active.src} autoPlay controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {active.type === 'stream' && (
              <iframe
                src={streamEmbedUrl(active)}
                title={active.caption ?? eventTitle}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            )}
          </div>
        )}
      </Lightbox>
    </>
  );
}
