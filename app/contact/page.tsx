import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { socials } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact — Paracausal',
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

const socialLink = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: 'var(--ls-wide)',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)',
} as const;

export default function ContactPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1080, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--pc-cyan)', margin: '0 0 16px' }}>
        Reach out
      </p>
      <h1 style={{ fontFamily: 'var(--font-techno)', fontWeight: 800, color: '#fff', margin: '0 0 52px', lineHeight: 0.95, fontSize: 'clamp(2.6rem,8vw,6rem)' }}>
        GET IN<br /><span style={{ color: 'var(--text-faint)' }}>TOUCH</span>
      </h1>

      <div className="rd-contact">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div>
            <p style={label}>Email</p>
            <a href="mailto:paracausalevents@gmail.com" style={{ color: '#fff', fontSize: 15, letterSpacing: '0.02em' }}>
              paracausalevents@gmail.com
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
