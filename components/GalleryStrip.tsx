'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { GalleryLightbox, GalleryMediaTile } from '@/components/GalleryGrid';
import { galleryMedia } from '@/lib/site';

/**
 * The home page's slice of the gallery: the same container, grid and tiles as
 * the wall, opening the same lightbox in place. `children` is the section's
 * heading, rendered inside the container so it lines up with the tiles at
 * every width. See `.rd-gallery-grid--teaser` for how it is cut to two rows.
 */
export default function GalleryStrip({ children }: { children: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="rd-gallery-wall">
        {children}
        <div className="rd-gallery-grid rd-gallery-grid--teaser">
          {galleryMedia.map((tile, i) => (
            <GalleryMediaTile key={tile.kind === 'clip' ? tile.fullSrc : tile.src} tile={tile} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>
      </div>

      <GalleryLightbox items={galleryMedia} index={openIndex} onIndex={setOpenIndex} />
    </>
  );
}
