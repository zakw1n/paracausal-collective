'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ds/Button';
import { eyebrow, sectionHeading } from '@/components/ds/styles';
import { streamHls, streamPoster } from '@/lib/site';
import type { SiteEvent } from '@/lib/site';

/** How long the strip rests on a night before opening the next. */
const ADVANCE_MS = 4500;

/**
 * Seconds into a reel that its still is taken from. The reels open on bare
 * artwork and build the flyer up; by here every one shows its title and lineup.
 */
const POSTER_AT = 12;

/**
 * A night's animated flyer, from Cloudflare Stream. Nothing is fetched until
 * the panel first opens; after that it plays while open and holds its frame
 * while closed. Visitors who prefer reduced motion keep the still.
 *
 * See components/StreamVideo.tsx for why hls.js is tried before native HLS.
 */
function Reel({ uid, active, muted }: { uid: string; active: boolean; muted: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const wanted = useRef(active);

  // Latches the first time the panel opens, so the player is built once and
  // then kept. Set during render: it is derived from the prop, not an effect.
  const [armed, setArmed] = useState(active);
  if (active && !armed) setArmed(true);

  useEffect(() => {
    wanted.current = active;
    const video = ref.current;
    if (!video) return;
    if (active) video.play().catch(() => {});
    else video.pause();
  }, [active]);

  useEffect(() => {
    const video = ref.current;
    if (!armed || !video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const src = streamHls(uid);
    let hls: { destroy: () => void } | undefined;
    let cancelled = false;

    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !video.isConnected) return;
      // The panel may have closed again while hls.js was loading.
      const start = () => { if (wanted.current) video.play().catch(() => {}); };

      if (!Hls.isSupported()) {
        if (!video.canPlayType('application/vnd.apple.mpegurl')) return;
        video.src = src;
        start();
        return;
      }

      const instance = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
      instance.loadSource(src);
      instance.attachMedia(video);
      instance.on(Hls.Events.MANIFEST_PARSED, start);
      hls = instance;
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [armed, uid]);

  // `loop` alone is not enough. A reel whose last segment stops a few
  // hundredths of a second short of its stated length never reaches the end:
  // it stalls there waiting for footage that does not exist, `ended` never
  // fires, and so the browser never loops it. Send it back to the start
  // just before that point instead.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const rewind = () => { if (video.duration - video.currentTime < 0.35) video.currentTime = 0; };
    video.addEventListener('timeupdate', rewind);
    video.addEventListener('waiting', rewind);
    return () => {
      video.removeEventListener('timeupdate', rewind);
      video.removeEventListener('waiting', rewind);
    };
  }, []);

  // React only writes `muted` as an attribute on mount, so later changes go
  // through the property.
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  return (
    <video
      ref={ref}
      className="rd-night-media"
      poster={streamPoster(uid, 1280, POSTER_AT)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}

/**
 * The archive on the homepage: past nights as a strip of panels, one open at a
 * time, playing that night's flyer reel. The open panel is always a full 9:16
 * and the closed ones share what is left; where they would not fit, the strip
 * scrolls sideways rather than squeezing them.
 *
 * The auto-advance has no timer of its own. The open panel's progress bar is a
 * CSS animation and the strip moves on when it ends, so the bar and the
 * advance cannot drift apart, and holding is a stylesheet rule (pointer over
 * the strip, keyboard focus inside it, or sound on — see .rd-nights in
 * globals.css). Under `prefers-reduced-motion` the animation is off, so
 * nothing advances.
 */
export default function EventCarousel({ events }: { events: SiteEvent[] }) {
  const [active, setActive] = useState(0);
  const [sound, setSound] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  // Where the strip overflows, bring the open panel to its leading edge. The
  // target is worked out, not measured: the panels are still mid-transition
  // here, and while the strip overflows every closed panel is exactly its
  // basis wide. scrollTo on the strip rather than scrollIntoView, which would
  // also drag the page vertically.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const style = getComputedStyle(strip);
    const closed = parseFloat(style.getPropertyValue('--night-closed')) || 0;
    const gap = parseFloat(style.columnGap) || 0;
    strip.scrollTo({ left: active * (closed + gap), behavior: 'smooth' });
  }, [active]);

  if (events.length === 0) return null;
  const current = events[active];

  return (
    <section className="rd-reveal rd-nights-section">
      <div className="rd-nights-wall">
        <div className="rd-nights-head">
          <div>
            <p style={{ ...eyebrow, margin: '0 0 14px' }}>The archive</p>
            <h2 style={sectionHeading}>RECENT NIGHTS</h2>
          </div>
          <Link href="/events"><Button size="md" variant="secondary">All events</Button></Link>
        </div>

        <div
          ref={stripRef}
          className="rd-nights"
          // Sound holds the strip, or a reel would be cut off mid-listen.
          data-hold={sound && current.reel ? 'true' : undefined}
          style={{ '--night-ms': `${ADVANCE_MS}ms` } as CSSProperties}
        >
          {events.map((event, i) => {
            const on = i === active;
            return (
              <div
                key={event.id}
                className="rd-night"
                data-active={on}
                // Mouse only: a tap also fires pointerenter, which would open
                // the panel before the click handler below sees it.
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(i); }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="rd-night-link"
                  aria-label={`${event.title}, ${event.date}`}
                  aria-current={on ? 'true' : undefined}
                  // Keyboard only, for the same reason — a tap focuses too.
                  onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) setActive(i); }}
                  // Without hover, the first tap opens the panel and the
                  // second follows the link.
                  onClick={(e) => {
                    if (!on && window.matchMedia('(hover: none)').matches) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                >
                  {event.reel ? (
                    <Reel uid={event.reel} active={on} muted={!sound} />
                  ) : (
                    <Image src={event.banner} alt="" fill sizes="430px" className="rd-night-media" />
                  )}
                  <span className="rd-night-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="rd-night-name">{event.title}</span>
                  <span className="rd-night-bar">
                    {on && <span onAnimationEnd={() => setActive((n) => (n + 1) % events.length)} />}
                  </span>
                </Link>

                {/* Beside the link, not inside it: a button cannot nest in an anchor. */}
                {event.reel && on && (
                  <button
                    type="button"
                    className="rd-night-sound"
                    aria-pressed={sound}
                    aria-label={sound ? 'Mute the reel' : 'Play the reel with sound'}
                    onClick={() => setSound((s) => !s)}
                  >
                    ♪
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="rd-nights-foot">
          <span className="rd-nights-hint">Auto-cycles · hover to hold</span>
          <span>{`${String(active + 1).padStart(2, '0')} / ${current.title} · ${current.date}`}</span>
        </div>
      </div>
    </section>
  );
}
