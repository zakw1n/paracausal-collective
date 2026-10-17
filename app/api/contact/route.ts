import { forwardToInbox } from '@/lib/inbox';
import { site } from '@/lib/site';

/** Messages from the footer's contact band and the Contact page. See lib/inbox.ts. */
export function POST(request: Request) {
  return forwardToInbox(request, {
    fields: { name: 'Name', email: 'Email', message: 'Message' },
    from: `${site.name} Website`,
    subject: (v) => `Message from ${v.name}`,
  });
}
