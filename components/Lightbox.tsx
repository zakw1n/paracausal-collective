'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Full-screen overlay: Escape to close, body scroll locked while open,
 * click the backdrop to dismiss. Used by GalleryGrid and EventMediaGrid.
 */
export default function Lightbox({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
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
    </div>
  );
}
