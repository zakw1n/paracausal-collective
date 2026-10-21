import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'live' | 'soon' | 'hot' | 'danger';

const tones: Record<BadgeTone, { color: string; bg: string; dotc: string }> = {
  neutral: { color: 'var(--text-secondary)',    bg: 'var(--surface-raised)',                              dotc: 'var(--text-muted)' },
  live:    { color: 'var(--pc-green-bright)',   bg: 'color-mix(in oklab, var(--pc-green) 14%, transparent)',  dotc: 'var(--pc-green)' },
  soon:    { color: 'var(--pc-cyan-bright)',    bg: 'color-mix(in oklab, var(--pc-cyan) 14%, transparent)',   dotc: 'var(--pc-cyan)' },
  hot:     { color: 'var(--pc-violet-bright)',  bg: 'color-mix(in oklab, var(--pc-violet) 16%, transparent)', dotc: 'var(--pc-violet)' },
  danger:  { color: 'var(--danger-fg)',         bg: 'color-mix(in oklab, var(--danger) 16%, transparent)',    dotc: 'var(--danger)' },
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  style?: CSSProperties;
};

/** Badge — small status marker. Dot + label; used for availability, "new", counts. */
export default function Badge({ children, tone = 'neutral', dot = false, style = {}, ...rest }: Props) {
  const t = tones[tone] ?? tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--r-sm)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-2xs)',
        letterSpacing: 'var(--ls-wide)',
        textTransform: 'uppercase',
        lineHeight: 1,
        color: t.color,
        background: t.bg,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: t.dotc,
            boxShadow: `0 0 8px ${t.dotc}`,
            flex: '0 0 auto',
          }}
        />
      )}
      {children}
    </span>
  );
}
