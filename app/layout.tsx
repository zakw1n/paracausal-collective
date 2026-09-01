import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import { CartProvider } from '@/lib/CartContext';

export const metadata: Metadata = {
  title: 'Paracausal — Enter the Afterlight',
  description:
    'A collective pushing high-energy psytrance to a generation chasing deeper realms of consciousness. Cape Town, South Africa.',
  openGraph: {
    title: 'Paracausal',
    description: 'Underground psychedelic experiences. Cape Town. Existing at the edge of perception.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body style={{ background: 'var(--pc-void)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
        <CartProvider>
          <div className="rd-grain" />
          <RevealObserver />
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
