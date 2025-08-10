import type { Metadata } from 'next';
import FlappyBirdGame from '@/components/games/flappy-bird';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Flappy Bird Online',
  description: 'Tap to fly and dodge pipes in Flappy Bird. Play the iconic endless flyer online for free.',
  alternates: { canonical: '/games/flappy-bird' },
  openGraph: {
    title: 'Play Flappy Bird Online',
    description: 'Free browser Flappy Bird – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/flappy-bird',
  },
  twitter: {
    title: 'Play Flappy Bird Online',
    description: 'Free browser Flappy Bird – no downloads. Instant fun.',
  },
}

const FlappyBirdPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Play Flappy Bird Online</h1>
        <GameJsonLd
          name="Flappy Bird"
          description="Tap to fly and dodge pipes in Flappy Bird. Play the iconic endless flyer online for free."
          url="https://retroarcade.in/games/flappy-bird"
          genre="Arcade"
        />
        <FlappyBirdGame />
      </main>
      <Footer />
    </div>
  );
};

export default FlappyBirdPage;