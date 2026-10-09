import type { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import { pageTitle } from '@/lib/site';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: pageTitle('Gallery'),
  description: 'Gallery & media. A living archive of Paracausal nights in Cape Town.',
};

export default function GalleryPage() {
  return (
    <main className="rd-reveal rd-gallery-page">
      <PageHeader eyebrow="Archive" title="GALLERY" gap={48} />

      <GalleryGrid />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center', margin: '40px 0 0' }}>
        More content coming soon
      </p>
    </main>
  );
}
