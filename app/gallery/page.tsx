import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Gallery — Paracausal',
  description: 'Gallery & media. A living archive of Paracausal nights in Cape Town.',
};

export default function GalleryPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--pc-cyan)', margin: '0 0 16px' }}>
        Archive
      </p>
      <h1 style={{ fontFamily: 'var(--font-techno)', fontWeight: 800, color: '#fff', margin: '0 0 48px', lineHeight: 0.95, fontSize: 'clamp(2.6rem,8vw,6rem)' }}>
        GALLERY &amp;<br /><span style={{ color: 'var(--text-faint)' }}>MEDIA</span>
      </h1>

      <GalleryGrid />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center', margin: '40px 0 0' }}>
        More content coming soon
      </p>
    </main>
  );
}
