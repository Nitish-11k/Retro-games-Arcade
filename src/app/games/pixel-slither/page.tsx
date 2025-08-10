import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PixelSlither from '@/components/games/pixel-slither';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Pixel Slither (Snake) Online',
  description: 'Grow your snake, avoid collisions, and climb the leaderboard. Play Pixel Slither online for free.',
  alternates: { canonical: '/games/pixel-slither' },
  openGraph: {
    title: 'Play Pixel Slither (Snake) Online',
    description: 'Free browser Snake – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/pixel-slither',
  },
  twitter: {
    title: 'Play Pixel Slither (Snake) Online',
    description: 'Free browser Snake – no downloads. Instant fun.',
  },
}

export default function PixelSlitherPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <h1 className="sr-only">Play Pixel Slither Online</h1>
        <GameJsonLd
          name="Pixel Slither"
          description="Grow your snake, avoid collisions, and climb the leaderboard. Play Pixel Slither online for free."
          url="https://retroarcade.in/games/pixel-slither"
          genre="Arcade"
        />
        <PixelSlither />
      </main>
      <Footer />
    </div>
  );
}
