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
    <div className="flex flex-col items-center">
      {/* Game Description */}
      <div className="w-full max-w-4xl mb-6">
        <Card className="bg-gray-800 border-2 border-red-400">
          <CardContent className="p-4">
            <p className="text-sm text-gray-300 text-center leading-relaxed">
              Sprint through an endless procedurally-generated world in this high-octane platform adventure! 
              Control a pixelated runner who must leap over obstacles, dodge enemies, and collect shiny coins 
              while the pace continuously accelerates. Master the art of precise jumping and double-jumping to 
              navigate increasingly challenging terrain. Each coin collected boosts your score, but one collision 
              with an enemy or obstacle costs you a precious life. The world generates dynamically around you, 
              ensuring no two runs are exactly alike. How far can you run before the relentless speed becomes 
              too much to handle?
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-4xl bg-black/50 border-2 border-red-500 shadow-lg shadow-red-500/20">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b-2 border-red-500">
          <CardTitle className="text-xl font-headline text-red-400">Pixel Runner</CardTitle>
          <div className="flex items-center space-x-6">
            <div className="text-lg font-mono text-red-300">Score: {score}</div>
            <div className="text-lg font-mono text-red-300">Lives: {lives}</div>
            <div className="text-lg font-mono text-yellow-300">State: {PlayerState[playerState]}</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <canvas ref={canvasRef} className="w-full h-auto aspect-[2/1]" />
        </CardContent>
      </Card>
      
      {gameState !== 'running' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <div className="text-center p-8 bg-gray-900 border-4 border-red-500 rounded-lg shadow-xl">
            <h2 className="text-4xl font-headline text-red-400 mb-4">
              {gameState === 'gameOver' ? 'Game Over' : 'Pixel Runner'}
            </h2>
            <p className="text-red-200 mb-6 font-mono">
              {gameState === 'gameOver' ? `Final Score: ${score}` : 'Press JUMP to start your run!'}
            </p>
            <Button
              onClick={startGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 text-lg font-headline animate-pulse"
            >
              {gameState === 'gameOver' ? 'Play Again' : 'JUMP'}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="fixed bottom-8 right-8 z-50">
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
            className="select-none bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 active:from-red-600 active:to-red-700 text-white font-bold rounded-full w-20 h-20 text-lg border-4 border-red-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            <span className="drop-shadow-sm">JUMP</span>
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