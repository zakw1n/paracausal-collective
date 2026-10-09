/**
 * Inline-style recipes shared across pages.
 *
 * The site styles through inline objects rather than classes, which meant the
 * same mono/uppercase "eyebrow" recipe was retyped in six pages and four
 * components. These are the shared bases — spread one and override what
 * differs, e.g. `{ ...eyebrow, margin: '0 0 26px' }`, rather than editing
 * these values for a single call site.
 */
import type { CSSProperties } from 'react';

/** Small mono caps label above a heading. Cyan: the accent variant. */
export const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: 'var(--ls-widest)',
  textTransform: 'uppercase',
  color: 'var(--pc-cyan)',
  margin: 0,
} as const satisfies CSSProperties;

/** The quieter eyebrow used for section dividers inside a page. */
export const eyebrowMuted = {
  ...eyebrow,
  fontSize: 'var(--fs-2xs)',
  color: 'var(--text-muted)',
} as const satisfies CSSProperties;

/** Mono caps link/value text — footer columns, contact details, nav items. */
export const metaText = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
} as const satisfies CSSProperties;

/** The page-level `<h1>`. */
export const pageHeading = {
  fontFamily: 'var(--font-techno)',
  fontStretch: '125%',
  fontWeight: 800,
  color: '#fff',
  textAlign: 'center',
  lineHeight: 0.95,
  fontSize: 'clamp(2.6rem,8vw,6rem)',
} as const satisfies CSSProperties;

/** The in-page section `<h2>`, a step down from `pageHeading`. */
export const sectionHeading = {
  fontFamily: 'var(--font-techno)',
  fontStretch: '125%',
  fontWeight: 700,
  color: '#fff',
  lineHeight: 1,
  fontSize: 'clamp(2rem,4.5vw,3.4rem)',
  margin: 0,
} as const satisfies CSSProperties;

/**
 * Vertical rhythm + gutters for a homepage section. A plain string rather than
 * a style object: it is only ever a `padding` value, and sections spread their
 * own layout around it.
 *
 * The gutter is 5% of the section's own width, not 5vw. On a full-width
 * section they are equal, but a vw padding has a new computed value at every
 * window size, which stops the browser holding a visitor's place in the page
 * when they resize the window.
 */
export const sectionPad = 'clamp(70px,10vh,120px) clamp(20px,5%,64px)';
