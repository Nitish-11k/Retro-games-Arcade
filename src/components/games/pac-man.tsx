'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Pacman, Ghost, map as initialMap, TILE_SIZE, COLS, ROWS } from '@/lib/pac-man-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play } from 'lucide-react';

// It's a good practice to define constants that won't change outside the component
const PACMAN_START_POS = { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 20 + TILE_SIZE / 2 };
const GHOST_START_POS = [
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 9 + TILE_SIZE / 2, color: 'red', personality: 'blinky' as const },
  { x: TILE_SIZE * 9 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'pink', personality: 'pinky' as const },
  { x: TILE_SIZE * 11 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'cyan', personality: 'inky' as const },
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'orange', personality: 'clyde' as const },
];

const PacManGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // gameInstance will now hold only the core mutable game objects
  const gameInstance = useRef<{
    pacman: Pacman;
    ghosts: Ghost[];
    map: number[][];
    pelletsCount: number;
  } | null>(null);

  // This useCallback is now simpler. It just resets state and lets the useEffects handle the rest.
  // The dependency array is empty because it only uses setter functions, which are stable.
  const startGame = useCallback(() => {
    const mapCopy = initialMap.map(row => [...row]);
    gameInstance.current = {
      pacman: new Pacman(PACMAN_START_POS.x, PACMAN_START_POS.y),
      ghosts: GHOST_START_POS.map(g => new Ghost(g.x, g.y, g.color, g.personality)),
      map: mapCopy,
      pelletsCount: mapCopy.flat().filter(tile => tile === 0 || tile === 3).length,
    };
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsGameStarted(true);
  }, []);

  // Main Game Loop encapsulated in useEffect.
  // This effect runs whenever the game's active status changes.
  useEffect(() => {
    if (!isGameStarted || isGameOver || isGameWon) {
      return; // Do not run the loop if the game hasn't started or has ended.
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      // Ensure gameInstance is not null before proceeding
      if (!gameInstance.current) return;
      
      const { pacman, ghosts, map } = gameInstance.current;

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw map
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const tile = map[row][col];
          if (tile === 1) { // Wall
            ctx.fillStyle = 'blue';
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (tile === 0) { // Pellet
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 3) { // Power Pellet
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Update and draw Pac-Man and Ghosts
      pacman.update();
      pacman.draw(ctx);
      const blinky = ghosts.find(g => g.personality === 'blinky');

      ghosts.forEach(ghost => {
        if (blinky) {
          ghost.update(pacman.x, pacman.y, blinky.x, blinky.y);
        } else {
          ghost.update(pacman.x, pacman.y, pacman.x, pacman.y);
        }
        ghost.draw(ctx);
      });

      // Check for pellet eating
      const gridX = Math.floor(pacman.x / TILE_SIZE);
      const gridY = Math.floor(pacman.y / TILE_SIZE);
      if (map[gridY]?.[gridX] === 0) {
        map[gridY][gridX] = 2; // Mark as eaten
        setScore(prev => prev + 10);
        gameInstance.current.pelletsCount--;
      } else if (map[gridY]?.[gridX] === 3) {
        map[gridY][gridX] = 2;
        setScore(prev => prev + 50);
        gameInstance.current.pelletsCount--;
        ghosts.forEach(ghost => {
          ghost.isFrightened = true;
          ghost.frightenedTimer = 300; // ~5 seconds at 60fps
          ghost.speed = 1;
        });
      }

      // Check for ghost collisions
      ghosts.forEach(ghost => {
        const distance = Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y);
        if (distance < pacman.radius + ghost.radius) {
          if (ghost.isFrightened) {
            setScore(prev => prev + 200);
            ghost.reset(); // Assuming a reset method in the Ghost class
          } else {
            setLives(prev => prev - 1);
            pacman.reset(); // Assuming a reset method in the Pacman class
            // Add a brief pause or invincibility if desired
          }
        }
      });

      // Check for win condition
      if (gameInstance.current.pelletsCount === 0) {
        setIsGameWon(true);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup function: This is crucial!
    // It cancels the animation frame when the component unmounts or the effect re-runs.
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameStarted, isGameOver, isGameWon]); // Dependencies that control the loop's lifecycle

  // Effect for handling keyboard input
  useEffect(() => {
    if (!isGameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameInstance.current) return;
      const { pacman } = gameInstance.current;
      
      switch (e.key) {
        case 'ArrowUp': case 'w': pacman.nextDirection = { dx: 0, dy: -1 }; break;
        case 'ArrowDown': case 's': pacman.nextDirection = { dx: 0, dy: 1 }; break;
        case 'ArrowLeft': case 'a': pacman.nextDirection = { dx: -1, dy: 0 }; break;
        case 'ArrowRight': case 'd': pacman.nextDirection = { dx: 1, dy: 0 }; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameStarted]); // Only needs to run when the game starts/stops

  // Effect to check for game over condition
  useEffect(() => {
    if (lives === 0) {
      setIsGameOver(true);
    }
  }, [lives]);
  
  // Effect for win sound
  useEffect(() => {
    if (isGameWon) {
      // Consider creating the Audio object once to avoid issues
      const audio = new Audio('/sounds/game-won.mp3');
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [isGameWon]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">PAC-MAN</h1>
        <p className="text-sm text-green-400">A RETRO MAZE ADVENTURE</p>
      </header>
      
      <div className="mb-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-yellow-400 shadow-[8px_8px_0px_#FBC02D]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  {!isGameStarted || isGameOver || isGameWon ? (
                    <Button onClick={() => {startGame(); setShowInstructions(true);}} className="bg-yellow-400 text-black hover:bg-yellow-300">
                      <Play className="w-4 h-4 mr-2" /> PLAY
                    </Button>
                  ) : (
                    <Button onClick={() => {startGame(); setShowInstructions(true);}} className="bg-red-600 text-white hover:bg-red-700">
                      <RotateCcw className="w-4 h-4 mr-2" /> RESTART
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              <div className="relative w-full" style={{ aspectRatio: `${COLS * TILE_SIZE}/${ROWS * TILE_SIZE}`, minHeight: '500px', maxHeight: '70vh' }}>
                <canvas 
                  ref={canvasRef} 
                  width={COLS * TILE_SIZE} 
                  height={ROWS * TILE_SIZE} 
                  className="border-4 border-yellow-300 bg-black w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
                {!isGameStarted && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-4 font-bold text-yellow-300">PAC-MAN</h3>
                    <p className="text-sm mb-2 text-gray-300">USE ARROW KEYS OR WASD</p>
                    <p className="text-xs text-gray-400 mb-4">EAT ALL PELLETS AND AVOID GHOSTS!</p>
                  </div>
                )}
                {showInstructions && isGameStarted && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-80 p-4 rounded-lg text-white text-sm">
                    <p className="font-bold text-yellow-400 mb-2">First time playing?</p>
                    <p>Use Arrow Keys or WASD to move Pac-Man</p>
                    <p>Eat all pellets and avoid ghosts!</p>
                    <button 
                      onClick={() => setShowInstructions(false)}
                      className="mt-2 text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Got it!
                    </button>
                  </div>
                )}
                {(isGameOver || isGameWon) && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-2 font-bold text-red-500">{isGameWon ? '🎉 YOU WIN!' : '💀 GAME OVER'}</h3>
                    <p className="text-lg mb-2 text-gray-200">FINAL SCORE: {score}</p>
                    <p className="text-sm mb-4 text-yellow-400">CLICK RESTART TO PLAY AGAIN</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="bg-gray-800 border-2 border-yellow-300 shadow-[4px_4px_0px_#FBC02D]">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-300 text-sm">SCORE BOARD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-xs text-yellow-400/80">SCORE</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg text-red-500">{'♥ '.repeat(Math.max(0, lives))}</div>
                  <div className="text-xs text-gray-400">LIVES</div>
                </div>
                <div>
                  <div className="text-lg text-green-400">0</div>
                  <div className="text-xs text-gray-400">BEST</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-yellow-300/20">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
                  {isGameStarted ? (isGameOver || isGameWon ? 'GAME ENDED' : 'PLAYING') : 'READY'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-blue-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm">CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">ARROW KEYS</div>
                <div className="text-xs text-blue-400/80">TO MOVE</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">WASD</div>
                <div className="text-xs text-blue-400/80">ALTERNATIVE</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">GAME INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">⚪ Small pellets = 10 points</div>
                <div className="text-xs text-green-400">🟡 Power pellets = 50 points</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">👻 Eat frightened ghosts</div>
                <div className="text-xs text-blue-400">= 200 points each!</div>
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

export default PacManGame;