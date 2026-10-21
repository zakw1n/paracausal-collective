import type { Metadata } from 'next';

import ExperienceBar from '@/components/experience/ExperienceBar';
import FlyerStack from '@/components/experience/FlyerStack';
import ScrollCraftMount from '@/components/experience/ScrollCraftMount';
import { TICKETS_URL, cdn, events, pageTitle, site, upcomingEvent, pageMeta } from '@/lib/site';

import './scrollcraft.css';
import './experience.css';

export const metadata: Metadata = pageMeta({
  title: pageTitle('Experience'),
  description: 'Six nights of psychedelic trance in Cape Town, as a single descent.',
  path: '/experience',
});

/**
 * The scroll-driven route.
 *
 * Grammar is a rhythmic cutlist: fourteen short acts that each land whole and
 * cut, no pinning and no dwell. Grounds are painted per section on a hard edge
 * rather than drifted, because a cut is not an interpolation and several short
 * acts are always part-way through at once.
 *
 * The engine is a verbatim copy and is never edited: `scrollcraft.css` sits
 * beside this file and `scrollcraft.js` is served from `public/scrollcraft/`,
 * both byte-identical to the skill's originals. It reads the `data-sc-*`
 * attributes below and drives them. Everything bespoke (the flyer stack, the
 * held bar) is this page's own code.
 */

const ticketsLive = Boolean(upcomingEvent);
const ctaHref = ticketsLive ? TICKETS_URL : '/#hero-email';
const ctaLabel = ticketsLive ? 'Get tickets' : 'Join the list';

const flyers = events.map((event) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  venue: event.venue,
  genre: event.genre,
  banner: event.banner,
}));

const GENRES = ['PSYTRANCE', 'FOREST', 'DARK PSY', 'HI-TECH'];

export default function ExperiencePage() {
  return (
    <>
      <span data-sc-progress />
      <div className="sc-grain" aria-hidden="true" />

      <ExperienceBar ticketsHref={ctaHref} ctaLabel={ctaLabel} />

      <main className="x" id="top">
        {/* 1 · THE ROOM. Already moving when the page lands. No settling shot. */}
        <section className="x-act x-room" data-sc-act="flow">
          <video
            className="x-bleed"
            src={cdn('dendrite-loop-v2.mp4')}
            poster="/gallery/dendrite-poster.jpg"
            muted
            loop
            autoPlay
            playsInline
            aria-hidden="true"
          />
          <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
          <div className="x-room__copy">
            <h1 className="sc-display sc-display--xl" data-sc-kinetic="lines">
              DARKER FREQUENCIES
            </h1>
            <p className="sc-body">{site.location}. Since {site.founded}.</p>
          </div>
        </section>

        {/* 2 · THE NAME. */}
        <section className="x-act x-name" data-sc-act="flow">
          <h2 className="x-wordmark" data-sc-kinetic="chars">
            PARACAUSAL
          </h2>
        </section>

        {/* 3 · THE CLAIM. One sentence, nothing competing with it. */}
        <section className="x-act x-claim" data-sc-act="flow">
          <div className="sc-stack" data-sc-in data-sc-stagger="60">
            <p className="sc-display sc-display--lg">
              A space where people can experience the freedom of psytrance, and liberate themselves to the music.
            </p>
          </div>
        </section>

        {/* 4 · DENDRITE. Full-bleed wipe: a transition, not a fidget. */}
        <section className="x-act x-clip" data-sc-act="flow">
          <div className="x-clip__frame" data-sc-reveal="up" data-sc-reveal-at="0.05 0.45">
            <video
              src={cdn('dendrite-loop-v2.mp4')}
              poster="/gallery/dendrite-poster.jpg"
              muted
              loop
              autoPlay
              playsInline
              aria-hidden="true"
            />
          </div>
          <p className="x-stamp">DENDRITE · AUG 2026</p>
        </section>

        {/* 5 · THE COUNT. Real figures only. */}
        <section className="x-act x-count" data-sc-act="flow">
          <div className="sc-stack" data-sc-in data-sc-stagger="70">
            <p className="x-figure">
              <span data-sc-count="0 6">0</span> NIGHTS
            </p>
            {/* The year is static. A counter on a year renders false years on
                every frame between 0 and the target, and the shoot caught it
                claiming 1522, 1897 and 1992. The quantity below may tick; the
                date may not. */}
            <p className="x-figure x-figure--sub">SINCE {site.founded}</p>
          </div>
        </section>

        {/* 6 · KANDALA. Tighter crop, cut sooner than the first. */}
        <section className="x-act x-clip x-clip--tight" data-sc-act="flow">
          <video
            className="x-bleed"
            src={cdn('kandala-loop.mp4')}
            poster="/gallery/kandala-poster.jpg"
            muted
            loop
            autoPlay
            playsInline
            aria-hidden="true"
          />
          <p className="x-stamp x-stamp--right">KANDALA · AUG 2026</p>
        </section>

        {/* 7 · THE ROLL. Four genres, staggered. */}
        <section className="x-act x-roll" data-sc-act="flow">
          <ul>
            {GENRES.map((genre, index) => (
              <li
                key={genre}
                data-sc-reveal="left"
                data-sc-reveal-at={`${(0.05 + index * 0.13).toFixed(2)} ${(0.4 + index * 0.13).toFixed(2)}`}
              >
                {genre}
              </li>
            ))}
          </ul>
        </section>

        {/* 8 · THE SILENCE. Authored, not dead scroll. The drop before the peak. */}
        <section className="x-act x-silence" data-sc-act="flow">
          <p className="sc-body" data-sc-in>
            {site.pullQuote}
          </p>
        </section>

        {/* 9, 10, 11 · THE PEAK. Three crowd cuts. The bar holds across all of them. */}
        <div id="peak">
          <section className="x-act x-crowd" data-sc-act="flow">
            <div className="x-crowd__frame" data-sc-reveal="iris" data-sc-reveal-at="0.02 0.4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cdn('afterlightVPics/bois.jpg')} alt="The floor at Afterlight V" />
            </div>
          </section>

          <section className="x-act x-crowd x-crowd--close" data-sc-act="flow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="x-bleed" src={cdn('afterlightVPics/smoke.JPG')} alt="Smoke over the crowd at Afterlight V" />
            <div className="x-crowd__copy" data-sc-in>
              <p className="sc-body">Nobody in this photograph is looking at the stage.</p>
            </div>
          </section>

          <section className="x-act x-crowd x-crowd--line" data-sc-act="flow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="x-bleed" src={cdn('afterlightVPics/stage.jpg')} alt="The room at Afterlight V" />
            {/* A band where the line sits, not a full-frame overlay: this frame
                is the brightest on the page and the peak line sits across its
                busiest area. */}
            <div className="sc-scrim sc-scrim--band" aria-hidden="true" />
            <p className="x-peakline" data-sc-kinetic="words">
              It was never the lineup. It was the room.
            </p>
          </section>
        </div>

        {/* 12 · THE ARCHIVE. The signature move. */}
        <section className="x-act x-archive" data-sc-act="flow">
          <FlyerStack flyers={flyers} />
        </section>

        {/* 13 · THE BUILD. The work behind the night.
            The wipe runs edge to edge across a full-bleed frame: on a small
            letterboxed image it reads as a fidget rather than a transition.
            It is also scoped to a wrapper around the image alone, because
            `clip-path` is relative to the border box and a reveal spanning the
            caption clipped the first glyph off its line. */}
        <section className="x-act x-build" data-sc-act="flow">
          <div className="x-build__frame" data-sc-reveal="right" data-sc-reveal-at="0.05 0.45">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdn('afterlightVPics/dendrite-setup.JPG')} alt="Rig and stage build before doors" />
          </div>
          <p className="x-stamp">Load in. Nine hours before doors.</p>
        </section>

        {/* 14 · THE CLOSE. Abrupt. The last cut is the CTA, full bleed. */}
        <section className="x-act x-close" data-sc-act="flow">
          <video
            className="x-bleed"
            src={cdn('ajitu-loop.mp4')}
            poster="/gallery/ajitu-poster.jpg"
            muted
            loop
            autoPlay
            playsInline
            aria-hidden="true"
          />
          <div className="x-close__inner">
            <h2 className="sc-display sc-display--lg">THE NEXT ONE</h2>
            {ticketsLive ? (
              <p className="sc-body">
                {upcomingEvent?.title} · {upcomingEvent?.date} · {upcomingEvent?.venue}
              </p>
            ) : (
              <p className="sc-body">Nothing on sale yet. The list hears first.</p>
            )}
            <a className="x-cta" href={ctaHref} target={ticketsLive ? '_blank' : undefined} rel="noopener">
              {ctaLabel}
            </a>
          </div>
        </section>
      </main>

      <ScrollCraftMount />
    </>
  );
}
