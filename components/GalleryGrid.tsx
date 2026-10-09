'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import MotionImage, { autoplayRefused } from '@/components/MotionImage';
import StreamVideo from '@/components/StreamVideo';
import { PLACEHOLDER_IMAGE, galleryMedia, galleryPlaceholders } from '@/lib/site';
import type { GalleryMedia } from '@/lib/site';

/** Shared by every tile: fills its grid cell and clips whatever overflows.
    No border and no radius — the wall is one sheet of artwork split only by
    the grid's hairline gap. */
const tileStyle = {
  position: 'relative',
  overflow: 'hidden',
  border: 0,
  borderRadius: 0,
  background: '#000',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
} as const;

/** Media fills the cell whatever its own ratio; the cell's shape crops it. */
const fillStyle = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } as const;

function Caption({ date, title }: { date: string; title: string }) {
  return (
    <div className="rd-gallery-cap">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>
        {date}
      </p>
      <p style={{ fontFamily: 'var(--font-techno)', fontStretch: '125%', fontWeight: 700, fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
        {title}
      </p>
    </div>
  );
}

/**
 * A tile's silent loop. The file is only requested once the tile is near the
 * viewport, so a page that shows several clips below the fold does not pay for
 * them on load; until then the poster stands in.
 */
function LoopVideo({ src, smallSrc, poster }: { src: string; smallSrc: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  /** The file to play, chosen once the tile is near: the small cut on a phone. */
  const [near, setNear] = useState<string | null>(null);
  /** Whether the loop is being shown as an image, autoplay having been refused. */
  const [stand, setStand] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(window.matchMedia('(width < 736px)').matches ? smallSrc : src);
        io.disconnect();
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, smallSrc]);

  // Where the browser refuses to autoplay, the same file is shown through an
  // image instead — see components/MotionImage.
  useEffect(() => {
    if (!near) return;
    ref.current?.play().catch((error) => { if (autoplayRefused(error)) setStand(true); });
  }, [near]);

  return (
    <>
      <video ref={ref} src={near ?? undefined} poster={poster} muted loop autoPlay playsInline data-still={stand ? '' : undefined} style={fillStyle} />
      {stand && near && <MotionImage src={near} style={fillStyle} onError={() => setStand(false)} />}
    </>
  );
}

/**
 * One clip or photo as a button that fills its grid cell. Shared by the gallery
 * wall and the home page strip so the two cannot drift apart.
 */
export function GalleryMediaTile({ tile, onOpen, className = '' }: { tile: GalleryMedia; onOpen: () => void; className?: string }) {
  if (tile.kind === 'clip') {
    return (
      <button onClick={onOpen} className={`rd-card ${className}`} aria-label={`Play ${tile.title}`} style={tileStyle}>
        <LoopVideo src={tile.src} smallSrc={tile.smallSrc} poster={tile.poster} />
        <svg
          viewBox="0 0 24 24"
          fill="#fff"
          aria-hidden="true"
          className="rd-gallery-icon"
        >
          <path d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm3.5 5.5v9l7.5-4.5-7.5-4.5z" fillRule="evenodd" />
        </svg>
        <Caption date={tile.date} title={tile.title} />
      </button>
    );
  }

  return (
    <button onClick={onOpen} className={`rd-card ${className}`} aria-label={`View ${tile.title}`} style={tileStyle}>
      <Image
        src={tile.src}
        alt={tile.alt}
        width={tile.width}
        height={tile.height}
        /* Far wider than the tile, on purpose. The originals are 3:2
           landscape and the cells are 3:4 or 4:5 portrait, so `cover`
           scales each photo to the cell's height — up to 1.9× the cell's
           width. The rest is headroom: `sizes` is multiplied by
           devicePixelRatio, and a DPR below 1 (Chrome at 80% zoom reports
           0.8) would otherwise fetch less than the box it paints into. */
        sizes="(max-width: 1500px) 66vw, 1000px"
        /* Above the default 75; see the note in next.config.ts. */
        quality={90}
        style={fillStyle}
      />
      <Caption date={tile.date} title={tile.title} />
    </button>
  );
}

/**
 * The lightbox over a run of gallery media: `index` is the item of `items`
 * showing, or null when closed. Stepping follows `items` — the order the
 * caller laid its tiles out in — and wraps at either end.
 */
export function GalleryLightbox({
  items,
  index,
  onIndex,
}: {
  items: GalleryMedia[];
  index: number | null;
  onIndex: (index: number | null) => void;
}) {
  const active = index === null ? null : items[index];
  const step = (delta: number) => {
    if (index !== null) onIndex((index + delta + items.length) % items.length);
  };

  return (
    <Lightbox open={active !== null} onClose={() => onIndex(null)} onPrev={() => step(-1)} onNext={() => step(1)}>
      {active?.kind === 'clip' && (
        // An upright clip is sized by height instead, so it is not cropped to
        // a 16:9 window; `contain` covers a phone too narrow for that height.
        <div style={active.upright ? { aspectRatio: active.upright, height: '85vh', maxWidth: '100%', margin: '0 auto' } : { aspectRatio: '16 / 9' }}>
          {/* Lightbox only mounts its children when open, so the manifest and the
              hls.js chunk are both requested on click rather than page load.
              Keying on the clip forces a fresh <video> per clip, so stepping
              cannot leave the previous hls.js instance attached. */}
          <StreamVideo
            key={active.fullSrc}
            src={active.fullSrc}
            poster={active.poster}
            style={{ width: '100%', height: '100%', objectFit: active.upright ? 'contain' : 'cover', background: '#000' }}
          />
        </div>
      )}
      {active?.kind === 'photo' && (
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
          /* The overlay caps its body at 1000px. Overstated for the same
             reason as the tiles above — at DPR 0.8 an honest 1000px would
             fetch the 828w candidate and upscale it into a 1000px box.
             `contain` and auto height keep the whole frame visible rather
             than cropping it. */
          sizes="(max-width: 1000px) 100vw, 1600px"
          quality={90}
          style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain', background: '#000' }}
        />
      )}
    </Lightbox>
  );
}

/** An empty cell, holding the wall's shape until a real frame lands. */
function GalleryStub() {
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(140deg, rgba(52,231,222,0.05), rgba(139,92,246,0.05))',
      }}
    >
      <Image
        src={PLACEHOLDER_IMAGE}
        alt=""
        width={36}
        height={36}
        style={{ objectFit: 'contain', opacity: 0.3, filter: 'drop-shadow(0 0 14px rgba(52,231,222,0.3))' }}
      />
    </div>
  );
}

export default function GalleryGrid() {
  /** Index into `galleryMedia` of the item the lightbox is showing, or null. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="rd-gallery-wall">
        <div className="rd-gallery-grid">
          {galleryMedia.map((tile, i) => (
            <GalleryMediaTile key={tile.kind === 'clip' ? tile.fullSrc : tile.src} tile={tile} onOpen={() => setOpenIndex(i)} />
          ))}
          {Array.from({ length: galleryPlaceholders }, (_, i) => (
            <GalleryStub key={`stub-${i}`} />
          ))}
        </div>
      </div>

      <GalleryLightbox items={galleryMedia} index={openIndex} onIndex={setOpenIndex} />
    </>
  );
}
