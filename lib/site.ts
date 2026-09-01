/** Shared site content for the Paracausal redesign. */

export const TICKETS_URL = 'https://qkt.io/afterlight';

export const navLinks = [
  { label: 'Home',    href: '/' },
  { label: 'Events',  href: '/events' },
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
  title: string;
  date: string;
  venue: string;
  banner: string;
  genre: string;
};

export const pastEvents: PastEvent[] = [
  { title: 'AFTERLIGHT IV',  date: 'NOV 2025', venue: 'Cape Town',          banner: '/events/afterlight-iv-banner.webp',  genre: 'Hi-tech' },
  { title: 'AFTERLIGHT III', date: 'JUN 2025', venue: 'Cape Town',          banner: '/events/afterlight-iii-banner.jpeg', genre: 'Dark psy' },
  { title: 'AFTERLIGHT II',  date: 'FEB 2025', venue: 'Cape Town',          banner: '/events/afterlight-ii-banner.jpeg',  genre: 'Forest' },
  { title: 'AFTERLIGHT I',   date: 'OCT 2024', venue: 'Cape Town',          banner: '/events/afterlight-i-banner.png',    genre: 'Psytrance' },
  { title: '“BØILAH ROOM”',  date: '05.12.24', venue: 'Hexagon Night Club', banner: '/events/boilah-room-banner.jpeg',    genre: 'Hi-tech' },
];

export const galleryStubs = [
  { title: 'Afterlight IV' },
  { title: 'Voidwalker' },
  { title: 'Threshold' },
  { title: 'Afterlight III' },
];
