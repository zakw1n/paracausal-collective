/** Shared site content for the Paracausal redesign. */

/**
 * Every string that names or describes the collective. Edit copy HERE, not in a
 * page — before this existed the tagline lived in both the hero and the
 * metadata, and the footer blurb had already drifted from the Open Graph one.
 */
export const site = {
  name: 'Paracausal',
  legalName: 'Paracausal Collective',
  location: 'Cape Town',
  locationLong: 'Cape Town, South Africa',
  founded: '2023',
  email: 'paracausalevents@gmail.com',
  /** Hero sub-headline, and the base of the site-wide metadata description. */
  tagline:
    'A collective pushing high-energy psychedelic music to a generation chasing deeper realms of consciousness.',
  /** Open Graph description and the footer blurb. */
  blurb: 'Underground psychedelic experiences. Cape Town, South Africa. Existing at the edge of perception.',
  /** The About page pull quote. */
  pullQuote: 'Existing at the edge of perception.',
  /**
   * The home page's short telling of the origin story. The About page tells the
   * same story at length in its own `chapters` — that version is deliberately
   * separate, since it is prose rather than a reusable string.
   */
  manifesto: [
    'Darker frequencies for deeper realms. What started as a group of friends chasing the wonders of psychedelic music quickly grew into a key player in psytrance adoption in Cape Town.',
    'Paracausal began with a vision — to create a space where people can experience the freedom of psytrance, and liberate themselves to the music.',
  ],
} as const;

/** `Events — Paracausal`. Every page title goes through this. */
export const pageTitle = (label: string) => `${label} — ${site.name}`;

/** Byline used under the About pull quote and in the footer's legal row. */
export const byline = `${site.legalName} · ${site.location}`;

export const TICKETS_URL = 'https://qkt.io/afterlight';

/** Stand-in art wherever a photo has not been sourced yet. */
export const PLACEHOLDER_IMAGE = '/logo/sphere.png';

/**
 * Video lives in the Cloudflare R2 bucket behind cdn.paracausal.world, never in
 * public/ — a committed video is permanent in git history, and a single 21MB
 * clip was most of this repo's size before the bucket existed. Full-resolution
 * photos go in the bucket too; next.config.ts allows the host under
 * `images.remotePatterns` so next/image can resize them per breakpoint. Poster
 * frames stay local — they are tens of KB and are already tile-sized.
 *
 * Upload web encodes only. The camera master is H.265 in a .mov, which Firefox
 * cannot play at all and Chrome only sometimes — always transcode to H.264 mp4
 * with `-movflags +faststart` before it goes in the bucket.
 */
export const MEDIA_CDN = 'https://cdn.paracausal.world';

/** URL for a file in the media bucket: `cdn('dendrite.mp4')`. */
export const cdn = (file: string) => `${MEDIA_CDN}/${file}`;

/**
 * Cloudflare Stream account subdomain — the `customer-<code>` prefix on every
 * embed URL in the Stream dashboard. One per account, shared by all videos.
 */
export const STREAM_CUSTOMER = 'customer-fisgq15gyusdnnta';

/**
 * Adaptive HLS manifest for a Stream video id, played by components/StreamVideo.
 *
 * Full-length video goes through Stream rather than the R2 bucket because a
 * bucket serves one fixed encode to everyone: a bitrate low enough for phone
 * data is already below what a desktop connection could carry. Stream builds a
 * ladder from the master and the player picks per connection. Short silent
 * loops stay on R2 — they are under a megabyte, and Stream bills per minute
 * delivered, which is a poor trade for decoration.
 */
export const streamHls = (uid: string) =>
  `https://${STREAM_CUSTOMER}.cloudflarestream.com/${uid}/manifest/video.m3u8`;

/** Stream video id for the AFTERLIGHT V recap. Shown as "Video ID" in the dashboard. */
export const DENDRITE_UID = '5e069a230fbf13443f84ae14e0c1a33b';

/** Stream video id for the Kandala set, filmed at AFTERLIGHT V. */
export const KANDALA_UID = '223a3139593a31624a5d49c15c533bba';

/** Stream video id for the Ajitu set, filmed at AFTERLIGHT V. */
export const AJITU_UID = '84973006dda46b5ac44f0605cdd1f6d9';

/** Stream video id for the second Ajitu clip, uploaded as keeno-2.mp4. */
export const AJITU_II_UID = 'a837fee3cf104c62264b863da2d795e8';

/**
 * The clip fronting both the home-page gallery teaser and the gallery grid.
 * The two lay it out differently — the home tile runs title and date together,
 * the grid stacks them — so both parts are exposed alongside the joined form.
 */
export type GalleryClip = {
  /** Silent autoplay loop. Plays on page load, so keep it under ~1MB. */
  src: string;
  /** Full clip, played in the lightbox. Adaptive, and fetched only on click. */
  fullSrc: string;
  /** First frame, shown while the loop buffers and behind the lightbox video. */
  poster: string;
  title: string;
  date: string;
  /** Title and date joined, for the single-line home-page tile. */
  caption: string;
};

/** Builds a clip, deriving the joined caption so the two never drift apart. */
const galleryClip = (c: Omit<GalleryClip, 'caption'>): GalleryClip => ({
  ...c,
  caption: `${c.title} · ${c.date}`,
});

export const featuredClip = galleryClip({
  src: cdn('dendrite-loop-v2.mp4'),
  fullSrc: streamHls(DENDRITE_UID),
  poster: '/gallery/dendrite-poster.jpg',
  title: 'DENDRITE',
  date: 'Aug 2026',
});

/**
 * The loop behind the home page hero. It is the featured clip's tile encode,
 * which is soft at full-screen size; point `src` and `poster` at a dedicated
 * higher-quality loop here when one exists and nothing else needs to change.
 */
export const heroLoop = { src: featuredClip.src, poster: featuredClip.poster };

const kandalaClip = galleryClip({
  src: cdn('kandala-loop.mp4'),
  fullSrc: streamHls(KANDALA_UID),
  poster: '/gallery/kandala-poster.jpg',
  title: 'KANDALA',
  date: 'Aug 2026',
});

const ajituClip = galleryClip({
  src: cdn('ajitu-loop.mp4'),
  fullSrc: streamHls(AJITU_UID),
  poster: '/gallery/ajitu-poster.jpg',
  title: 'AJITU',
  date: 'Aug 2026',
});

/**
 * Video tiles in display order. `featuredClip` stays exported on its own
 * because the home page teases that one clip specifically.
 */
const ajituIIClip = galleryClip({
  src: cdn('ajitu2-loop.mp4'),
  fullSrc: streamHls(AJITU_II_UID),
  poster: '/gallery/ajitu2-poster.jpg',
  title: 'AJITU II',
  date: 'Aug 2026',
});

export const galleryClips: GalleryClip[] = [featuredClip, kandalaClip, ajituClip, ajituIIClip];

/** A still from the bucket, shown as a grid tile and opened full-size on click. */
export type GalleryPhoto = {
  /** Full-resolution original. next/image derives the tile and lightbox sizes. */
  src: string;
  title: string;
  date: string;
  /** Describes the shot for screen readers; never a repeat of the title. */
  alt: string;
  /**
   * Intrinsic pixel size of the original. next/image requires it to reserve
   * layout space, and it is what stops the tile from reflowing on load.
   */
  width: number;
  height: number;
};

/**
 * Stills from AFTERLIGHT V, interleaved with the video tiles so the gallery is
 * not a wall of moving images. Keys are capitalised exactly as they sit in the
 * bucket — R2 keys are case-sensitive, so `smoke.JPG` is not `smoke.jpg`.
 */
const stagePhoto: GalleryPhoto = {
  src: cdn('afterlightVPics/stage.jpg'),
  title: 'STAGE',
  date: 'Aug 2026',
  alt: 'A crowd facing the AFTERLIGHT V stage, built inside a canopy of hand-painted cellular panels in teal, violet and lime, with the Paracausal emblem hung above the DJ archway',
  width: 4160,
  height: 2774,
};

const smokePhoto: GalleryPhoto = {
  src: cdn('afterlightVPics/smoke.JPG'),
  title: 'SMOKE',
  date: 'Aug 2026',
  alt: 'A candid from behind of a dancer with auburn hair tied up, a script neck tattoo and stacked ear piercings, rolling a cigarette in the dark of the AFTERLIGHT V floor',
  width: 4160,
  height: 2774,
};

const boisPhoto: GalleryPhoto = {
  src: cdn('afterlightVPics/bois.jpg'),
  title: 'BOIS',
  date: 'Aug 2026',
  alt: 'Two friends leaning together at the bar, grinning and throwing peace signs, one in a Paracausal tee, fridges of bottles glowing behind them',
  width: 4160,
  height: 2774,
};

const setupPhoto: GalleryPhoto = {
  src: cdn('afterlightVPics/dendrite-setup.JPG'),
  title: 'DENDRITE SETUP',
  date: 'Aug 2026',
  alt: 'Close on the DJ booth at AFTERLIGHT V — a Pioneer CDJ and an Akai MPK Mini over a laptop, hands on the pads, a painted mandala banner lit behind',
  width: 4160,
  height: 2774,
};

export const galleryPhotos: GalleryPhoto[] = [stagePhoto, smokePhoto, boisPhoto, setupPhoto];

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
  { label: 'Facebook',         href: 'https://facebook.com/paracausal' },
] as const;

/* ── Events ─────────────────────────────────────────────────────────────── */

/**
 * Media from a night. Photos and short loops are self-hosted under
 * `public/events/<event id>/`; full-length video is referenced on a streaming
 * host instead of committed to the repo.
 *
 * Why the split: a file in `public/` is one fixed encode served to everyone —
 * good on a desktop or watchable on mobile data, never both. Streaming hosts
 * transcode one master into an adaptive ladder so the player picks the best
 * rendition a connection can carry. Committed video is also permanent, which is
 * why gallery video moved to the bucket — see MEDIA_CDN above.
 */
export type EventMedia =
  | {
      type: 'photo';
      /** Path under public/, e.g. '/events/afterlight-iv/01.jpg'. */
      src: string;
      caption?: string;
    }
  | {
      type: 'video';
      /** Self-hosted file. Keep these short and small — silent loops, not full sets. */
      src: string;
      /** Poster frame; falls back to the sphere placeholder. */
      thumb?: string;
      caption?: string;
    }
  | {
      type: 'stream';
      provider: StreamProvider;
      /** The host's video/playback id. */
      id: string;
      /**
       * Account-scoped prefix the embed URL needs:
       * Cloudflare — the `customer-<code>` subdomain; Bunny — the library id.
       * Mux ignores it.
       */
      account?: string;
      /**
       * Local poster frame under public/, e.g. '/events/<id>/recap-still.jpg'.
       * Deliberately local: a remote thumbnail would need `images.remotePatterns`
       * in next.config.ts before next/image would load it.
       */
      thumb?: string;
      caption?: string;
    };

export type StreamProvider = 'cloudflare' | 'mux' | 'bunny';

/**
 * Embed URL for a hosted video.
 *
 * Verify the shape against the provider's current docs when you pick one —
 * these are the published formats, but they are the provider's to change, and
 * this is the single place to correct them.
 */
export function streamEmbedUrl(media: Extract<EventMedia, { type: 'stream' }>): string {
  switch (media.provider) {
    case 'cloudflare':
      return `https://${media.account}.cloudflarestream.com/${media.id}/iframe`;
    case 'bunny':
      return `https://iframe.mediadelivery.net/embed/${media.account}/${media.id}`;
    case 'mux':
      return `https://player.mux.com/${media.id}`;
  }
}

export type SiteEvent = {
  /** Stable slug. React key, route segment (/events/<id>), and the foreign key from `Artist.eventIds`. */
  id: string;
  title: string;
  date: string;
  venue: string;
  /** Street address. Fill these in — most past nights only have a city. */
  address?: string;
  banner: string;
  genre: string;
  status: 'upcoming' | 'past';
  /** Upcoming nights only. */
  time?: string;
  meta?: string;
  media?: EventMedia[];
};

const afterlightV: SiteEvent = {
  id: 'afterlight-v',
  title: 'AFTERLIGHT V',
  date: '29.08.26',
  venue: 'EVØL Nightclub, 69 Hope St',
  address: 'EVØL Nightclub, 69 Hope St, Gardens, Cape Town',
  banner: '/events/afterlight-v-banner.jpeg',
  genre: 'Hi-tech',
  status: 'past',
  time: '21:00 till late',
  meta: 'Doors 21:00 · 18+ · R150',
};

/**
 * Every Paracausal night, newest first. Add `address` and `media` as you gather them;
 * media files go in `public/events/<id>/`.
 */
export const events: SiteEvent[] = [
  afterlightV,
  { id: 'afterlight-iv',  title: 'AFTERLIGHT IV',  date: 'NOV 2025', venue: 'Cape Town',          banner: '/events/afterlight-iv-banner.webp',  genre: 'Hi-tech',   status: 'past' },
  { id: 'afterlight-iii', title: 'AFTERLIGHT III', date: 'JUN 2025', venue: 'Cape Town',          banner: '/events/afterlight-iii-banner.jpeg', genre: 'Dark psy',  status: 'past' },
  { id: 'afterlight-ii',  title: 'AFTERLIGHT II',  date: 'FEB 2025', venue: 'Cape Town',          banner: '/events/afterlight-ii-banner.jpeg',  genre: 'Forest',    status: 'past' },
  { id: 'afterlight-i',   title: 'AFTERLIGHT I',   date: 'OCT 2024', venue: 'Cape Town',          banner: '/events/afterlight-i-banner.png',    genre: 'Psytrance', status: 'past' },
  { id: 'boilah-room',    title: '“BØILAH ROOM”',  date: '05.12.24', venue: 'Hexagon Night Club', banner: '/events/boilah-room-banner.jpeg',    genre: 'Hi-tech',   status: 'past' },
];

/**
 * The next night, or undefined when nothing is scheduled.
 *
 * Everything that sells tickets keys off this: when it is undefined the hero
 * becomes an announcement placeholder and the ticket CTAs hide themselves,
 * so the site never advertises a night that has already happened. Set an
 * event's `status` to 'upcoming' and it all lights back up.
 */
export const upcomingEvent: SiteEvent | undefined = events.find((event) => event.status === 'upcoming');

/** Archive, newest first. */
export const pastEvents: SiteEvent[] = events.filter((event) => event.status === 'past');

const eventsById = new Map(events.map((event) => [event.id, event]));

export function eventById(id: string): SiteEvent | undefined {
  return eventsById.get(id);
}

export const galleryStubs = [
  { title: 'Afterlight IV' },
  { title: 'Voidwalker' },
  { title: 'Threshold' },
  { title: 'Afterlight III' },
];

/** A clip or photo on the gallery wall, tagged so a tile can render each kind. */
export type GalleryMedia = ({ kind: 'clip' } & GalleryClip) | ({ kind: 'photo' } & GalleryPhoto);

/**
 * Every gallery item in display order — the wall, the home page strip and the
 * lightbox all follow it. Photos and clips are dealt alternately, photo first,
 * so no two clips sit side by side; if one kind outnumbers the other its
 * surplus trails at the end, the only place like tiles can then meet.
 */
export const galleryMedia: GalleryMedia[] = (() => {
  const out: GalleryMedia[] = [];
  for (let i = 0; i < Math.max(galleryPhotos.length, galleryClips.length); i++) {
    if (galleryPhotos[i]) out.push({ kind: 'photo', ...galleryPhotos[i] });
    if (galleryClips[i]) out.push({ kind: 'clip', ...galleryClips[i] });
  }
  return out;
})();

/**
 * Empty cells that close out the gallery wall. The wall runs three or four
 * tiles across depending on width, so it is padded to a multiple of twelve and
 * the last row is full either way. Placeholders vanish one for one as media is
 * added.
 */
export const galleryPlaceholders = (12 - (galleryMedia.length % 12)) % 12;

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
  /** Reuses the genre vocabulary from `events` — Hi-tech, Dark psy, Forest, Psytrance. */
  genre: string;
  location?: string;
  /** Omit until a press shot is sourced; ArtistCard falls back to an initials tile. */
  photo?: string;
  links?: { soundcloud?: string; instagram?: string; ra?: string };
  /** ids from `events`. */
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

/** Nights this artist has played, newest first. */
export function eventsForArtist(artist: Artist): SiteEvent[] {
  return artist.eventIds
    .map((id) => eventsById.get(id))
    .filter((event): event is SiteEvent => event !== undefined);
}

/** Lineup for a night, in roster order. */
export function artistsForEvent(eventId: string): Artist[] {
  return artists.filter((artist) => artist.eventIds.includes(eventId));
}
