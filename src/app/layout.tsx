import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Tarot Tattva — Study Companion & Practice Reader',
  description: 'Master the 78 Tarot cards, practice interactive spreads, and take course study notes with Tarot Tattva.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-parchment-bg text-parchment-text antialiased selection:bg-parchment-brassTint selection:text-parchment-brass">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-parchment-border py-6 text-center text-xs text-parchment-dim">
          <p>Tarot Tattva • Intuitive Tarot Learning &amp; Course Companion</p>
        </footer>
      </body>
    </html>
  );
}
