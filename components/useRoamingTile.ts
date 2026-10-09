import { useEffect, useRef, useState } from 'react';

/** How long the roaming highlight rests on a tile before moving on. */
const ROAM_MS = 2200;

/**
 * The gallery's roaming highlight: every so often picks one of a grid's tiles
 * at random to wear `.rd-lit` (see globals.css) — the cyan ring the open
 * poster wears in Recent Nights. Returns a ref for the grid and the index,
 * among the grid's children, of the tile currently lit.
 *
 * It gives way to the pointer in the stylesheet, stays put for visitors who
 * prefer reduced motion, and is left out on phones.
 */
export function useRoamingTile() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Not on phones — matches the stylesheet's split for the wall.
    const phone = window.matchMedia('(width < 736px)');
    const id = setInterval(() => {
      const grid = gridRef.current;
      if (!grid) return;
      if (phone.matches) return setLit(null);
      // Only real tiles, and only those on show: the wall ends in empty
      // placeholder cells, and the home strip hides its last two when narrow.
      const shown = Array.from(grid.children, (el, i) =>
        el.classList.contains('rd-card') && (el as HTMLElement).offsetParent ? i : -1,
      ).filter((i) => i >= 0);
      setLit((prev) => {
        const pool = shown.filter((i) => i !== prev);
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : prev;
      });
    }, ROAM_MS);
    return () => clearInterval(id);
  }, []);

  return { gridRef, lit };
}
