import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type TagColor = 'cyan' | 'violet' | 'green' | 'white' | 'muted';
export type TagVariant = 'outline' | 'solid' | 'soft';
export type TagSize = 'sm' | 'md';

const palette: Record<TagColor, string> = {
  cyan:   'var(--pc-cyan)',
  violet: 'var(--pc-violet-bright)',
  green:  'var(--pc-green)',
  white:  'var(--pc-white)',
  muted:  'var(--text-muted)',
};

const sizes: Record<TagSize, CSSProperties> = {
  sm: { padding: '3px 9px',  fontSize: 'var(--fs-3xs)' },
  md: { padding: '5px 12px', fontSize: 'var(--fs-2xs)' },
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  color?: TagColor;
  variant?: TagVariant;
  size?: TagSize;
  style?: CSSProperties;
};

/** Tag / genre chip — pill, mono, wide-tracked. Used for music genres, filters, meta. */
export default function Tag({ children, color = 'cyan', variant = 'outline', size = 'md', style = {}, ...rest }: Props) {
  const c = palette[color] ?? palette.cyan;

  const variants: Record<TagVariant, CSSProperties> = {
    outline: { color: c, border: `1px solid color-mix(in oklab, ${c} 50%, transparent)`, background: 'transparent' },
    solid:   { color: 'var(--pc-black)', background: c, border: `1px solid ${c}` },
    soft:    { color: c, background: `color-mix(in oklab, ${c} 14%, transparent)`, border: '1px solid transparent' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        borderRadius: 'var(--r-pill)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
