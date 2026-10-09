'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GalleryLightbox, GalleryMediaTile } from '@/components/GalleryGrid';
import { homeGallery, homeGalleryCount } from '@/lib/site';

/** How long the roaming highlight rests on a tile before moving on. */
const ROAM_MS = 2200;

/**
 * The home page's slice of the gallery: the same container, grid and tiles as
 * the wall, opening the same lightbox in place. `children` is the section's
 * heading, rendered inside the container so it lines up with the tiles at
 * every width. See `.rd-gallery-grid--teaser` for how it is cut to two rows.
 *
 * A cyan ring — the one the open poster wears in Recent Nights — wanders from
 * tile to tile at random. It gives way to the pointer (see `.rd-lit` in
 * globals.css), stays put for visitors who prefer reduced motion, and is left
 * out on phones.
 */
export default function GalleryStrip({ children }: { children: ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lit, setLit] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Not on phones — matches the stylesheet's split for the wall.
    const phone = window.matchMedia('(width < 736px)');
    const id = setInterval(() => {
      const grid = gridRef.current;
      if (!grid) return;
      if (phone.matches) return setLit(null);
      // Only tiles on show: the stylesheet hides the last two at narrow widths.
      const shown = Array.from(grid.children, (el, i) => ((el as HTMLElement).offsetParent ? i : -1)).filter((i) => i >= 0);
      setLit((prev) => {
        const pool = shown.filter((i) => i !== prev);
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : prev;
      });
    }, ROAM_MS);
    return () => clearInterval(id);
  }, []);

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
      </div>

      <GalleryLightbox items={homeGallery} index={openIndex} onIndex={setOpenIndex} />
    </>
  );
}
