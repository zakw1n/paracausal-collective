'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { GalleryMedia } from '@/lib/site';

/** How far, in slides, the feed may sit from a slide and still count as resting on it. */
const SETTLED = 0.03;

/**
 * The gallery on a phone, once a tile is tapped: every item full screen, one
 * above the other, moved through by swiping up and down the way a reels feed
 * is. components/GalleryGrid shows this in place of the lightbox below 736px.
 *
 * The slides themselves only hold stills. There is a single `<video>`, fixed
 * over the feed, that plays whichever clip the feed has come to rest on and
 * hides while it is moving. One element rather than one per slide because a
 * phone only lets video play with sound once the visitor has started that very
 * element by hand — a fresh element per slide would fall silent at every swipe.
 * It ignores touches, so swipes reach the feed underneath; a tap on a slide
 * pauses and resumes it.
 *
 * Sound is on if the browser allows it. Where it refuses, the clip starts
 * muted and the button in the corner turns sound on for the rest of the feed.
 */
export default function GalleryFeed({
  items,
  start,
  onClose,
}: {
  items: GalleryMedia[];
  /** Index of the item to open on. */
  start: number;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(start);
  /** Whether the feed is between slides. */
  const [moving, setMoving] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const wantSound = useRef(true);

  const item = items[current];
  const clip = item?.kind === 'clip' ? item : null;
  const clipSrc = clip?.fullSrc;

  // Open on the tapped item, before the first paint.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = start * el.clientHeight;
  }, [start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Point the one video at the clip the feed is resting on.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !clipSrc) return;

    let hls: { destroy: () => void } | undefined;
    let cancelled = false;

    const play = () => {
      if (cancelled) return;
      video.muted = !wantSound.current;
      video.play().then(
        () => setPaused(false),
        () => {
          // Refused with sound: start silent and leave sound to the button.
          if (cancelled) return;
          wantSound.current = false;
          setMuted(true);
          video.muted = true;
          video.play().then(() => setPaused(false), () => setPaused(true));
        },
      );
    };

    // See components/StreamVideo.tsx for why hls.js is tried before native HLS.
    import('hls.js').then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        if (!video.canPlayType('application/vnd.apple.mpegurl')) return;
        video.src = clipSrc;
        play();
        return;
      }
      const instance = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
      instance.loadSource(clipSrc);
      instance.attachMedia(video);
      instance.on(Hls.Events.MANIFEST_PARSED, play);
      hls = instance;
    });

    return () => {
      cancelled = true;
      video.pause();
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [clipSrc]);

  // Hold the clip while the feed is between slides; pick it up again if the
  // swipe falls back onto the same one.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.currentSrc) return;
    if (moving) video.pause();
    else if (!paused) video.play().catch(() => {});
    // `paused` is read, not watched: a tap is handled where it happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moving]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const at = el.scrollTop / el.clientHeight;
    const nearest = Math.round(at);
    if (Math.abs(at - nearest) > SETTLED) return setMoving(true);
    setMoving(false);
    if (nearest !== current && items[nearest]) {
      setCurrent(nearest);
      setPaused(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !clip) return;
    if (video.paused) video.play().then(() => setPaused(false), () => {});
    else {
      video.pause();
      setPaused(true);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    const next = !muted;
    wantSound.current = !next;
    setMuted(next);
    if (video) video.muted = next;
  };

  return (
    <div className="rd-feed" role="dialog" aria-modal="true" aria-label="Gallery">
      <div ref={scroller} className="rd-feed-scroll" onScroll={onScroll}>
        {items.map((entry, i) => {
          const upright = entry.kind === 'clip' && entry.upright;
          return (
            <div key={entry.kind === 'clip' ? entry.fullSrc : entry.src} className="rd-feed-slide" onClick={togglePlay}>
              {/* Only the slides either side of the current one fetch their still. */}
              {Math.abs(i - current) <= 1 && (
                <Image
                  src={entry.kind === 'clip' ? entry.poster : entry.src}
                  alt={entry.kind === 'photo' ? entry.alt : ''}
                  fill
                  sizes="100vw"
                  quality={entry.kind === 'photo' ? 90 : 75}
                  style={{ objectFit: upright ? 'cover' : 'contain' }}
                />
              )}
              <div className="rd-feed-cap">
                <p>{entry.date}</p>
                <h3>{entry.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <video
        ref={videoRef}
        className="rd-feed-video"
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        style={{ objectFit: clip?.upright ? 'cover' : 'contain', opacity: clip && !moving ? 1 : 0 }}
      />

      {/* The video covers the resting slide's own caption, so it is repeated
          on top; while the feed moves, the slides' captions are the ones seen. */}
      {clip && !moving && (
        <div className="rd-feed-cap">
          <p>{clip.date}</p>
          <h3>{clip.title}</h3>
        </div>
      )}

      {clip && paused && !moving && <span className="rd-feed-paused" aria-hidden="true">▶</span>}

      <span className="rd-feed-count">{`${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`}</span>

      <button type="button" className="rd-feed-btn rd-feed-close" aria-label="Close" onClick={onClose}>✕</button>
      {clip && (
        <button type="button" className="rd-feed-btn rd-feed-sound" aria-pressed={!muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} onClick={toggleSound}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" />
            {muted ? <path d="M16 9.5l5 5m0-5l-5 5" /> : <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />}
          </svg>
        </button>
      )}
    </div>
  );
}
