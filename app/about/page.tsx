import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { galleryPhotos, pageTitle, pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: pageTitle('About'),
  description: 'A Cape Town psytrance collective. From house parties to secret beach raves to a residency at EVØL Nightclub.',
  path: '/about',
});

/* Built from "About Page v2" in the Paracausal Claude Design project
   (ui_kits/website/About Page v2.html). Its team-photo slot was an empty
   placeholder, filled here from the gallery. The design's photo banner was
   swapped for the centred page heading the other pages use. */
const [, , bois] = galleryPhotos;

const intro = [
  'What started as a group of friends enjoying the wonders of psychedelic music, quickly grew into a key player in psytrance adoption in Cape Town.',
  'Paracausal started with a vision, and that vision was to create a space where people can experience the freedom of psytrance, and liberate themselves to the music.',
  'From house parties, to secret beach raves, we now find ourselves with a residency at Evol Nightclub, where we have the privilege of sharing our AFTERLIGHT series with Cape Town’s youth.',
];

const offers = [
  {
    eyebrow: 'Paracausal',
    title: 'Events',
    body: 'High energy, dark psychedelic trance. Our AFTERLIGHT series runs as a residency at Evol Nightclub.',
    link: { label: 'Upcoming events', href: '/events' },
  },
  {
    eyebrow: 'Paracausal Private',
    title: 'Private hire',
    body: 'DJs, sound and atmosphere for private and corporate events. Weddings · Corporate · Golf days · Private parties.',
    link: { label: 'Get in touch', href: '/contact' },
  },
];

export default function AboutPage() {
  return (
    <main className="rd-page">
      <header style={{ padding: '120px clamp(20px,5vw,64px) 0' }}>
        <PageHeader title="ABOUT" gap={0} />
      </header>

      <section className="rd-page-wrap rd-page-intro" style={{ paddingTop: 56 }}>
        <div className="rd-page-photo">
          <Image src={bois.src} alt={bois.alt} fill sizes="(max-width: 800px) 100vw, 560px" quality={90} style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <h2>This is Paracausal</h2>
          {intro.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </section>

      <section className="rd-page-wrap rd-page-offer">
        {offers.map((offer) => (
          <div key={offer.title}>
            <span className="rd-page-mono">{offer.eyebrow}</span>
            <h3>{offer.title}</h3>
            <p>{offer.body}</p>
            <Link href={offer.link.href}>{offer.link.label} &rarr;</Link>
          </div>
        ))}
      </section>

    </main>
  );
}
