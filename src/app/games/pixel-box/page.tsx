import type { Metadata } from 'next'
import PixelBoxGame from '@/components/games/pixel-box'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Pixel Box Online',
  description: 'Stack falling blocks and clear lines in a timeless classic. Play Pixel Box online for free at Retro Arcade Zone.',
  alternates: { canonical: '/games/pixel-box' },
  openGraph: {
    title: 'Play Pixel Box Online',
    description: 'Free browser puzzle game – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/pixel-box',
  },
  twitter: {
    title: 'Play Pixel Box Online',
    description: 'Free browser puzzle game – no downloads. Instant fun.',
  },
}

export default function PixelBoxPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <h1 className="sr-only">Play Pixel Box Online</h1>
        <GameJsonLd
          name="Pixel Box"
          description="Stack falling blocks and clear lines in a timeless classic. Play Pixel Box online for free at Retro Arcade Zone."
          url="https://retroarcade.in/games/pixel-box"
          genre="Puzzle"
        />
        <PixelBoxGame />
      </main>
      <Footer />
    </div>
  )
}
