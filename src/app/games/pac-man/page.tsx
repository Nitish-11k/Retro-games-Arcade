import type { Metadata } from 'next';
import PacManGame from '@/components/games/pac-man';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Pac‑Man Online',
  description: 'Chomp pellets, dodge ghosts, and clear mazes. Play Pac‑Man online for free at Retro Arcade Zone.',
  alternates: { canonical: '/games/pac-man' },
  openGraph: {
    title: 'Play Pac‑Man Online',
    description: 'Free browser Pac‑Man – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/pac-man',
  },
  twitter: {
    title: 'Play Pac‑Man Online',
    description: 'Free browser Pac‑Man – no downloads. Instant fun.',
  },
}

const PacManPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main>
        <h1 className="sr-only">Play Pac‑Man Online</h1>
        <GameJsonLd
          name="Pac‑Man"
          description="Chomp pellets, dodge ghosts, and clear mazes. Play Pac‑Man online for free at Retro Arcade Zone."
          url="https://retroarcade.in/games/pac-man"
          genre="Arcade"
        />
        <PacManGame />
      </main>
      <Footer />
    </div>
  );
};

export default PacManPage;
