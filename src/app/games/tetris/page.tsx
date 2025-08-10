import type { Metadata } from 'next'
import TetrisGame from '@/components/games/tetris'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Tetris Online',
  description: 'Stack falling blocks and clear lines in a timeless classic. Play Tetris online for free at Retro Arcade Zone.',
  alternates: { canonical: '/games/tetris' },
  openGraph: {
    title: 'Play Tetris Online',
    description: 'Free browser Tetris – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/tetris',
  },
  twitter: {
    title: 'Play Tetris Online',
    description: 'Free browser Tetris – no downloads. Instant fun.',
  },
}

export default function TetrisPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <h1 className="sr-only">Play Tetris Online</h1>
        <GameJsonLd
          name="Tetris"
          description="Stack falling blocks and clear lines in a timeless classic. Play Tetris online for free at Retro Arcade Zone."
          url="https://retroarcade.in/games/tetris"
          genre="Puzzle"
        />
        <TetrisGame />
      </main>
      <Footer />
    </div>
  )
}
