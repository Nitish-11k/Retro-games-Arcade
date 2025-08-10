import type { Metadata } from 'next';
import VoidVanguardGame from '@/components/games/void-vanguard';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Void Vanguard Online',
  description: 'Pilot your ship, blast enemies, and survive the void. Play Void Vanguard online for free.',
  alternates: { canonical: '/games/void-vanguard' },
  openGraph: {
    title: 'Play Void Vanguard Online',
    description: 'Free browser space shooter – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/void-vanguard',
  },
  twitter: {
    title: 'Play Void Vanguard Online',
    description: 'Free browser space shooter – no downloads. Instant fun.',
  },
}

const VoidVanguardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main>
        <h1 className="sr-only">Play Void Vanguard Online</h1>
        <GameJsonLd
          name="Void Vanguard"
          description="Pilot your ship, blast enemies, and survive the void. Play Void Vanguard online for free."
          url="https://retroarcade.in/games/void-vanguard"
          genre="Shooter"
        />
        <VoidVanguardGame />
      </main>
      <Footer />
    </div>
  );
};

export default VoidVanguardPage;
