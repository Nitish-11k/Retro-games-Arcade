import type { Metadata } from 'next';
import { Suspense } from 'react';
import MarioRunner from '@/components/games/mario-runner';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GameJsonLd from '@/components/seo/game-jsonld'

export const metadata: Metadata = {
  title: 'Play Mario Runner Online',
  description: 'Run, jump, and dodge obstacles in a fast‑paced side‑scroller. Play Mario Runner online for free.',
  alternates: { canonical: '/games/mario-runner' },
  openGraph: {
    title: 'Play Mario Runner Online',
    description: 'Free browser runner – no downloads. Instant fun.',
    url: 'https://retroarcade.in/games/mario-runner',
  },
  twitter: {
    title: 'Play Mario Runner Online',
    description: 'Free browser runner – no downloads. Instant fun.',
  },
}

export default function MarioRunnerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="sr-only">Play Mario Runner Online</h1>
        <GameJsonLd
          name="Mario Runner"
          description="Run, jump, and dodge obstacles in a fast‑paced side‑scroller. Play Mario Runner online for free."
          url="https://retroarcade.in/games/mario-runner"
          genre="Platformer"
        />
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center w-full max-w-4xl h-96 bg-black rounded-lg border-2 border-red-500">
            <div className="text-red-400 font-mono text-xl mb-4">Loading Mario Runner...</div>
            <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <MarioRunner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
