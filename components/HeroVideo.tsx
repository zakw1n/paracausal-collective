'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

/** Matches the stylesheet's phone/desktop split; see app/globals.css. */
const PHONE = '(width < 768px)';

/** Seconds of the reel's tail dissolved into its head at each loop. */
const FADE = 1;

/** The upper of the two layers; its opacity is the whole crossfade. */
const overStyle: CSSProperties = { opacity: 0, transition: `opacity ${FADE}s linear` };

/**
 * The showreel behind the home page hero, from Cloudflare Stream: a portrait
 * cut on phones, the landscape one from 768px up. The cut is chosen once, on
 * load — a window dragged across the breakpoint keeps the one it started with.
 *
 * The reel is one continuous shot, so its last frame does not match its first
 * and a plain `loop` jumps. Instead two copies are stacked and take turns: as
 * the one playing nears its end the other starts from the top and the upper
 * layer's opacity carries a dissolve between them. Each loop is therefore
 * `FADE` shorter than the file. Both copies also carry `loop`, so if a
 * dissolve cannot happen the footage still runs forever, with a jump.
 *
 * Each is an HLS manifest, which needs hls.js everywhere but Safari, so it is
 * attached after hydration — the poster behind the video covers the gap. See
 * components/StreamVideo.tsx for why hls.js is tried before native HLS.
 *
 * There is no `poster` attribute: it cannot vary by viewport, and the
 * container's background already shows the right frame through the empty video.
 */
export default function HeroVideo({
  src,
  narrowSrc,
}: {
  /** HLS manifest for the landscape cut — see `streamHls()` in lib/site.ts. */
  src: string;
  /** HLS manifest for the portrait cut, played on phones. */
  narrowSrc: string;
}) {
  const underRef = useRef<HTMLVideoElement>(null);
  const overRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const under = underRef.current;
    const over = overRef.current;
    if (!under || !over) return;
    // The video is hidden in CSS for these visitors; don't fetch it either.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const phone = window.matchMedia(PHONE).matches;
    const manifest = phone ? narrowSrc : src;

    const players: { destroy: () => void }[] = [];
    let cancelled = false;
    let frame = 0;
    let swap = 0;

    let active = under;
    let idle = over;
    let fading = false;

    const crossfade = () => {
      fading = true;
      const incoming = idle;
      const outgoing = active;
      // Nothing changes on screen until the incoming copy is really playing.
      // If it is not buffered, or the browser refuses to start it, this pass
      // is left to the videos' own `loop`, which jumps but never stops.
      const started = incoming.readyState >= 3 ? incoming.play() : Promise.reject();
      started.then(
        () => {
          if (cancelled) return;
          over.style.opacity = incoming === over ? '1' : '0';
          swap = window.setTimeout(() => {
            // The outgoing copy is fully covered or fully clear by now; rewind
            // it so it is ready to come back in.
            outgoing.pause();
            outgoing.currentTime = 0;
            active = incoming;
            idle = outgoing;
            fading = false;
            if (active.paused) active.play().catch(() => {});
          }, FADE * 1000 + 60);
        },
        () => {
          // Hold off until the tail has passed, or this would retry every frame.
          swap = window.setTimeout(() => { fading = false; }, FADE * 1000 + 60);
        },
      );
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (fading || !active.duration) return;
      // Only the opening moment of the tail starts a dissolve. Entering later
      // (a tab that was in the background, a seek) would run out of footage
      // partway through it.
      const intoTail = active.currentTime - (active.duration - FADE);
      if (intoTail >= 0 && intoTail < 0.2) crossfade();
    };

    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !under.isConnected) return;

      const attach = (video: HTMLVideoElement, autoplay: boolean) => {
        if (!Hls.isSupported()) {
          if (!video.canPlayType('application/vnd.apple.mpegurl')) return;
          video.src = manifest;
          if (autoplay) video.play().catch(() => {});
          else video.load();
          return;
        }

        const instance = new Hls({
          enableWorker: true,
          // hls.js assumes 500kbps until it has measured the connection, which
          // would open the hero on the 240p rung. Assume a decent connection —
          // a more modest one on a phone, which may be on mobile data — and let
          // it step down if that proves wrong.
          abrEwmaDefaultEstimate: phone ? 3_000_000 : 8_000_000,
          capLevelToPlayerSize: true,
        });
        instance.loadSource(manifest);
        instance.attachMedia(video);
        if (autoplay) {
          instance.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        }
        players.push(instance);
      };

      attach(under, true);
      // The second copy is not needed for most of a loop, so it waits until
      // the first is on screen rather than competing with it for bandwidth.
      under.addEventListener('playing', () => { if (!cancelled) attach(over, false); }, { once: true });
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(swap);
      players.forEach((p) => p.destroy());
    };
  }, [src, narrowSrc]);

  return (
    <>
      <video ref={underRef} muted loop autoPlay playsInline aria-hidden="true" />
      <video ref={overRef} muted loop playsInline aria-hidden="true" style={overStyle} />
    </>
  );
}
