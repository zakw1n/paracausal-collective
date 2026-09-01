/** Shared site content for the Paracausal redesign. */

export const TICKETS_URL = 'https://qkt.io/afterlight';

export const navLinks = [
  { label: 'Home',    href: '/' },
  { label: 'Events',  href: '/events' },
  { label: 'Artists', href: '/artists' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const socials = [
  { label: 'Instagram',        href: 'https://instagram.com/paracausal' },
  { label: 'SoundCloud',       href: 'https://soundcloud.com/paracausal' },
  { label: 'Resident Advisor', href: 'https://ra.co/promoters/paracausal' },
  { label: 'Facebook',         href: 'https://facebook.com/paracausal' },
] as const;

export const upcomingEvent = {
  title: 'AFTERLIGHT V',
  date: '29.08.26',
  venue: 'EVØL Nightclub, 69 Hope St',
  time: '21:00 till late',
  meta: 'Doors 21:00 · 18+ · R150',
  banner: '/events/afterlight-v-banner.jpeg',
};

export type PastEvent = {
  /** Stable slug. Used as the React key and as the foreign key from `Artist.eventIds`. */
  id: string;
  title: string;
  date: string;
  venue: string;
  banner: string;
  genre: string;
};

export const pastEvents: PastEvent[] = [
  { id: 'afterlight-iv',  title: 'AFTERLIGHT IV',  date: 'NOV 2025', venue: 'Cape Town',          banner: '/events/afterlight-iv-banner.webp',  genre: 'Hi-tech' },
  { id: 'afterlight-iii', title: 'AFTERLIGHT III', date: 'JUN 2025', venue: 'Cape Town',          banner: '/events/afterlight-iii-banner.jpeg', genre: 'Dark psy' },
  { id: 'afterlight-ii',  title: 'AFTERLIGHT II',  date: 'FEB 2025', venue: 'Cape Town',          banner: '/events/afterlight-ii-banner.jpeg',  genre: 'Forest' },
  { id: 'afterlight-i',   title: 'AFTERLIGHT I',   date: 'OCT 2024', venue: 'Cape Town',          banner: '/events/afterlight-i-banner.png',    genre: 'Psytrance' },
  { id: 'boilah-room',    title: '“BØILAH ROOM”',  date: '05.12.24', venue: 'Hexagon Night Club', banner: '/events/boilah-room-banner.jpeg',    genre: 'Hi-tech' },
];

export const galleryStubs = [
  { title: 'Afterlight IV' },
  { title: 'Voidwalker' },
  { title: 'Threshold' },
  { title: 'Afterlight III' },
];

/* ── Artists ────────────────────────────────────────────────────────────────
   Public roster of DJs who have PLAYED a Paracausal night.

   DO NOT add artists you only want to book here. This module is imported by
   client components, so every entry is bundled into the JS served to the
   browser — it ships to the public whether or not the page renders it.
   Filtering a wishlist out of the JSX does not hide it. A future booking list
   needs a server-only module or a store outside this repo.
   ─────────────────────────────────────────────────────────────────────────── */

export type Artist = {
  /** Slug, e.g. 'voidwalker'. Also the press-photo filename: /artists/<id>.jpg */
  id: string;
  name: string;
  /** Reuses the genre vocabulary from `pastEvents` — Hi-tech, Dark psy, Forest, Psytrance. */
  genre: string;
  location?: string;
  /** Omit until a press shot is sourced; ArtistCard falls back to an initials tile. */
  photo?: string;
  links?: { soundcloud?: string; instagram?: string; ra?: string };
  /** ids from `pastEvents`. */
  eventIds: string[];
};

/**
 * Add real artists here. Template:
 *
 *   {
 *     id: 'voidwalker',
 *     name: 'Voidwalker',
 *     genre: 'Dark psy',
 *     location: 'Cape Town',
 *     photo: '/artists/voidwalker.jpg',
 *     links: { soundcloud: 'https://soundcloud.com/…', instagram: 'https://instagram.com/…' },
 *     eventIds: ['afterlight-iv', 'afterlight-ii'],
 *   },
 */
export const artists: Artist[] = [];

const eventById = new Map(pastEvents.map((event) => [event.id, event]));

/** Nights this artist has played, in `pastEvents` order (newest first). */
export function eventsForArtist(artist: Artist): PastEvent[] {
  return artist.eventIds
    .map((id) => eventById.get(id))
    .filter((event): event is PastEvent => event !== undefined);
}

/** Lineup for a past night, in roster order. */
export function artistsForEvent(eventId: string): Artist[] {
  return artists.filter((artist) => artist.eventIds.includes(eventId));
}
