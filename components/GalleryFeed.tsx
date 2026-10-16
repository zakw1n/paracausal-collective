'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { GalleryMedia } from '@/lib/site';

/** How long the feed must go without scrolling, in ms, to count as at rest where `scrollend` is missing. */
const SETTLE_MS = 120;

/**
 * The gallery on a phone, once a tile is tapped: every item full screen, one
 * above the other, moved through by swiping up and down the way a reels feed
 * is. components/GalleryGrid shows this in place of the lightbox below 736px.
 *
 * The slides themselves only hold stills. There is a single `<video>`, laid
 * inside the scroller on top of whichever slide the feed last came to rest on,
 * so it travels with that slide under the finger rather than vanishing as a
 * swipe begins. One element rather than one per slide because a phone only
 * lets video play with sound once the visitor has started that very element by
 * hand — a fresh element per slide would fall silent at every swipe. It ignores
 * touches, so swipes reach the feed underneath; a tap on a slide pauses and
 * resumes it.
 *
 * The clip changes only once the feed is at rest, never while a flick passes
 * slides by, and the video stays hidden until the new clip is actually playing,
 * so the slide's still is what shows in between rather than the last frame of
 * the clip before.
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
  const currentRef = useRef(start);
  /** The clip the video has started playing, so it is shown only once it has a frame of its own. */
  const [playing, setPlaying] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const wantSound = useRef(true);
  /** Carried from clip to clip so each starts at the quality the last one reached, not the bottom rung. */
  const bandwidth = useRef<number | undefined>(undefined);

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

  // Settle on a slide once the feed stops: on `scrollend` where the browser
  // has it, otherwise once scroll events have paused. Turning the phone
  // changes every slide's height while the scroll offset stays put, which
  // would leave the feed between slides; it is put back on the slide it was
  // showing, and any scroll the browser reports mid-turn is ignored.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let height = el.clientHeight;
    let timer: number | undefined;

    const settle = () => {
      window.clearTimeout(timer);
      if (el.clientHeight !== height) return;
      const nearest = Math.round(el.scrollTop / height);
      if (nearest === currentRef.current || !items[nearest]) return;
      currentRef.current = nearest;
      setCurrent(nearest);
      setPaused(false);
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_MS);
    };
    const resize = new ResizeObserver(() => {
      height = el.clientHeight;
      el.scrollTop = currentRef.current * height;
    });

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('scrollend', settle);
    resize.observe(el);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('scrollend', settle);
      resize.disconnect();
    };
  }, [items]);

  // Point the one video at the clip the feed is resting on.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !clipSrc) return;

    let hls: { destroy: () => void; bandwidthEstimate: number } | undefined;
    let cancelled = false;

    const onPlaying = () => setPlaying(clipSrc);
    video.addEventListener('playing', onPlaying);

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
      const instance = new Hls({
        enableWorker: true,
        capLevelToPlayerSize: true,
        // A feed is swiped on long before a set ends; buffering far ahead
        // only spends the connection the next clip could start sharper on.
        maxBufferLength: 12,
        ...(bandwidth.current ? { abrEwmaDefaultEstimate: bandwidth.current, testBandwidth: false } : {}),
      });
      instance.loadSource(clipSrc);
      instance.attachMedia(video);
      instance.on(Hls.Events.MANIFEST_PARSED, play);
      hls = instance;
    });

    return () => {
      cancelled = true;
      video.removeEventListener('playing', onPlaying);
      video.pause();
      if (hls) {
        bandwidth.current = hls.bandwidthEstimate;
        hls.destroy();
      }
      video.removeAttribute('src');
      video.load();
    };
  }, [clipSrc]);

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

  const shown = clipSrc !== undefined && playing === clipSrc;

  return (
    <div className="rd-feed" role="dialog" aria-modal="true" aria-label="Gallery">
      <div ref={scroller} className="rd-feed-scroll">
        {items.map((entry, i) => {
          const upright = entry.kind === 'clip' && entry.upright;
          return (
            <div key={entry.kind === 'clip' ? entry.fullSrc : entry.src} className="rd-feed-slide" onClick={togglePlay}>
              {/* Only the slides near the current one fetch their still. Two
                  either side, since a second swipe can start before the first
                  has settled. */}
              {Math.abs(i - current) <= 2 && (
                <Image
                  src={entry.kind === 'clip' ? entry.poster : entry.src}
                  alt={entry.kind === 'photo' ? entry.alt : ''}
                  fill
                  sizes="100vw"
                  quality={entry.kind === 'photo' ? 90 : 75}
                  className={upright ? 'rd-feed-media rd-feed-media--upright' : 'rd-feed-media'}
                />
              )}
              <div className="rd-feed-cap">
                <p>{entry.date}</p>
                <h3>{entry.title}</h3>
              </div>
            </div>
          );
        })}

        <video
          ref={videoRef}
          className={clip?.upright ? 'rd-feed-video rd-feed-media--upright' : 'rd-feed-video'}
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          // Shown with a fade once playing; hidden at once on a change of
          // clip, so the old frame is never seen over the new slide.
          style={{ top: `${current * 100}%`, opacity: shown ? 1 : 0, transition: shown ? 'opacity 0.2s ease' : 'none' }}
        />
      </div>

      {clip && paused && <span className="rd-feed-paused" aria-hidden="true">▶</span>}

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
