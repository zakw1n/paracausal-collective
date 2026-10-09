'use client';

import { useEffect } from 'react';

/**
 * Starts background video that the browser refused to autoplay. An iPhone in
 * Low Power Mode blocks every autoplay, muted or not, and nothing a page does
 * lifts that — but a tap counts as permission, so each one is used to start
 * whatever should be running and is not. The stylesheet hides the play button
 * Safari draws over such a video (see "Blocked autoplay" in globals.css), so
 * until then the poster simply stands in.
 *
 * This is the last resort. The footage on the home page first falls back to
 * components/MotionImage, which does play on load, and marks its video
 * `data-still` so it is skipped here.
 *
 * Covers anything with `autoplay`, plus video that marks itself
 * `data-playing="true"` because it is started from script instead.
 */
export default function AutoplayNudge() {
  useEffect(() => {
    const nudge = () => {
      document.querySelectorAll<HTMLVideoElement>('video[autoplay]:not([data-still]), video[data-playing="true"]:not([data-still])').forEach((video) => {
        if (video.paused && video.muted) video.play().catch(() => {});
      });
    };
    // Capture, so a handler that stops the event further down cannot hide it.
    const options = { capture: true, passive: true };
    document.addEventListener('touchend', nudge, options);
    document.addEventListener('click', nudge, options);
    return () => {
      document.removeEventListener('touchend', nudge, options);
      document.removeEventListener('click', nudge, options);
    };
  }, []);

  return null;
}
