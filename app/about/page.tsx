import type { Metadata } from 'next';
import Image from 'next/image';
import { byline, pageTitle, site, PLACEHOLDER_IMAGE } from '@/lib/site';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: pageTitle('About'),
  description: 'The story of Paracausal: from house parties and secret beach raves to a residency at EVØL Nightclub.',
};

const stats = [
  { value: '2023', label: 'Founded' },
  { value: '12+',  label: 'Events' },
  { value: '3K+',  label: 'Attendees' },
  { value: 'CPT',  label: 'Based in' },
];

const chapters: { heading: string; paragraphs: string[] }[] = [
  {
    heading: 'The vision',
    paragraphs: [
      'What started as a group of friends enjoying the wonders of psychedelic music, quickly grew into a key player in psytrance adoption in Cape Town. Paracausal started with a vision, and that vision was to create a space where people can experience the freedom of psytrance, and liberate themselves to the music. From house parties, to secret beach raves, we now find ourselves with a residency at Evol Nightclub, where we have the privilege of sharing our AFTERLIGHT series with Cape Town’s youth.',
    ],
  },
  {
    heading: 'September 2023 · Colorbox Studios',
    paragraphs: [
      'It all began in September 2023 at a friend’s 21st birthday party. Callum asked us to come DJ at his event at Colorbox Studios. When we saw how many people filled up the space, a fire started inside of us. Seeing a community come together to celebrate life and good music.',
      'We made an Instagram reel out of some videos that we took at the party, and started the Paracausal Instagram account. We wanted to create a platform where people could follow us if they wanted more experiences like these.',
      'Around this time, we were still post covid, and the entire psytrance scene had taken a huge step back from the pandemic. There was a lack of parties and events where the youth could go to experience psytrance music. Since the crew had shared these experiences together, we saw an opportunity to provide these experiences to other people.',
    ],
  },
  {
    heading: 'November · Llandudno beach',
    paragraphs: [
      'It was November. The days were hot, summer was about, and secret raves were becoming the new talk of the town. Everywhere you went on social media, people all around the world were hosting free parties on the beach, in the forest, anywhere. So we decided to host a beach rave by Llandudno. We got speakers from a good friend, sent out a message on the WhatsApp group to let people know what was going down, packed up the car and jetted off to the beach. We were not expecting that many people to show up, they just kept on coming. It was truly an incredible sight to behold. We even had some elders from the community come to show their support. This was a great way to gain trust from the community, by hosting a free party, and expecting nothing in return.',
    ],
  },
  {
    heading: '5.12 · Hexagon',
    paragraphs: [
      'We waited until December to host the first event. In Cape Town, First Thursdays are quite a big thing. For some reason, everyone goes out on the first Thursday of every month, so we chose December 5th to have the party. We hosted it at Hexagon, the last club at the end of Modular. This was a huge step for us, as we had finally found a space to bring our community together. And it was awesome! All of our friends came to support us and dance the night away. Now we had the momentum that we needed to keep this going.',
      'After that, we spent most of the rest of December partying, getting booked for more 21st birthdays, events, networking with people in the scene, and trying to learn as much as possible about the industry. Paracausal took a bit of a break after that.',
    ],
  },
  {
    heading: 'Finding EVØL',
    paragraphs: [
      'Now it was time for us to upgrade. Hexagon was a great venue, but it didn’t have the right infrastructure that we needed to put on a great show for people. So we did some research and found a club in the middle of town called Evol. As soon as we walked in, we knew this was going to be our next home. It had everything we needed to establish a system. This led to the start of the Afterlight series. Now we needed to promote.',
    ],
  },
  {
    heading: 'A darker sound',
    paragraphs: [
      'We wanted to bring a darker sound. The scene at the time already had enough people catering for the lighter side of psytrance, but there was an entire community of people who were looking for something deeper. So we set out to find the DJ’s and artists who were creating the sound we were looking for. We met up with them, set up a camera, and had interviews with them to use for promo. We asked them a bunch of questions about their art, why they started and what we could expect at the event from them. This was advantageous to us and the artist, as we were able to showcase who they are, instead of just their instagram posts, and we were getting traction and views too.',
    ],
  },
  {
    heading: 'Now',
    paragraphs: [
      'Fast forward a few years later, Paracausal now holds a residency at Evol Nightclub, where we continue to deliver in high energy, dark psychedelic trance for a generation chasing deeper realms of consciousness',
    ],
  },
];

const body = {
  color: 'var(--text-secondary)',
  fontSize: 'clamp(15px,1.6vw,17px)',
  lineHeight: 1.85,
  margin: '0 0 22px',
  maxWidth: '68ch',
  textWrap: 'pretty',
} as const;

export default function AboutPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1000, margin: '0 auto' }}>
      <PageHeader eyebrow="Who we are" title="ABOUT" rule />

      {/* Stats strip */}
      <div className="rd-stats" style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 60 }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{ padding: '32px 18px', textAlign: 'center', borderRight: i === stats.length - 1 ? undefined : '1px solid var(--border)' }}
          >
            <p style={{ fontFamily: 'var(--font-techno)', fontStretch: '125%', fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff', margin: 0 }}>{stat.value}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '6px 0 0' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Story chapters */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 56, marginBottom: 64, display: 'flex', flexDirection: 'column', gap: 'clamp(48px,7vw,80px)' }}>
        {chapters.map((chapter, i) => (
          <div key={chapter.heading} className="rd-chapter">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 6 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-widest)', color: 'var(--pc-cyan)', margin: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <div style={{ width: 1, flex: 1, minHeight: 40, background: 'linear-gradient(to bottom, var(--border-accent), transparent)' }} />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 18px' }}>
                {chapter.heading}
              </p>
              {chapter.paragraphs.map((text, j) => (
                <p key={j} style={body}>{text}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pull quote */}
      <div style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(40px,7vw,80px) clamp(24px,5vw,60px)', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--pc-grad-nebula)' }} />
        <Image
          src={PLACEHOLDER_IMAGE}
          alt=""
          width={64}
          height={64}
          style={{ position: 'relative', objectFit: 'contain', opacity: 0.85, filter: 'drop-shadow(0 0 18px rgba(52,231,222,0.5))', marginBottom: 22, animation: 'rd-drift 50s linear infinite' }}
        />
        <p style={{ position: 'relative', fontFamily: 'var(--font-techno)', fontStretch: '125%', fontWeight: 700, color: '#fff', lineHeight: 1.2, fontSize: 'clamp(1.5rem,3.4vw,2.6rem)', margin: 0, letterSpacing: '0.01em', textWrap: 'balance', maxWidth: '14ch', marginInline: 'auto' }}>
          &ldquo;{site.pullQuote}&rdquo;
        </p>
        <p style={{ position: 'relative', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '20px 0 0' }}>
          {byline}
        </p>
      </div>
    </main>
  );
}
