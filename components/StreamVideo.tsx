'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

/**
 * Plays a Cloudflare Stream HLS manifest in a plain `<video>`.
 *
 * Why not Stream's own iframe player: the gallery tiles are styled — gradient
 * scrim, mono caption, accent border — and an iframe would replace all of it
 * with Cloudflare's chrome. HLS gives us the adaptive ladder (the player picks
 * the best rendition the connection carries) while the element stays ours.
 *
 * hls.js is preferred wherever Media Source Extensions exist, with the browser's
 * native HLS used only as the fallback (iOS Safari, which has no MSE). That
 * order matters: Chrome's `canPlayType('application/vnd.apple.mpegurl')` returns
 * the truthy `"maybe"` while Chrome cannot demux HLS at all, so testing native
 * support first sets a src that stalls at readyState 0 behind the poster — it
 * fetches segments and never renders a frame, which looks like buffering rather
 * than a failure.
 *
 * hls.js is imported dynamically so its ~130KB never lands in the page bundle —
 * it is fetched only when someone actually opens a clip.
 */
export default function StreamVideo({
  src,
  poster,
  style,
}: {
  /** HLS manifest URL — see `streamHls()` in lib/site.ts. */
  src: string;
  poster?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let hls: { destroy: () => void } | undefined;
    let cancelled = false;

    import('hls.js').then(({ default: Hls }) => {
      if (cancelled || !video.isConnected) return;

      // No MSE (iOS Safari): hand the manifest to the browser's own player.
      if (!Hls.isSupported()) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = src;
        return;
      }

      const instance = new Hls({ enableWorker: true });
      instance.loadSource(src);
      instance.attachMedia(video);
      hls = instance;
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      autoPlay
      controls
      playsInline
      preload="none"
      style={style}
    />
  );
}
