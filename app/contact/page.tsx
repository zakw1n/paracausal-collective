import type { Metadata } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSoundcloud, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { pageTitle, site, socials, pageMeta } from '@/lib/site';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = pageMeta({
  title: pageTitle('Contact'),
  description: 'Get in touch with Paracausal Collective. Bookings, collaborations and enquiries.',
  path: '/contact',
});

const label = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '0 0 10px',
} as const;

const socialIcons = {
  Instagram: faInstagram,
  SoundCloud: faSoundcloud,
  Facebook: faSquareFacebook,
} as const;

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: '100svh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: '120px clamp(20px,5vw,64px) 110px',
        maxWidth: 1080,
        margin: '0 auto',
      }}
    >
      <PageHeader title="CONTACT" gap={52} />

      {/* The heading stays where every page has it; the details centre in the space below. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, textAlign: 'center' }}>
        <div>
          <p style={label}>Email</p>
          <a href={`mailto:${site.email}`} style={{ color: '#fff', fontSize: 15, letterSpacing: '0.02em' }}>
            {site.email}
          </a>
        </div>

        <div>
          <p style={label}>Phone</p>
          <a href={site.phoneHref} style={{ color: '#fff', fontSize: 15, letterSpacing: '0.02em' }}>
            {site.phone}
          </a>
        </div>

        <div>
          <p style={label}>Location</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Cape Town, South Africa</p>
        </div>

        <div>
          <p style={{ ...label, margin: '0 0 14px' }}>Socials</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
            {socials.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noopener" aria-label={social.label} title={social.label} style={{ color: '#fff', fontSize: 26, lineHeight: 1 }}>
                <FontAwesomeIcon icon={socialIcons[social.label]} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
