'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MAP, GHOSTS, PLAYER, TILE_SIZE, POWER_PELLET_TIME } from '@/lib/pix-man-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play } from 'lucide-react';

const PixManGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [powerPelletTimer, setPowerPelletTimer] = useState(0);
  const pellets = useRef(MAP.flat().filter(tile => tile === 1 || tile === 2).length);

  const player = useRef({ ...PLAYER });
  const ghosts = useRef(JSON.parse(JSON.stringify(GHOSTS)));

  // Load best score from localStorage on component mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('pixman-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  // Save best score when score changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('pixman-best-score', score.toString());
    }
  }, [score, bestScore]);

  // This useCallback is now simpler. It just resets state and lets the useEffects handle the rest.
  // The dependency array is empty because it only uses setter functions, which are stable.
  const startGame = () => {
    player.current = { ...PLAYER };
    ghosts.current = JSON.parse(JSON.stringify(GHOSTS));
    pellets.current = MAP.flat().filter(tile => tile === 1 || tile === 2).length;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setIsGameStarted(true);
    setPowerPelletTimer(0);
  };

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Draw map
    for (let row = 0; row < MAP.length; row++) {
      for (let col = 0; col < MAP[0].length; col++) {
        const tile = MAP[row][col];
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

    // Update and draw Player and Ghosts
    player.current.update();
    player.current.draw(ctx);
    const blinky = ghosts.current.find(g => g.personality === 'blinky');

    ghosts.current.forEach(ghost => {
        if (blinky) {
        ghost.update(player.current.x, player.current.y, blinky.x, blinky.y);
        } else {
        ghost.update(player.current.x, player.current.y, player.current.x, player.current.y);
        }
        ghost.draw(ctx);
      });

      // Check for pellet eating
    const gridX = Math.floor(player.current.x / TILE_SIZE);
    const gridY = Math.floor(player.current.y / TILE_SIZE);
    if (MAP[gridY]?.[gridX] === 0) {
      MAP[gridY][gridX] = 2; // Mark as eaten
        setScore(prev => prev + 10);
      pellets.current--;
    } else if (MAP[gridY]?.[gridX] === 3) {
      MAP[gridY][gridX] = 2;
        setScore(prev => prev + 50);
      pellets.current--;
      ghosts.current.forEach(ghost => {
          ghost.isFrightened = true;
        ghost.frightenedTimer = POWER_PELLET_TIME; // ~5 seconds at 60fps
          ghost.speed = 1;
        });
      }

      // Check for ghost collisions
    ghosts.current.forEach(ghost => {
      const distance = Math.hypot(player.current.x - ghost.x, player.current.y - ghost.y);
      if (distance < player.current.radius + ghost.radius) {
          if (ghost.isFrightened) {
            setScore(prev => prev + 200);
            ghost.reset(); // Assuming a reset method in the Ghost class
          } else {
            setLives(prev => prev - 1);
          player.current.reset(); // Assuming a reset method in the Player class
            // Add a brief pause or invincibility if desired
          }
        }
      });

      // Check for win condition
    if (pellets.current === 0) {
      setGameWon(true);
    }
  };

  const update = () => {
    if (!isGameStarted || gameOver || gameWon) {
      return; // Do not run the loop if the game hasn't started or has ended.
    }

    // Update power pellet timer
    if (powerPelletTimer > 0) {
      setPowerPelletTimer(prev => prev - 1);
      if (powerPelletTimer === 0) {
        ghosts.current.forEach(ghost => {
          ghost.isFrightened = false;
          ghost.frightenedTimer = 0;
          ghost.speed = 2; // Reset speed
        });
      }
    }

    // Update player and ghosts
    player.current.update();
    ghosts.current.forEach(ghost => {
      if (blinky) {
        ghost.update(player.current.x, player.current.y, blinky.x, blinky.y);
      } else {
        ghost.update(player.current.x, player.current.y, player.current.x, player.current.y);
      }
    });

    // Check for pellet eating (redundant with draw, but kept for clarity)
    const gridX = Math.floor(player.current.x / TILE_SIZE);
    const gridY = Math.floor(player.current.y / TILE_SIZE);
    if (MAP[gridY]?.[gridX] === 0) {
      MAP[gridY][gridX] = 2; // Mark as eaten
      setScore(prev => prev + 10);
      pellets.current--;
    } else if (MAP[gridY]?.[gridX] === 3) {
      MAP[gridY][gridX] = 2;
      setScore(prev => prev + 50);
      pellets.current--;
      ghosts.current.forEach(ghost => {
        ghost.isFrightened = true;
        ghost.frightenedTimer = POWER_PELLET_TIME; // ~5 seconds at 60fps
        ghost.speed = 1;
      });
    }

    // Check for ghost collisions (redundant with draw, but kept for clarity)
    ghosts.current.forEach(ghost => {
      const distance = Math.hypot(player.current.x - ghost.x, player.current.y - ghost.y);
      if (distance < player.current.radius + ghost.radius) {
        if (ghost.isFrightened) {
          setScore(prev => prev + 200);
          ghost.reset(); // Assuming a reset method in the Ghost class
        } else {
          setLives(prev => prev - 1);
          player.current.reset(); // Assuming a reset method in the Player class
          // Add a brief pause or invincibility if desired
        }
      }
    });

    // Check for win condition (redundant with draw, but kept for clarity)
    if (pellets.current === 0) {
      setGameWon(true);
    }
  };
  
  useEffect(() => {
    if (!isGameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!player.current) return;
      const { x, y, radius } = player.current;
      
      switch (e.key) {
        case 'ArrowUp': case 'w': player.current.nextDirection = { dx: 0, dy: -1 }; break;
        case 'ArrowDown': case 's': player.current.nextDirection = { dx: 0, dy: 1 }; break;
        case 'ArrowLeft': case 'a': player.current.nextDirection = { dx: -1, dy: 0 }; break;
        case 'ArrowRight': case 'd': player.current.nextDirection = { dx: 1, dy: 0 }; break;
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
      setGameOver(true);
    }
  }, [lives]);
  
  // Effect for win sound
  useEffect(() => {
    if (gameWon) {
      // Consider creating the Audio object once to avoid issues
      const audio = new Audio('/sounds/game-won.mp3');
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [gameWon]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">Pix-Man</h1>
        <p className="text-sm text-green-400">A RETRO MAZE ADVENTURE</p>
      </header>
      

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-yellow-400 shadow-[8px_8px_0px_#FBC02D]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  {!isGameStarted || gameOver || gameWon ? (
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
              <div className="relative w-full" style={{ aspectRatio: `${MAP[0].length * TILE_SIZE}/${MAP.length * TILE_SIZE}`, minHeight: '500px', maxHeight: '70vh' }}>
                <canvas 
                  ref={canvasRef} 
                  width={MAP[0].length * TILE_SIZE} 
                  height={MAP.length * TILE_SIZE} 
                  className="border-4 border-yellow-300 bg-black w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
                {!isGameStarted && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-4 font-bold text-yellow-300">Pix-Man</h3>
                    <p className="text-sm mb-2 text-gray-300">USE ARROW KEYS OR WASD</p>
                    <p className="text-xs text-gray-400 mb-4">EAT ALL PELLETS AND AVOID GHOSTS!</p>
                  </div>
                )}
                {showInstructions && isGameStarted && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-80 p-4 rounded-lg text-white text-sm">
                    <p className="font-bold text-yellow-400 mb-2">First time playing?</p>
                    <p>Use Arrow Keys or WASD to move Pix-Man</p>
                    <p>Eat all pellets and avoid ghosts!</p>
                    <button 
                      onClick={() => setShowInstructions(false)}
                      className="mt-2 text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Got it!
                    </button>
                  </div>
                )}
                {(gameOver || gameWon) && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-2 font-bold text-red-500">{gameWon ? '🎉 YOU WIN!' : '💀 GAME OVER'}</h3>
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
                  <div className="text-lg text-green-400">{bestScore}</div>
                  <div className="text-xs text-gray-400">BEST</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-yellow-300/20">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
                  {isGameStarted ? (gameOver || gameWon ? 'GAME ENDED' : 'PLAYING') : 'READY'}
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
      
      
    </div>
  );
};

export default PixManGame;