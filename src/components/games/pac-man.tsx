'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Pacman, Ghost, map as initialMap, TILE_SIZE, COLS, ROWS } from '@/lib/pac-man-utils';
import { Button } from '@/components/ui/button';

// It's a good practice to define constants that won't change outside the component
const PACMAN_START_POS = { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 17 + TILE_SIZE / 2 };
const GHOST_START_POS = [
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 9 + TILE_SIZE / 2, color: 'red' },
  { x: TILE_SIZE * 9 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'pink' },
  { x: TILE_SIZE * 11 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'cyan' },
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 10 + TILE_SIZE / 2, color: 'orange' },
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
      ghosts: GHOST_START_POS.map(g => new Ghost(g.x, g.y, g.color as any)),
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
      ghosts.forEach(ghost => {
        ghost.update();
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
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Pac-Man</h1>
      {!isGameStarted ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">🟡 PAC-MAN</h2>
          <div className="bg-blue-900 p-6 rounded-lg mb-6 text-center max-w-md">
            <h3 className="text-xl font-bold mb-4 text-yellow-300">How to Play:</h3>
            <div className="text-left space-y-2">
              <p>🎮 <strong>Movement:</strong> Arrow Keys or W, A, S, D</p>
              <p>🟡 <strong>Goal:</strong> Eat all pellets to win</p>
              <p>⚪ <strong>Power Pellets:</strong> Make ghosts vulnerable</p>
              <p>👻 <strong>Ghosts:</strong> Avoid them or eat them when blue</p>
              <p>❤️ <strong>Lives:</strong> You have 3 lives</p>
            </div>
          </div>
          <Button onClick={() => {startGame(); setShowInstructions(true);}} className="text-lg px-8 py-3">
            Start Game
          </Button>
        </div>
      ) : (
        <div className="relative">
          <canvas ref={canvasRef} width={COLS * TILE_SIZE} height={ROWS * TILE_SIZE} className="bg-black border-4 border-blue-500" />
          <div className="text-white mt-4 flex justify-between items-center">
            <div className="text-lg">
              <p>Score: <span className="text-yellow-400 font-bold">{score}</span></p>
              <p>Lives: <span className="text-red-400 font-bold">{'❤️'.repeat(lives)}</span></p>
            </div>
            <div className="text-sm text-gray-300">
              <p>Arrow Keys or WASD to move</p>
            </div>
          </div>
          
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-90 p-8 rounded-lg text-white text-center">
              <h2 className="text-3xl mb-4 font-bold">{isGameWon ? '🎉 You Win!' : '💀 Game Over'}</h2>
              <p className="mb-4">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
              <Button onClick={() => {startGame(); setShowInstructions(true);}}>Play Again</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PacManGame;