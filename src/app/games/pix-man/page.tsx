import type { Metadata } from 'next';
import PixManGame from '@/components/games/pix-man';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Pix-Man Online',
  description: 'Chomp pellets, dodge ghosts, and clear mazes. Play Pix-Man online for free at Retro Arcade Zone.',
  alternates: { canonical: '/games/pix-man' },
  openGraph: {
    title: 'Play Pix-Man Online',
    description: 'Free browser arcade maze game – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/pix-man',
  },
  twitter: {
    title: 'Play Pix-Man Online',
    description: 'Free browser arcade maze game – no downloads. Instant fun.',
  },
}

const PixManPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main>
        <h1 className="sr-only">Play Pix-Man Online</h1>
        <GameJsonLd
          name="Pix-Man"
          description="Chomp pellets, dodge ghosts, and clear mazes. Play Pix-Man online for free at Retro Arcade Zone."
          url="https://retroarcade.in/games/pix-man"
          genre="Arcade"
        />
        <div className="text-center mb-8">
            <h2 className="text-4xl font-headline text-yellow-300">Pix-Man</h2>
            <p className="text-lg text-gray-400 mt-2 max-w-3xl mx-auto">
                Step into the maze and get ready for a timeless arcade experience! In Pix-Man, your goal is to clear the board by eating all the pellets while avoiding the relentless ghosts. Each ghost has a unique personality—from the aggressive chaser to the cunning flanker—making every encounter a strategic challenge.
                Grab a power pellet to turn the tables and hunt the ghosts for extra points! With simple controls and addictive gameplay, Pix-Man is a tribute to the golden age of gaming. Sharpen your reflexes, master the maze, and chase that high score in this pixelated classic!
            </p>
        </div>
        <PixManGame />
      </main>
      <Footer />
    </div>
  );
};

export default PixManPage;
