'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export type Flyer = {
  id: string;
  title: string;
  date: string;
  venue: string;
  genre: string;
  banner: string;
};

/**
 * The signature move: six real event flyers as a physical stack you throw
 * aside.
 *
 * Bespoke to this page. The scroll engine is not involved and is not modified:
 * this is pointer work, driven by its own state. A flyer follows the pointer
 * with rotation proportional to horizontal travel, and releasing past the
 * threshold (or with enough velocity) throws it off screen and promotes the
 * one beneath.
 *
 * Touch gets a tap-to-throw affordance instead of a drag, because a horizontal
 * drag on a phone competes with the browser's own back-swipe and with the
 * vertical scroll this page is built around.
 */

const THROW_PX = 120;
const THROW_VELOCITY = 0.55;

/* `startTime` comes from the event's own `timeStamp` rather than a clock read:
   both are milliseconds on the same origin, and reading a clock inside a
   component body is an impurity the React compiler rejects. */
type Drag = { pointerId: number; startX: number; startY: number; startTime: number };

export default function FlyerStack({ flyers }: { flyers: Flyer[] }) {
  const [thrown, setThrown] = useState<string[]>([]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [released, setReleased] = useState<{ id: string; x: number; y: number } | null>(null);
  const drag = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarse(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const remaining = flyers.filter((flyer) => !thrown.includes(flyer.id));
  const top = remaining[0];

  function throwTop(x: number, y: number) {
    if (!top) return;
    const id = top.id;
    setReleased({ id, x, y });
    setOffset({ x: 0, y: 0 });
    window.setTimeout(() => {
      setThrown((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setReleased(null);
    }, 420);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (coarse || !top || released) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    setOffset({ x: event.clientX - current.startX, y: event.clientY - current.startY });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    const elapsed = Math.max(event.timeStamp - current.startTime, 1);
    const velocity = Math.abs(dx) / elapsed;

    if (Math.abs(dx) > THROW_PX || velocity > THROW_VELOCITY) {
      const direction = dx === 0 ? 1 : Math.sign(dx);
      throwTop(direction * (window.innerWidth * 0.9), dy * 1.6);
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }

  function restack() {
    setDragging(false);
    setThrown([]);
    setReleased(null);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div className="flyers">
      <div className="flyers__stage">
        {remaining
          .slice(0, 4)
          .map((flyer, depth) => {
            const isTop = depth === 0;
            const isReleased = released?.id === flyer.id;
            const dx = isReleased ? released.x : isTop ? offset.x : 0;
            const dy = isReleased ? released.y : isTop ? offset.y : 0;
            const rotation = dx / 22 + (isTop ? 0 : (depth % 2 === 0 ? 1 : -1) * (depth * 1.4));

            return (
              <div
                key={flyer.id}
                className="flyer"
                data-top={isTop || undefined}
                data-released={isReleased || undefined}
                style={{
                  zIndex: 10 - depth,
                  transform: `translate3d(${dx}px, ${dy - depth * 10}px, 0) rotate(${rotation}deg) scale(${1 - depth * 0.04})`,
                  transition: dragging && isTop && !isReleased ? 'none' : 'transform .42s cubic-bezier(.22,.61,.36,1), opacity .42s linear',
                  opacity: isReleased ? 0 : 1,
                }}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flyer.banner} alt={`${flyer.title} flyer`} draggable={false} width={1500} height={500} />
              </div>
            );
          })
          .reverse()}

        {remaining.length === 0 && (
          <div className="flyers__empty">
            <p>That is all six.</p>
            <button type="button" onClick={restack}>
              Stack them again
            </button>
          </div>
        )}
      </div>

      {top && (
        <p className="flyers__caption" aria-live="polite">
          <span className="flyer__title">{top.title}</span>
          <span className="flyer__sub">
            {top.date} · {top.venue}
          </span>
        </p>
      )}

      <div className="flyers__side">
        <h2 className="sc-display sc-display--md">SIX NIGHTS, IN ORDER</h2>
        <p className="sc-body">
          Every flyer we have printed since 2023. {coarse ? 'Tap one off the top.' : 'Drag one off the top.'}
        </p>
        <p className="flyers__count" aria-live="polite">
          {remaining.length} of {flyers.length} left
        </p>

        {coarse && top && (
          <button type="button" className="flyers__throw" onClick={() => throwTop(window.innerWidth * 0.9, 20)}>
            Next flyer
          </button>
        )}

        {/* The keyboard and screen-reader path: the stack is a visual toy, the
            list is the content, and it stays in the DOM either way. */}
        <ul className="flyers__list">
          {flyers.map((flyer) => (
            <li key={flyer.id}>
              <a href={`/events/${flyer.id}`}>
                <span>{flyer.title}</span>
                <span>{flyer.date}</span>
                <span>{flyer.genre}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
