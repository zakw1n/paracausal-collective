import type { CSSProperties } from 'react';

/**
 * A silent mp4 shown through an `<img>`, the way a GIF would be. Only Safari
 * can do this, and only Safari needs it: an iPhone in Low Power Mode refuses
 * to start any `<video>` until the visitor taps, but it plays an image like
 * this one on load. Callers put it over a video whose `play()` was refused.
 *
 * `src` must be a plain mp4 file — an image cannot take an HLS manifest. In a
 * browser that cannot show it `onError` fires, and the caller goes back to the
 * video.
 */
export default function MotionImage({
  src,
  onError,
  className,
  style,
}: {
  src: string;
  onError: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  // next/image would try to optimise the file as a picture.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" className={className} style={style} onError={onError} />;
}

/** Whether a rejected `play()` was the browser refusing to autoplay. */
export const autoplayRefused = (error: unknown) => (error as { name?: string } | null)?.name === 'NotAllowedError';
