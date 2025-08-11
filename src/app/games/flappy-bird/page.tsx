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
        <div className="text-center mb-8">
            <h2 className="text-4xl font-headline text-blue-300">Flappy Bird</h2>
            <p className="text-lg text-gray-400 mt-2 max-w-3xl mx-auto">
                Get ready for a test of timing and reflexes in this minimalist classic! Flappy Bird sends you on an endless journey through a world of green pipes. The goal is simple: tap or click to make your bird flap its wings and navigate through the gaps. But be warned, the physics are tricky, and a single mistake will send you back to the start.
                As you progress, the speed increases, pushing your skills to the limit. Perfect for a quick gaming session, Flappy Bird is all about chasing that next high score. How long can you survive the pipe maze?
            </p>
        </div>
        <FlappyBirdGame />
      </main>
      <Footer />
    </div>
  );
};

export default FlappyBirdPage;