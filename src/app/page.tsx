import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import GameGallery from '@/components/sections/game-gallery';
import Leaderboards from '@/components/sections/leaderboards';


export const metadata: Metadata = {
  title: 'Play Free Retro Browser Games',
  description: 'Play free retro games like Tetris, Pac‑Man, Flappy Bird, Snake, and more. No downloads. Instant arcade fun!',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Play Free Retro Browser Games',
    description: 'Instant arcade fun in your browser. No downloads.',
    url: 'https://retroarcade.in',
  },
  twitter: {
    title: 'Play Free Retro Browser Games',
    description: 'Instant arcade fun in your browser. No downloads.',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <GameGallery />

        <section id="leaderboard" className="py-16">
          <Leaderboards />
        </section>
      </main>
      <Footer />
    </div>
  );
}
