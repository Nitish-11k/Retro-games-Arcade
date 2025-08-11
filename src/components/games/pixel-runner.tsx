'use client';

import React, { Suspense } from 'react';
import usePixelRunnerEngine, { PlayerState } from '@/lib/pixel-runner-engine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
    </div>
  );
};

const PixelRunner = () => (
  <Suspense fallback={<div>Loading Pixel Runner...</div>}>
    <PixelRunnerGame />
  </Suspense>
);

export default PixelRunner;