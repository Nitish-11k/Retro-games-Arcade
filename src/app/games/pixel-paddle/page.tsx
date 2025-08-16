import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import PixelPaddle from '@/components/games/pixel-paddle';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Pixel Paddle Online',
  description: 'Retro pong‑style paddle action with modern twists. Play Pixel Paddle online for free.',
  alternates: { canonical: '/games/pixel-paddle' },
  openGraph: {
    title: 'Play Pixel Paddle Online',
    description: 'Free browser arcade paddle game – no downloads.',
    url: 'https://retroarcade.in/games/pixel-paddle',
  },
  twitter: {
    title: 'Play Pixel Paddle Online',
    description: 'Free browser arcade paddle game – no downloads.',
  },
}

export default function PixelPaddlePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <h1 className="sr-only">Play Pixel Paddle Online</h1>
        <GameJsonLd
          name="Pixel Paddle"
          description="Retro pong‑style paddle action with modern twists. Play Pixel Paddle online for free."
          url="https://retroarcade.in/games/pixel-paddle"
          genre="Arcade"
        />
        <PixelPaddle />
      </main>
      <Footer />
    </div>
  );
}