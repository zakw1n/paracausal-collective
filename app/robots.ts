import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Crawlable on the production deploy only; preview builds (demo.paracausal.world) are closed off. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
