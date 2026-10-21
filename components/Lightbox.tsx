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
  /** Accessible name for the dialog. */
  label?: string;
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

export default function Lightbox({ open, onClose, onPrev, onNext, label = 'Media viewer', children }: Props) {
  /** Where the current touch began, or null when it should not count as a swipe. */
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Focus moves into the dialog as it opens and back to whatever opened it
  // (the tile) as it closes, so keyboard and screen-reader users are not left
  // on the page behind the overlay.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    return () => opener?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'ArrowRight') onNext?.();
      else if (e.key === 'Tab') {
        // Keep Tab inside the dialog.
        const focusable = dialog.current?.querySelectorAll<HTMLElement>('button, video[controls], a[href]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
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
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={label}
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
        ref={closeButton}
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
