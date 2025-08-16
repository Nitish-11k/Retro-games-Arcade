'use client';

import React, { Suspense } from 'react';
import usePixelRunnerEngine, { PlayerState } from '@/lib/pixel-runner-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

const PixelRunnerGame = () => {
  const {
    canvasRef,
    gameState,
    score,
    lives,
    startGame,
    isGameReady,
    playerState,
  } = usePixelRunnerEngine();
  const isMobile = useIsMobile();

  if (!isGameReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-4xl h-96 bg-black rounded-lg border-2 border-red-500">
        <div className="text-red-400 font-mono text-xl mb-4">Loading Game Assets...</div>
        <Progress value={100} className="w-3/4 [&>div]:bg-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-red-300 mb-2">PIXEL RUNNER</h1>
        <p className="text-sm text-green-400">A RETRO ENDLESS RUNNER</p>
      </header>

      {/* Game Description */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-gray-800 border-2 border-red-400 shadow-[8px_8px_0px_#DC2626]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-lg font-bold text-red-300 mb-4">🏃‍♂️ THE ENDLESS ADVENTURE</h2>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  Sprint through an endless procedurally-generated world in this high-octane platform adventure! 
                  Control a pixelated runner who must leap over obstacles, dodge enemies, and collect shiny coins 
                  while the pace continuously accelerates.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">JUMP</span>
                  <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded">COLLECT</span>
                  <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">SURVIVE</span>
                </div>
              </div>
              <div>
                <h3 className="text-md font-bold text-yellow-300 mb-3">⚡ GAME FEATURES</h3>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li>• Master precise jumping and double-jumping</li>
                  <li>• Navigate increasingly challenging terrain</li>
                  <li>• Collect coins to boost your score</li>
                  <li>• Dynamic world generation - no two runs alike</li>
                  <li>• Accelerating pace tests your reflexes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto">
        <Card className="bg-black/50 border-2 border-red-500 shadow-lg shadow-red-500/20">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b-2 border-red-500 gap-4">
            <CardTitle className="text-xl font-headline text-red-400">GAME ARENA</CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              <div className="font-mono text-red-300">SCORE: {score}</div>
              <div className="font-mono text-red-300">LIVES: {lives}</div>
              <div className="font-mono text-yellow-300">STATE: {PlayerState[playerState]}</div>
            </div>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="w-full h-auto border-2 border-red-300 bg-gray-900 rounded" 
                style={{ aspectRatio: '2/1', maxHeight: '400px' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {gameState !== 'running' && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-40">
          <div className="text-center p-4 sm:p-8 bg-gray-900 border-4 border-red-500 rounded-lg shadow-xl mx-4 max-w-md">
            <h2 className="text-2xl sm:text-4xl font-headline text-red-400 mb-4">
              {gameState === 'gameOver' ? 'GAME OVER' : 'PIXEL RUNNER'}
            </h2>
            <p className="text-red-200 mb-6 font-mono text-sm sm:text-base">
              {gameState === 'gameOver' ? `FINAL SCORE: ${score}` : 'TAP JUMP TO START!'}
            </p>
            <Button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 sm:px-8 text-sm sm:text-lg font-headline animate-pulse"
            >
              {gameState === 'gameOver' ? 'PLAY AGAIN' : 'START'}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onTouchStart={(e) => {
              e.preventDefault();
              // Simulate spacebar keydown event
              const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' });
              window.dispatchEvent(spaceEvent);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              // Simulate spacebar keydown event
              const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' });
              window.dispatchEvent(spaceEvent);
            }}
            className="select-none bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 active:from-red-600 active:to-red-700 text-white font-bold rounded-full w-16 h-16 sm:w-20 sm:h-20 text-sm sm:text-lg border-4 border-red-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            <span className="drop-shadow-sm font-bold">JUMP</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const PixelRunner = () => (
  <Suspense fallback={<div>Loading Pixel Runner...</div>}>
    <PixelRunnerGame />
  </Suspense>
);

export default PixelRunner;