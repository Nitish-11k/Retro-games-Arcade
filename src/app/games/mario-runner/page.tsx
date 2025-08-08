'use client';

import { Suspense } from 'react';
import MarioRunner from '@/components/games/mario-runner';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function MarioRunnerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
