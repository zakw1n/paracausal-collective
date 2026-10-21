'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@/components/ds/Button';
import { site } from '@/lib/site';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  /** Set when the send failed: a mailto: link carrying the same message. */
  const [fallback, setFallback] = useState<string | null>(null);

  // Posts to app/api/contact, the same route as the footer's contact band.
  // The topic goes at the head of the message, which is all the route takes.
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, topic, message } = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = `[${topic}]\n\n${message}`;
    setSending(true);
    setFallback(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: body }),
      });
      if (res.ok) setSent(true);
      else throw new Error();
    } catch {
      setFallback(`mailto:${site.email}?subject=${encodeURIComponent(`${topic} — ${name}`)}&body=${encodeURIComponent(message)}`);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--pc-cyan)" strokeWidth="1.6">
            <polyline points="4 12 9 17 20 6" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--pc-cyan)', margin: 0 }}>
          Message sent
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>We&rsquo;ll answer within 48 hours.</p>
        <button
          onClick={() => setSent(false)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-2xs)',
            letterSpacing: 'var(--ls-wide)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 4px' }}>
        Send a message
      </p>

      <div className="rd-form-row">
        <input required name="name" placeholder="Your name" className="rd-field" style={{ height: 46, padding: '0 14px' }} />
        <input required name="email" type="email" placeholder="you@example.com" className="rd-field" style={{ height: 46, padding: '0 14px' }} />
      </div>

      <select name="topic" className="rd-field" style={{ height: 46, padding: '0 12px', color: 'var(--text-secondary)' }}>
        <option style={{ background: '#0A0C12' }}>General enquiry</option>
        <option style={{ background: '#0A0C12' }}>Booking / collaboration</option>
        <option style={{ background: '#0A0C12' }}>Feedback</option>
        <option style={{ background: '#0A0C12' }}>Other</option>
      </select>

      <textarea required name="message" rows={6} placeholder="Write your message here..." className="rd-field" style={{ padding: '12px 14px', resize: 'none' }} />

      <Button size="lg" variant="primary" block type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</Button>

      {fallback && (
        <p role="alert" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
          That didn&rsquo;t send. <a href={fallback} style={{ color: 'var(--pc-cyan)' }}>Email it to us instead</a>
        </p>
      )}

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center', margin: 0 }}>
        We aim to respond within 48 hours
      </p>
    </form>
  );
}
