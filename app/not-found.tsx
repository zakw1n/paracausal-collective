import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/ds/Button';

/** Any unknown URL: the standard page heading, in place of Next's unstyled default. */
export default function NotFound() {
  return (
    <main style={{ padding: '120px clamp(20px,5vw,64px) 110px', textAlign: 'center' }}>
      <PageHeader title="NOT FOUND" gap={28} />
      <p style={{ color: 'var(--text-secondary)', margin: '0 0 36px' }}>This page doesn&rsquo;t exist, or has moved.</p>
      <Link href="/"><Button size="md" variant="secondary">Back home</Button></Link>
    </main>
  );
}
