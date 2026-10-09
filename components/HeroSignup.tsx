'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

type Status = 'idle' | 'sending' | 'done' | 'error';

/** The field and its arrow share one box, so the border lives on the form. */
const fieldStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: 54,
  background: 'color-mix(in oklab, var(--pc-white) 5%, transparent)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--r-sm)',
  transition: 'border-color .2s, box-shadow .2s',
};

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: '100%',
  padding: '0 0 0 18px',
  background: 'transparent',
  border: 0,
  color: 'var(--pc-white)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-sm)',
  letterSpacing: 'var(--ls-wide)',
  outline: 'none',
};

/**
 * Hero mailing-list capture. Posts to /api/subscribe, which adds the address
 * to the Resend audience.
 */
export default function HeroSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setMessage(typeof data.error === 'string' ? data.error : 'Something went wrong. Try again.');
        return;
      }

      setStatus('done');
      setEmail('');
      setMessage("You're on the list. Watch your inbox.");
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 560, marginTop: 38, animation: 'rd-rise .9s var(--ease-out) both' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-2xs)',
          letterSpacing: 'var(--ls-widest)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: '0 0 14px',
        }}
      >
        Next date, before it goes public
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          ...fieldStyle,
          borderColor: focused ? 'var(--pc-cyan)' : 'var(--border-strong)',
          boxShadow: focused ? 'var(--glow-cyan)' : 'none',
        }}
      >
        <label htmlFor="hero-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          Email address
        </label>
        <input
          id="hero-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby="hero-email-status"
          style={inputStyle}
        />
        <button
          type="submit"
          className="rd-signup-go"
          disabled={status === 'sending'}
          aria-label={status === 'done' ? 'Subscribed' : 'Join the list'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {status === 'done' ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
          </svg>
        </button>
      </form>

      <p
        id="hero-email-status"
        role="status"
        aria-live="polite"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-2xs)',
          letterSpacing: 'var(--ls-wide)',
          color: status === 'error' ? 'var(--danger-fg)' : 'var(--pc-cyan)',
          margin: '14px 0 0',
          minHeight: 16,
        }}
      >
        {message}
      </p>
    </div>
  );
}
