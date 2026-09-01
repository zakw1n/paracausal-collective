'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import { galleryStubs } from '@/lib/site';

export default function GalleryGrid() {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="rd-gallery-grid">
        {/* Feature video */}
        <button
          onClick={() => setLightbox(true)}
          className="rd-card rd-gallery-feature"
          aria-label="Play ZDLCK B2B Skorgen"
          style={{
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            background: '#000',
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left',
          }}
        >
          <video
            src="/gallery/skorgen-loop.mp4"
            muted
            loop
            autoPlay
            playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,6,10,0) 50%, rgba(5,6,10,0.85) 100%)' }} />
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              background: 'rgba(5,6,10,0.5)',
            }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff"><polygon points="6 4 20 12 6 20 6 4" /></svg>
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 22 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>
              Apr 2026
            </p>
            <p style={{ fontFamily: 'var(--font-techno)', fontWeight: 700, fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
              ZDLCK B2B Skorgen
            </p>
          </div>
        </button>

        {/* Placeholders */}
        {galleryStubs.map((stub) => (
          <div
            key={stub.title}
            style={{
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(140deg, rgba(52,231,222,0.05), rgba(139,92,246,0.05))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Image
              src="/logo/sphere.png"
              alt=""
              width={52}
              height={52}
              style={{ objectFit: 'contain', flexShrink: 0, opacity: 0.35, filter: 'drop-shadow(0 0 14px rgba(52,231,222,0.3))' }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
              {stub.title}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-faint)', margin: 0 }}>
              Frames incoming
            </p>
          </div>
        ))}
      </div>

      <Lightbox open={lightbox} onClose={() => setLightbox(false)}>
        <div style={{ aspectRatio: '16 / 9' }}>
          <video src="/gallery/skorgen.mp4" autoPlay controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
        </div>
      </Lightbox>
    </>
  );
}
