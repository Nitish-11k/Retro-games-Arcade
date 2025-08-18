"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';
import { Game } from '@/lib/flappy-bird-utils';
import { useIsMobile } from '@/hooks/use-mobile';

const FlappyBirdGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2.0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
  const isMobile = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    gameRef.current = game;
    game.start();

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
      game.stop();
    };
  }, []);

  const resetGame = () => {
    if (gameRef.current) {
      gameRef.current.stop();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    gameRef.current = game;
    game.start();
    
    // Reset state
    setScore(0);
    setSpeed(2.0);
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900" style={{ fontFamily: "'Press Start 2P', monospace" }}>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl px-4">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-blue-400 shadow-[8px_8px_0px_#1E40AF]">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                <CardTitle className="text-blue-300 text-sm sm:text-base">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={resetGame} className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2">
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> RESTART
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
                  className="border-4 border-blue-300 bg-gray-900 cursor-pointer"
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    touchAction: 'none',
                    maxHeight: isMobile ? '70vh' : '600px'
                  }}
                />
                {gameState === 'gameOver' && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    <h3 className="text-lg sm:text-xl lg:text-2xl mb-2 font-bold text-red-500">GAME OVER</h3>
                    <p className="text-sm sm:text-base lg:text-lg mb-2 text-gray-200">FINAL SCORE: {score}</p>
                    <p className="text-xs sm:text-sm mb-4 text-blue-400">CLICK OR PRESS SPACE TO RESTART</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-3 sm:space-y-4">
          <Card className="bg-gray-800 border-2 border-blue-300 shadow-[4px_4px_0px_#1E40AF]">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-300 text-xs sm:text-sm">SCORE BOARD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-2xl sm:text-3xl font-bold text-white">{score}</div>
                <div className="text-xs text-blue-400/80">SCORE</div>
              </div>
              <div className="text-center pt-2 border-t border-blue-300/20">
                <Badge variant="outline" className="text-blue-300 border-blue-300/50 text-xs">
                  SPEED {speed.toFixed(1)}x
                </Badge>
              </div>
              <div className="text-center pt-2 border-t border-blue-300/20">
                <Badge variant="outline" className={`${gameState === 'playing' ? 'text-green-400 border-green-400/50' : 'text-red-400 border-red-400/50'} text-xs`}>
                  {gameState === 'playing' ? 'FLYING' : 'CRASHED'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-yellow-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-300 text-xs sm:text-sm">CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm sm:text-lg font-bold text-white">SPACEBAR</div>
                <div className="text-xs text-yellow-400/80">TO FLAP</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm sm:text-lg font-bold text-white">CLICK</div>
                <div className="text-xs text-yellow-400/80">TO JUMP</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-xs sm:text-sm">GAME INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-xs sm:text-sm text-gray-300 mb-1">Each pipe = +10 points</div>
                <div className="text-xs text-green-400">Speed increases with distance!</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-xs sm:text-sm text-gray-300 mb-1">Navigate through pipes</div>
                <div className="text-xs text-blue-400">Don't hit the ground!</div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Mobile Controls - Hidden on Desktop */}
      {isMobile && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
          <Button
            onTouchStart={(e) => {
              e.preventDefault();
              if (gameRef.current) {
                gameRef.current.handleInput();
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              if (gameRef.current) {
                gameRef.current.handleInput();
              }
            }}
            className="select-none bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 active:from-blue-600 active:to-blue-700 text-white font-bold rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-sm sm:text-lg lg:text-2xl border-4 border-blue-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            style={{ 
              boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            <span className="drop-shadow-sm font-bold">TAP</span>
          </Button>
        </div>
      )}
      
      {/* Game Description */}
      <div className="w-full mt-6 px-4">
        <Card className="bg-gray-800 border-2 border-blue-400 shadow-[8px_8px_0px_#1E40AF]">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <div>
                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-blue-300 mb-3 sm:mb-4">🐦 THE ULTIMATE FLIGHT CHALLENGE</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3 sm:mb-4">
                  Navigate your brave bird through an endless maze of green pipes in this classic arcade-style adventure! 
                  Master the art of timing as gravity constantly pulls you down - one wrong move and it's game over!
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">TAP</span>
                  <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">FLY</span>
                  <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded">SCORE</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-yellow-300 mb-2 sm:mb-3">🎮 GAME MECHANICS</h3>
                <ul className="text-xs text-gray-300 space-y-1 sm:space-y-2">
                  <li>• Tap screen or press spacebar to flap wings</li>
                  <li>• Each pipe passed = +10 points</li>
                  <li>• Speed gradually increases with distance</li>
                  <li>• Simple one-button controls</li>
                  <li>• Test your reflexes and patience</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};

export default FlappyBirdGame;