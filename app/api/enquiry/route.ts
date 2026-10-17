import { forwardToInbox } from '@/lib/inbox';
import { site } from '@/lib/site';

/** Event enquiries from the Paracausal Private page. See lib/inbox.ts. */
export function POST(request: Request) {
  return forwardToInbox(request, {
    fields: { name: 'Name', email: 'Email', date: 'Date', venue: 'Venue', guests: 'Guests', vibe: 'Vibe' },
    from: `${site.name} Private`,
    subject: (v) => `Private event enquiry — ${v.date}, ${v.venue}`,
  });
}
