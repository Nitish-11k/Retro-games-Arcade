'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MAP, GHOSTS, PLAYER, TILE_SIZE, POWER_PELLET_TIME, Player, Ghost, GhostState } from '@/lib/pix-man-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play } from 'lucide-react';

enum GameState {
  START_SCREEN,
  GAME_START_ANIMATION,
  PLAYING,
  PACMAN_DEATH_ANIMATION,
  GAME_OVER,
  LEVEL_COMPLETE,
}

const chaseTime = 20000; // 20 seconds
const scatterTime = 7000; // 7 seconds

const PixManGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isDying, setIsDying] = useState(false);
  const [powerPelletTimer, setPowerPelletTimer] = useState(0);
  
  const player = useRef<Player | null>(null);
  const ghosts = useRef<Ghost[]>([]);
  const pellets = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const mapRef = useRef(JSON.parse(JSON.stringify(MAP))); // Create a mutable copy of the map
  const modeTimer = useRef(scatterTime);
  const currentMode = useRef<'scatter' | 'chase'>('scatter');
  const stateTimer = useRef(0);


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

  const resetLevel = useCallback(() => {
    mapRef.current = JSON.parse(JSON.stringify(MAP));
    pellets.current = mapRef.current.flat().filter((tile: number) => tile === 0 || tile === 3).length;
    player.current = new Player(PLAYER.x, PLAYER.y);
    ghosts.current = GHOSTS.map(g => new Ghost(g.x, g.y, g.color, g.personality));
    currentMode.current = 'scatter';
    modeTimer.current = 7000; // Start with scatter mode
  }, []);

  const resetGame = useCallback(() => {
    resetLevel();
    setScore(0);
    setLives(3);
    setGameState(GameState.START_SCREEN);
  }, [resetLevel]);

  const stopGame = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const update = useCallback((deltaTime: number) => {
    switch (gameState) {
      case GameState.GAME_START_ANIMATION:
        stateTimer.current -= deltaTime;
        if (stateTimer.current <= 0) {
          setGameState(GameState.PLAYING);
        }
        break;
      case GameState.PLAYING:
        if (!player.current) return;
        
        // Update mode timer (Chase/Scatter)
        modeTimer.current -= deltaTime;
        if (modeTimer.current <= 0) {
          currentMode.current = currentMode.current === 'scatter' ? 'chase' : 'scatter';
          modeTimer.current = currentMode.current === 'scatter' ? 7000 : 20000;
          ghosts.current.forEach(g => {
            if(g.state !== GhostState.FRIGHTENED && g.state !== GhostState.EATEN) {
              g.state = currentMode.current === 'chase' ? GhostState.CHASE : GhostState.SCATTER;
            }
          });
        }
        
        player.current.update();
        ghosts.current.forEach(ghost => ghost.update(player.current!, ghosts.current));

        // --- Collision and Event Logic ---
        const gridX = Math.floor(player.current.x / TILE_SIZE);
        const gridY = Math.floor(player.current.y / TILE_SIZE);

        // Pellet eating
        if (mapRef.current[gridY]?.[gridX] === 2) {
            mapRef.current[gridY][gridX] = 0;
            setScore(prev => prev + 10);
            pellets.current--;
        } else if (mapRef.current[gridY]?.[gridX] === 3) {
            mapRef.current[gridY][gridX] = 0;
            setScore(prev => prev + 50);
            ghosts.current.forEach(g => {
                if (g.state !== GhostState.EATEN) {
                    g.state = GhostState.FRIGHTENED;
                    g.frightenedTimer = 5000; // 5 seconds
                }
            });
        }

        // Ghost collision
        for (const ghost of ghosts.current) {
            const distance = Math.hypot(player.current.x - ghost.x, player.current.y - ghost.y);
            if (distance < TILE_SIZE) {
                if (ghost.state === GhostState.FRIGHTENED) {
                    setScore(prev => prev + 200);
                    ghost.state = GhostState.EATEN;
                } else if (ghost.state !== GhostState.EATEN) {
                    setGameState(GameState.PACMAN_DEATH_ANIMATION);
                    stateTimer.current = 2000; // 2 sec death animation
                    return;
                }
            }
        }

        // Win condition
        if (pellets.current === 0) {
            setGameState(GameState.LEVEL_COMPLETE);
            stateTimer.current = 3000; // 3 sec for level complete flash
        }
        break;
        
      case GameState.PACMAN_DEATH_ANIMATION:
        stateTimer.current -= deltaTime;
        if (stateTimer.current <= 0) {
          setLives(prev => prev - 1);
          if (lives - 1 > 0) {
            player.current?.reset();
            ghosts.current.forEach(g => g.reset());
            setGameState(GameState.GAME_START_ANIMATION);
            stateTimer.current = 2000; // "Ready!" time
          } else {
            setGameState(GameState.GAME_OVER);
          }
        }
        break;

      case GameState.LEVEL_COMPLETE:
        stateTimer.current -= deltaTime;
        if (stateTimer.current <= 0) {
            resetLevel();
            setGameState(GameState.GAME_START_ANIMATION);
            stateTimer.current = 2000;
        }
        break;
    }
  }, [gameState, lives, resetLevel]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw map
    for (let row = 0; row < mapRef.current.length; row++) {
      for (let col = 0; col < mapRef.current[0].length; col++) {
        const tile = mapRef.current[row][col];
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

    // Draw Entities
    if (gameState !== GameState.PACMAN_DEATH_ANIMATION) {
        player.current?.draw(ctx);
    } else {
        // Here you could draw a specific death animation frame for the player
        player.current?.draw(ctx); // For now, just draw player normally
    }
    ghosts.current.forEach(ghost => ghost.draw(ctx));
    
    // Draw UI overlays
    ctx.font = "24px 'Press Start 2P', monospace";
    ctx.fillStyle = "yellow";
    switch(gameState) {
        case GameState.START_SCREEN:
            ctx.textAlign = "center";
            ctx.fillText("PRESS ENTER TO START", ctx.canvas.width / 2, ctx.canvas.height / 2);
            break;
        case GameState.GAME_START_ANIMATION:
            ctx.textAlign = "center";
            ctx.fillText("READY!", ctx.canvas.width / 2, ctx.canvas.height / 2 + TILE_SIZE * 2);
            break;
        case GameState.GAME_OVER:
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.font = "16px 'Press Start 2P', monospace";
            ctx.fillText("Press Enter to Restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
            break;
        case GameState.LEVEL_COMPLETE:
            // Could draw flashing effect here
            break;
    }
  }, [gameState]);

  useEffect(() => {
    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      if (!isGameStarted || gameOver || gameWon || isDying) {
        stopGame();
        return;
      }
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      update(deltaTime);
      draw();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    lastTime = performance.now();
    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      stopGame();
    };
  }, [update, draw, stopGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.PLAYING && player.current) {
        switch (e.key) {
          case 'ArrowUp': case 'w': player.current.nextDirection = { dx: 0, dy: -1 }; break;
          case 'ArrowDown': case 's': player.current.nextDirection = { dx: 0, dy: 1 }; break;
          case 'ArrowLeft': case 'a': player.current.nextDirection = { dx: -1, dy: 0 }; break;
          case 'ArrowRight': case 'd': player.current.nextDirection = { dx: 1, dy: 0 }; break;
        }
      } else if (e.key === 'Enter') {
        if (gameState === GameState.START_SCREEN) {
          resetLevel();
          setGameState(GameState.GAME_START_ANIMATION);
          stateTimer.current = 2000; // Ready! time
        } else if (gameState === GameState.GAME_OVER) {
          resetGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, resetGame, resetLevel]);

  // Load best score on initial mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('pixman-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
    resetGame();
  }, [resetGame]);

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
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              <div className="relative w-full" style={{ aspectRatio: `${MAP[0].length}/${MAP.length}`, minHeight: '500px', maxHeight: '70vh' }}>
                <canvas 
                  ref={canvasRef} 
                  width={MAP[0].length * TILE_SIZE} 
                  height={MAP.length * TILE_SIZE} 
                  className="border-4 border-yellow-300 bg-black w-full h-full"
                  style={{ objectFit: 'contain' }}
                />
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
                  {GameState[gameState]}
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