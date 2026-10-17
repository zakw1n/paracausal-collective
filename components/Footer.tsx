import Image from 'next/image';
import Link from 'next/link';
import { byline, navLinks, site, socials } from '@/lib/site';

/** The Explore column: the main pages, without Contact. */
const explore = navLinks.filter((link) => link.href !== '/contact');

/**
 * Site footer, from "Footer Redesign" option 1c in the Claude Design project:
 * four columns, then the legal line.
 */
export default function Footer() {
  return (
    <footer className="rd-foot">
      <div className="rd-foot-cols">
        <div>
          <Image src="/logo.png" alt={site.name} width={131} height={22} className="rd-foot-logo" />
          <p className="rd-foot-blurb">{site.blurb}</p>
        </div>
        <div>
          <h2>Explore</h2>
          <ul>
            {explore.map((link) => (
              <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Follow</h2>
          <ul>
            {socials.map((social) => (
              <li key={social.href}><a href={social.href} target="_blank" rel="noopener">{social.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Get in touch</h2>
          <ul>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
          </ul>
        </div>
      </div>

      <div className="rd-foot-legal">
        <span>{`© ${new Date().getFullYear()} ${byline}`}</span>
        <span>All experiences are at your own risk</span>
      </div>
    </footer>
  );
}
