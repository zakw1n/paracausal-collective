import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { pageTitle, site, socials } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import { metaText as socialLink } from '@/components/ds/styles';

export const metadata: Metadata = {
  title: pageTitle('Contact'),
  description: 'Get in touch with Paracausal Collective. Bookings, collaborations and enquiries.',
};

const label = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: '0 0 10px',
} as const;

export default function ContactPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1080, margin: '0 auto' }}>
      <PageHeader eyebrow="Reach out" title="CONTACT" gap={52} />

      <div className="rd-contact">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div>
            <p style={label}>Email</p>
            <a href={`mailto:${site.email}`} style={{ color: '#fff', fontSize: 15, letterSpacing: '0.02em' }}>
              {site.email}
            </a>
          </div>

          <div>
            <p style={label}>Location</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Cape Town, South Africa</p>
          </div>

          <div>
            <p style={{ ...label, margin: '0 0 14px' }}>Socials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {socials.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener" style={socialLink}>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
