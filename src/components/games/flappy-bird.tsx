"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';
import { Game } from '@/lib/flappy-bird-utils';

const FlappyBirdGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2.0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    gameRef.current = game;
    game.run();

    // Update score and speed periodically
    const interval = setInterval(() => {
      if (gameRef.current) {
        setScore(gameRef.current.getCurrentScore());
        setSpeed(gameRef.current.getCurrentSpeed());
        setGameState(gameRef.current.getGameState());
      }
    }, 100);

    return () => {
      clearInterval(interval);
      game.removeEventListeners();
    };
  }, []);

  const resetGame = () => {
    if (gameRef.current) {
      gameRef.current.removeEventListeners();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    gameRef.current = game;
    game.run();
    
    // Reset state
    setScore(0);
    setSpeed(2.0);
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-blue-300 mb-2">FLAPPY BIRD</h1>
        <p className="text-sm text-green-400">A RETRO FLYING ADVENTURE</p>
      </header>
      
      <div className="mb-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-blue-400 shadow-[8px_8px_0px_#1E40AF]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={resetGame} className="bg-blue-600 text-white hover:bg-blue-700">
                    <RotateCcw className="w-4 h-4 mr-2" /> RESTART
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  width="400" 
                  height="600" 
                  className="border-4 border-blue-300 bg-gray-900"
                  style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
                />
                {gameState === 'gameOver' && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-2 font-bold text-red-500">GAME OVER</h3>
                    <p className="text-lg mb-2 text-gray-200">FINAL SCORE: {score}</p>
                    <p className="text-sm mb-4 text-blue-400">CLICK OR PRESS SPACE TO RESTART</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="bg-gray-800 border-2 border-blue-300 shadow-[4px_4px_0px_#1E40AF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-300 text-sm">SCORE BOARD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-xs text-blue-400/80">SCORE</div>
              </div>
              <div className="text-center pt-2 border-t border-blue-300/20">
                <Badge variant="outline" className="text-blue-300 border-blue-300/50">
                  SPEED {speed.toFixed(1)}x
                </Badge>
              </div>
              <div className="text-center pt-2 border-t border-blue-300/20">
                <Badge variant="outline" className={`${gameState === 'playing' ? 'text-green-400 border-green-400/50' : 'text-red-400 border-red-400/50'}`}>
                  {gameState === 'playing' ? 'FLYING' : 'CRASHED'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-yellow-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-300 text-sm">CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">SPACEBAR</div>
                <div className="text-xs text-yellow-400/80">TO FLAP</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">CLICK</div>
                <div className="text-xs text-yellow-400/80">TO JUMP</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">GAME INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">Each pipe = +10 points</div>
                <div className="text-xs text-green-400">Speed increases with distance!</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">Navigate through pipes</div>
                <div className="text-xs text-blue-400">Don't hit the ground!</div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      
      <footer className="mt-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">FOOTER ADVERTISEMENT</p>
      </footer>
    </div>
  );
};

export default FlappyBirdGame;