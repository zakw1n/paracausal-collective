'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

/** Pages that already end on a form of their own, where a second would stack under it. */
const OWN_FORM = ['/contact', '/private'];

/**
 * The band that opens the footer: a short message form, posted to
 * app/api/contact. From "Footer Redesign" option 1c in the Claude Design
 * project, where it was a mailing-list signup.
 */
export default function FooterContact() {
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [details, setDetails] = useState<Record<string, string>>({});

  if (OWN_FORM.includes(pathname)) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setDetails(values);
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      setState(res.ok ? 'sent' : 'failed');
    } catch {
      setState('failed');
    }
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Message from ${details.name ?? 'the website'}`)}&body=${encodeURIComponent(details.message ?? '')}`;

  return (
    <section className="rd-footband" aria-labelledby="rd-footband-title">
      <h2 id="rd-footband-title">Let&rsquo;s <em>talk.</em></h2>
      <p>Bookings, collaborations, private events, or just to say hello.</p>

      {state === 'sent' ? (
        <p role="status" className="rd-footband-done">Message sent. We&rsquo;ll reply within 48 hours.</p>
      ) : (
        <form className="rd-footband-form" onSubmit={submit}>
          <div>
            <input required name="name" autoComplete="name" placeholder="Your name" aria-label="Your name" />
            <input required name="email" type="email" autoComplete="email" placeholder="Email address" aria-label="Email address" />
          </div>
          <textarea required name="message" rows={3} placeholder="Your message" aria-label="Your message" />
          <button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
          {state === 'failed' && (
            <p role="alert" className="rd-footband-error">
              That didn&rsquo;t send. <a href={mailto}>Email it to us instead</a>
            </p>
          )}
        </form>
      )}
    </section>
  );
}
