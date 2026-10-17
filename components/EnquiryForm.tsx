'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/components/ds/Button';
import { site } from '@/lib/site';

const field = { height: 46, padding: '0 14px' } as const;

const note = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  margin: 0,
} as const;

/**
 * The Paracausal Private enquiry: who, when, where, how many and the vibe.
 * Posts to app/api/enquiry. If that fails the same details are offered as a
 * pre-filled email, so an enquiry is never lost to a sending problem.
 */
export default function EnquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [details, setDetails] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setDetails(values);
    setState('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setState(res.ok ? 'sent' : 'failed');
    } catch {
      setState('failed');
    }
  };

  if (state === 'sent') {
    return (
      <div
        role="status"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 18,
          padding: '60px 20px',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--r-lg)',
          boxShadow: 'var(--glow-soft)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid var(--pc-cyan)',
            borderRadius: '50%',
            boxShadow: 'var(--glow-cyan)',
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--pc-cyan)" strokeWidth="1.6" aria-hidden="true">
            <polyline points="4 12 9 17 20 6" />
          </svg>
        </div>
        <p style={{ ...note, letterSpacing: 'var(--ls-widest)', color: 'var(--pc-cyan)' }}>Enquiry sent</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
          Thanks{details.name ? `, ${details.name.split(' ')[0]}` : ''}. We&rsquo;ll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent('Private event enquiry')}&body=${encodeURIComponent(
    Object.entries(details).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`).join('\n'),
  )}`;

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="rd-form-row">
        <input required name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" className="rd-field" style={field} />
        <input required name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-label="Email" className="rd-field" style={field} />
      </div>

      <div className="rd-form-row">
        <label className="rd-enquiry-label">
          <span>Date</span>
          <input required name="date" type="date" className="rd-field" style={{ ...field, colorScheme: 'dark' }} />
        </label>
        <label className="rd-enquiry-label">
          <span>Guests</span>
          <input required name="guests" type="number" min={1} inputMode="numeric" placeholder="e.g. 120" className="rd-field" style={field} />
        </label>
      </div>

      <input required name="venue" placeholder="Venue" aria-label="Venue" className="rd-field" style={field} />

      <textarea
        required
        name="vibe"
        rows={4}
        placeholder="The vibe you want — e.g. relaxed jazz over dinner, then a packed dance floor"
        aria-label="The vibe you want"
        className="rd-field"
        style={{ padding: '12px 14px', resize: 'none' }}
      />

      <Button size="lg" variant="primary" block type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </Button>

      {state === 'failed' ? (
        <p role="alert" style={{ ...note, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.8 }}>
          That didn&rsquo;t send.{' '}
          <a href={mailto} style={{ color: 'var(--pc-cyan)' }}>Email it to us instead</a>
        </p>
      ) : (
        <p style={{ ...note, fontSize: 9, color: 'var(--text-faint)', textAlign: 'center' }}>We reply within 48 hours</p>
      )}
    </form>
  );
}
