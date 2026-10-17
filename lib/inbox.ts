import { Resend } from 'resend';

import { site } from '@/lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates a form posted to one of the inbox routes (app/api/enquiry,
 * app/api/contact) and mails it to the collective's own inbox through Resend,
 * with the sender as reply-to so answering the mail answers them. Nothing is
 * stored: a failed send is reported back, and the forms then offer to open the
 * same details in the visitor's own mail app.
 *
 * `fields` maps each required field name to its label in the mail, in order.
 * One of them must be `email`.
 */
export async function forwardToInbox(
  request: Request,
  { fields, from, subject }: {
    fields: Record<string, string>;
    /** Display name on the From line. */
    from: string;
    subject: (values: Record<string, string>) => string;
  },
): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const domain = process.env.RESEND_EMAIL_DOMAIN;
  if (!apiKey || !domain) {
    return Response.json({ error: 'Sending is not configured.' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  // Valid JSON that is not an object (`null`, a number) used to throw below.
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const values: Record<string, string> = {};
  for (const [key, label] of Object.entries(fields)) {
    const value = body[key];
    if (typeof value !== 'string' || !value.trim()) {
      return Response.json({ error: `Add the ${label.toLowerCase()}.` }, { status: 400 });
    }
    values[key] = value.trim().slice(0, 4000);
  }
  if (!EMAIL_RE.test(values.email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: `${from} <hello@${domain}>`,
    to: [site.email],
    replyTo: values.email,
    // Line breaks never belong in a subject line; fold them to spaces.
    subject: subject(values).replace(/[\r\n]+/g, ' '),
    text: Object.entries(fields).map(([key, label]) => `${label}: ${values[key]}`).join('\n'),
  });

  if (error) {
    console.error(`[inbox] ${from} send failed`, error);
    return Response.json({ error: 'Could not send.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
