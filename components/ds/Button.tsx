'use client';

import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neon' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  uppercase?: boolean;
  style?: CSSProperties;
};

const sizes: Record<ButtonSize, { padding: string; fontSize: string; height: number; gap: number }> = {
  sm: { padding: '8px 16px',  fontSize: 'var(--fs-xs)',   height: 34, gap: 8 },
  md: { padding: '12px 22px', fontSize: 'var(--fs-sm)',   height: 44, gap: 10 },
  lg: { padding: '16px 30px', fontSize: 'var(--fs-base)', height: 54, gap: 12 },
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary:   { background: 'var(--pc-cyan)', color: 'var(--pc-black)', borderColor: 'var(--pc-cyan)', boxShadow: 'var(--glow-cyan)' },
  secondary: { background: 'transparent', color: 'var(--pc-white)', borderColor: 'var(--border-strong)' },
  ghost:     { background: 'transparent', color: 'var(--text-secondary)', borderColor: 'transparent' },
  neon:      { background: 'color-mix(in oklab, var(--pc-violet) 16%, transparent)', color: 'var(--pc-violet-bright)', borderColor: 'var(--pc-violet)', boxShadow: 'var(--glow-violet)' },
  danger:    { background: 'transparent', color: 'var(--danger-fg)', borderColor: 'var(--danger)' },
};

const hoverByVariant: Record<ButtonVariant, CSSProperties> = {
  primary:   { background: 'var(--pc-cyan-bright)', boxShadow: 'var(--glow-cyan-lg)' },
  secondary: { borderColor: 'var(--pc-cyan)', color: 'var(--pc-cyan)', boxShadow: 'var(--glow-cyan)' },
  ghost:     { color: 'var(--pc-white)', background: 'var(--surface-raised)' },
  neon:      { background: 'color-mix(in oklab, var(--pc-violet) 28%, transparent)', boxShadow: 'var(--glow-violet)' },
  danger:    { background: 'color-mix(in oklab, var(--danger) 16%, transparent)', color: 'var(--pc-white)' },
};

/**
 * Paracausal Button — geometric, glow-forward call to action.
 * Variants: primary (cyan fill), secondary (hairline outline), ghost, neon (violet glow), danger.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  uppercase = true,
  style = {},
  type = 'button',
  ...rest
}: Props) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = sizes[size] ?? sizes.md;
  const active = !disabled && !loading;

  const st: CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--fw-semibold)' as CSSProperties['fontWeight'],
    fontSize: s.fontSize,
    letterSpacing: uppercase ? 'var(--ls-wider)' : 'var(--ls-normal)',
    textTransform: uppercase ? 'uppercase' : 'none',
    lineHeight: 1,
    borderRadius: 'var(--r-sm)',
    border: '1.5px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition:
      'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...variants[variant],
    ...(active && hover ? hoverByVariant[variant] : {}),
    ...(active && press ? { transform: 'scale(0.97)' } : {}),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      style={st}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            display: 'inline-block',
            animation: 'pc-spin 0.7s linear infinite',
          }}
        />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
      <style>{'@keyframes pc-spin{to{transform:rotate(360deg)}}'}</style>
    </button>
  );
}
