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
        <PixManGame />
      </main>
      <Footer />
    </div>
  );
};

export default PixManPage;
