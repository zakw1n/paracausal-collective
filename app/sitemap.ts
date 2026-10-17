import type { MetadataRoute } from 'next';
import { SITE_URL, events, navLinks } from '@/lib/site';

/** Every page in the navigation, plus each night's page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navLinks.map((link) => ({ url: `${SITE_URL}${link.href === '/' ? '' : link.href}` })),
    { url: `${SITE_URL}/experience` },
    ...events.map((event) => ({ url: `${SITE_URL}/events/${event.id}` })),
  ];
}
