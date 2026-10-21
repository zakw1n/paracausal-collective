'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root: Element | Document | string, opts?: Record<string, unknown>) => unknown;
      reduce?: () => boolean;
      instances: unknown[];
    };
  }
}

/**
 * Loads the scrollcraft engine and mounts it once the markup is in the DOM.
 *
 * The engine ships as a plain script with no module build and no teardown, so
 * it is served verbatim from `public/scrollcraft/` rather than imported, and
 * mounted exactly once per page instance. `mounted` guards React's double
 * effect invocation in development, which would otherwise push two rAF loops
 * driving the same nodes.
 *
 * The stylesheet is a `<link>` for the same reason: it is the engine's own file
 * and is never edited, so it stays a copied artifact rather than a source file
 * in `app/`.
 */
export default function ScrollCraftMount() {
  const mounted = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mounted.current) return;

    function mount() {
      if (mounted.current || !window.ScrollCraft) return;
      mounted.current = true;
      window.ScrollCraft.mount(document.body);
      setReady(true);
    }

    if (window.ScrollCraft) {
      mount();
      return;
    }

    const script = document.createElement('script');
    script.src = '/scrollcraft/scrollcraft.js';
    script.async = false;
    script.addEventListener('load', mount);
    document.body.appendChild(script);

    return () => script.removeEventListener('load', mount);
  }, []);

  // Only reports state for the verification harness; renders nothing.
  return <span data-sc-mounted={ready ? 'true' : 'false'} hidden />;
}
