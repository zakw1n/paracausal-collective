import type { Metadata } from 'next';
import ArtistCard from '@/components/ArtistCard';
import { artists, pageTitle } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import { eyebrowMuted as divider } from '@/components/ds/styles';

export const metadata: Metadata = {
  title: pageTitle('Artists'),
  description: 'The DJs and live acts who have played Paracausal nights in Cape Town.',
};

export default function ArtistsPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <PageHeader eyebrow="Roster" title="ARTISTS" />

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
