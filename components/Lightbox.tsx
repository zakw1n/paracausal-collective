'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Full-screen overlay: Escape to close, body scroll locked while open,
 * click the backdrop to dismiss. Used by GalleryGrid and EventMediaGrid.
 *
 * Pass `onPrev` / `onNext` to let the viewer step through a set without
 * closing: arrow keys, on-screen arrows and a horizontal swipe all call them.
 */
type Props = {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  children: ReactNode;
};

const arrowStyle = {
  position: 'fixed',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 44,
  height: 44,
  background: 'rgba(5,6,10,0.7)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--r-sm)',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 18,
} as const;

export default function Lightbox({ open, onClose, onPrev, onNext, children }: Props) {
  /** Where the current touch began, or null when it should not count as a swipe. */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'ArrowRight') onNext?.();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      onTouchStart={(e) => {
        /* A drag that starts on a video is the viewer scrubbing its controls. */
        const onVideo = e.target instanceof HTMLVideoElement;
        touchStart.current = onVideo ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx > 0) onPrev?.();
        else onNext?.();
      }}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px,4vw,48px)',
        background: 'rgba(5,6,10,0.96)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1000,
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--glow-soft)',
        }}
      >
        {children}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed',
          top: 24,
          right: 28,
          width: 44,
          height: 44,
          background: 'rgba(5,6,10,0.7)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-sm)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 18,
        }}
      >
        ✕
      </button>
      {onPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous" style={{ ...arrowStyle, left: 12 }}>
          ‹
        </button>
      )}
      {onNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next" style={{ ...arrowStyle, right: 12 }}>
          ›
        </button>
      )}
    </div>
  );
}
