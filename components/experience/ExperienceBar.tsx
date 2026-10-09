'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/**
 * The loud fixed bar the cutlist grammar asks for, and the page's one held
 * moment.
 *
 * The grammar bans `pin` and `dwell` outright, but the peak still has to hold
 * longer than anything else on the page. The resolution the skill prescribes is
 * to hold in the fixed chrome layer: the bar belongs to no act, so it can
 * unfurl and stay unfurled across the three crowd cuts while the acts
 * underneath keep cutting at full speed.
 *
 * `#peak` is the element it watches. Progress is how far the peak block has
 * travelled through the viewport, so the bar opens as the first crowd frame
 * lands and closes as the third leaves.
 */
export default function ExperienceBar({ ticketsHref, ctaLabel }: { ticketsHref: string; ctaLabel: string }) {
  const [open, setOpen] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const peak = document.getElementById('peak');
    if (!peak) return;

    function read() {
      frame.current = 0;
      if (!peak) return;
      const box = peak.getBoundingClientRect();
      const vh = window.innerHeight;
      // Open once the block has properly entered, close as it leaves the top.
      setOpen(box.top < vh * 0.45 && box.bottom > vh * 0.3);
    }

    function onScroll() {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    }

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <header className="xbar" data-open={open || undefined}>
      <div className="xbar__row">
        <Link className="xbar__mark" href="/">
          PARACAUSAL
        </Link>
        <a className="xbar__cta" href={ticketsHref} target={ticketsHref.startsWith('http') ? '_blank' : undefined} rel="noopener">
          {ctaLabel}
        </a>
      </div>
      <p className="xbar__hold" aria-hidden={!open}>
        YOU WERE THERE
      </p>
    </header>
  );
}
