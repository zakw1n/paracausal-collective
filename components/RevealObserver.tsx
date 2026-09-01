'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Adds `.in` to every `.rd-reveal` element as it enters the viewport.
 * Anything already above the fold when the route renders reveals immediately,
 * so the first paint never sits blank.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const frame = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('.rd-reveal').forEach((el) => {
        if (el.classList.contains('in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('in');
        else observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
