'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { GalleryLightbox, GalleryMediaTile } from '@/components/GalleryGrid';
import { useRoamingTile } from '@/components/useRoamingTile';
import { homeGallery, homeGalleryCount } from '@/lib/site';

/**
 * The home page's slice of the gallery: the same container, grid and tiles as
 * the wall, opening the same lightbox in place. `children` is the section's
 * heading and `footer` its button, both rendered inside the container so they
 * line up with the tiles at every width. See `.rd-gallery-grid--teaser` for
 * how it is cut to two rows.
 *
 * The roaming highlight is components/useRoamingTile.
 */
export default function GalleryStrip({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { gridRef, lit } = useRoamingTile();

  return (
    <>
      <div className="rd-gallery-wall">
        {children}
        <div ref={gridRef} className="rd-gallery-grid rd-gallery-grid--teaser">
          {/* Eight at most: the stylesheet shows six or all of them depending
              on width, so a ninth would start a ragged third row. The rest
              stay reachable by stepping through the lightbox. */}
          {homeGallery.slice(0, homeGalleryCount).map((tile, i) => (
            <GalleryMediaTile key={tile.kind === 'clip' ? tile.fullSrc : tile.src} tile={tile} className={i === lit ? 'rd-lit' : ''} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>
        {footer && <div className="rd-foot-cta">{footer}</div>}
      </div>

      <GalleryLightbox items={homeGallery} index={openIndex} onIndex={setOpenIndex} />
    </>
  );
}
