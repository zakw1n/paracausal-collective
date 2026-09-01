import type { Metadata } from 'next';
import ArtistCard from '@/components/ArtistCard';
import { artists } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Artists — Paracausal',
  description: 'The DJs and live acts who have played Paracausal nights in Cape Town.',
};

const divider = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-widest)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: 0,
} as const;

export default function ArtistsPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--pc-cyan)', margin: '0 0 16px' }}>
        Roster
      </p>
      <h1 style={{ fontFamily: 'var(--font-techno)', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 0.95, fontSize: 'clamp(2.6rem,8vw,6rem)' }}>
        ARTISTS &amp;<br /><span style={{ color: 'var(--text-faint)' }}>RESIDENTS</span>
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 24px' }}>
        <p style={divider}>Played for us</p>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {artists.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div
          style={{
            border: '1px dashed var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 'clamp(40px,8vw,72px) 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ ...divider, color: 'var(--text-faint)', lineHeight: 1.8 }}>
            The roster is being assembled
          </p>
        </div>
      )}
    </main>
  );
}
