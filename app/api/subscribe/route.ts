import { Resend } from 'resend';

import { site } from '@/lib/site';

/**
 * Mailing-list signup for the home hero.
 *
 * The address goes into the Resend audience provisioned through the Vercel
 * Marketplace integration (RESEND_* env vars come from that integration; the
 * audience id was created once against the same account). The welcome mail is
 * best-effort: until the sending domain finishes DNS verification Resend
 * rejects the send, and a failed welcome must not lose the subscriber.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return Response.json({ error: 'Signup is not configured.' }, { status: 500 });
  }

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const address = email.trim().toLowerCase();
  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.create({
    audienceId,
    email: address,
    unsubscribed: false,
  });

  if (error) {
    console.error('[subscribe] contact create failed', error);
    return Response.json({ error: 'Could not add you to the list. Try again.' }, { status: 502 });
  }

  const domain = process.env.RESEND_EMAIL_DOMAIN;
  if (domain) {
    const welcome = await resend.emails.send({
      from: `${site.name} <hello@${domain}>`,
      to: [address],
      subject: `You're on the list — ${site.name}`,
      text: [
        `You're on the list.`,
        '',
        `We'll send you the next ${site.name} date before it goes public — lineups, venues, and first access to tickets. Nothing else.`,
        '',
        site.location,
      ].join('\n'),
    });
    if (welcome.error) console.error('[subscribe] welcome email failed', welcome.error);
  }

  return Response.json({ ok: true });
}
