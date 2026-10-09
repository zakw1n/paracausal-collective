'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ds/Button';
import EventTile from '@/components/EventTile';
import { eyebrow, sectionHeading, sectionPad } from '@/components/ds/styles';
import type { SiteEvent } from '@/lib/site';

/** Gap between cards, in px. Shared by the layout and the arrow step. */
const GAP = 16;

/** How long the row rests on a card before advancing. */
const ADVANCE_MS = 3000;

/**
 * Ignore an auto-advance that lands within this long of any other scroll, so
 * the timer never yanks the row out from under someone mid-drag.
 */
const SETTLE_MS = 500;

/** Slack when matching scroll position to a card, for sub-pixel layout. */
const EPSILON = 8;

const arrowButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: '50%',
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: '#fff',
  cursor: 'pointer',
} as const;

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );
}

/**
 * The archive row on the homepage: past nights on a snapping horizontal track.
 *
 * Deliberately library-free — a native `overflow-x` scroller with CSS snap
 * points gives drag, trackpad, keyboard and touch for nothing, and the arrows
 * are just `scrollBy`. The auto-advance is the only stateful part, and it
 * yields to the visitor: it holds while the pointer is over the row, while the
 * tab is hidden, and entirely under `prefers-reduced-motion`.
 */
export default function EventCarousel({ events }: { events: SiteEvent[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  /** Card width + gap — measured, since the width is a clamp() we can't read. */
  const step = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | undefined;
    return first ? first.offsetWidth + GAP : 320;
  };

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? step() : -step(), behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Pointers that can hover pause the row; touch is excluded because :hover
    // sticks after a tap there, which would park the carousel for good.
    const canHover = window.matchMedia('(hover: hover)').matches;

    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      // Asked of the DOM each tick rather than tracked in a ref: a mouseleave
      // that never arrives (element removed, window blurred, pointer capture)
      // would otherwise leave the row paused permanently.
      if (canHover && track.matches(':hover')) return;
      if (document.visibilityState === 'hidden') return;
      if (Date.now() - lastScrollRef.current < SETTLE_MS) return;

      const items = Array.from(track.children) as HTMLElement[];
      if (items.length < 2) return;

      // Read the position off the DOM rather than tracking an index, so a
      // manual scroll or drag hands the row back at the card it settled on.
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - EPSILON;
      const current = items.findIndex((item) => item.offsetLeft >= track.scrollLeft - EPSILON);
      const next = atEnd || current === -1 ? 0 : (current + 1) % items.length;

      track.scrollTo({ left: items[next].offsetLeft, behavior: 'smooth' });
    }, ADVANCE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rd-reveal" style={{ padding: sectionPad }}>
      {/* No max-width: the archive row is the full-bleed band under the hero. */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
          <div>
            <p style={{ ...eyebrow, margin: '0 0 14px' }}>The archive</p>
            <h2 style={sectionHeading}>RECENT NIGHTS</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" onClick={() => scroll('left')} aria-label="Previous nights" style={arrowButton}>
              <Chevron dir="left" />
            </button>
            <button type="button" onClick={() => scroll('right')} aria-label="Next nights" style={arrowButton}>
              <Chevron dir="right" />
            </button>
            <Link href="/events"><Button size="md" variant="secondary">All events</Button></Link>
          </div>
        </div>

        <div
          ref={trackRef}
          className="rd-scroll-x"
          onScroll={() => { lastScrollRef.current = Date.now(); }}
          style={{
            position: 'relative',
            display: 'flex',
            gap: GAP,
            overflowX: 'auto',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x mandatory',
            // Room for the .rd-card hover lift and its glow, which the
            // scroll container would otherwise clip.
            padding: '8px 0 24px',
            maskImage: 'linear-gradient(to right, #000, #000 calc(100% - 80px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, #000, #000 calc(100% - 80px), transparent)',
          }}
        >
          {events.map((event) => (
            <div key={event.id} style={{ flex: '0 0 auto', width: 'min(92vw,880px)', scrollSnapAlign: 'start' }}>
              <EventTile event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
