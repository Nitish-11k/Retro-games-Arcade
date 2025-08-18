'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MAP, GHOSTS, PLAYER, TILE_SIZE, LEVEL_SETTINGS, Player, Ghost, GhostState } from '@/lib/pix-man-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

enum GameState {
  START_SCREEN,
  GAME_START_ANIMATION,
  PLAYING,
  PACMAN_DEATH_ANIMATION,
  GAME_OVER,
  LEVEL_COMPLETE,
}

const PixManGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  
  const player = useRef<Player | null>(null);
  const ghosts = useRef<Ghost[]>([]);
  const pellets = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const mapRef = useRef(JSON.parse(JSON.stringify(MAP)));
  const modeTimer = useRef(0);
  const currentMode = useRef<'scatter' | 'chase'>('scatter');
  const stateTimer = useRef(0);

  const getCurrentLevelSettings = useCallback(() => {
    return LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)];
  }, [level]);

  useEffect(() => {
    const savedBestScore = localStorage.getItem('pixman-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('pixman-best-score', score.toString());
    }
  }, [score, bestScore]);

  const resetLevel = useCallback((newLevel: number) => {
    setLevel(newLevel);
    mapRef.current = JSON.parse(JSON.stringify(MAP));
    const initialPelletCount = mapRef.current.flat().filter((tile: number) => tile === 0 || tile === 3).length;
    pellets.current = initialPelletCount;
    
    player.current = new Player(PLAYER.x, PLAYER.y);
    ghosts.current = GHOSTS.map(g => new Ghost(g.x, g.y, g.color, g.personality, newLevel));
    
    const settings = LEVEL_SETTINGS[Math.min(newLevel - 1, LEVEL_SETTINGS.length - 1)];
    currentMode.current = 'scatter';
    modeTimer.current = settings.scatterTime;
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    resetLevel(1);
    setGameState(GameState.START_SCREEN);
  }, [resetLevel]);

  const stopGame = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, []);

  const update = useCallback((deltaTime: number) => {
    const settings = getCurrentLevelSettings();

    switch (gameState) {
      case GameState.GAME_START_ANIMATION:
        stateTimer.current -= deltaTime;
        if (stateTimer.current <= 0) {
          setGameState(GameState.PLAYING);
        }
        break;
      case GameState.PLAYING:
        if (!player.current) return;
        
        modeTimer.current -= deltaTime;
        if (modeTimer.current <= 0) {
          currentMode.current = currentMode.current === 'scatter' ? 'chase' : 'scatter';
          modeTimer.current = currentMode.current === 'scatter' ? settings.scatterTime : settings.chaseTime;
          ghosts.current.forEach(g => {
            if(g.state !== GhostState.FRIGHTENED && g.state !== GhostState.EATEN) {
              g.state = currentMode.current === 'chase' ? GhostState.CHASE : GhostState.SCATTER;
            }
          });
        }
        
        player.current.update();
        ghosts.current.forEach(ghost => ghost.update(player.current!, ghosts.current, level, pellets.current));

        const gridX = Math.floor(player.current.x / TILE_SIZE);
        const gridY = Math.floor(player.current.y / TILE_SIZE);

        if (mapRef.current[gridY]?.[gridX] === 0) {
            mapRef.current[gridY][gridX] = 5;
            setScore(prev => prev + 10);
            pellets.current--;
        } else if (mapRef.current[gridY]?.[gridX] === 3) {
            mapRef.current[gridY][gridX] = 5;
            setScore(prev => prev + 50);
            if (settings.frightenedTime > 0) {
                ghosts.current.forEach(g => {
                    if (g.state !== GhostState.EATEN) {
                        g.state = GhostState.FRIGHTENED;
                        g.frightenedTimer = settings.frightenedTime;
                    }
                });
            }
        }

        for (const ghost of ghosts.current) {
            const distance = Math.hypot(player.current.x - ghost.x, player.current.y - ghost.y);
            if (distance < TILE_SIZE) {
                if (ghost.state === GhostState.FRIGHTENED) {
                    setScore(prev => prev + 200);
                    ghost.state = GhostState.EATEN;
                } else if (ghost.state !== GhostState.EATEN) {
                    setGameState(GameState.PACMAN_DEATH_ANIMATION);
                    stateTimer.current = 2000;
                    return;
                }
            }
        }

        if (pellets.current === 0) {
            setGameState(GameState.LEVEL_COMPLETE);
            stateTimer.current = 3000;
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
            stateTimer.current = 2000;
          } else {
            setGameState(GameState.GAME_OVER);
          }
        }
        break;

      case GameState.LEVEL_COMPLETE:
        stateTimer.current -= deltaTime;
        if (stateTimer.current <= 0) {
            const nextLevel = level + 1;
            resetLevel(nextLevel);
            setGameState(GameState.GAME_START_ANIMATION);
            stateTimer.current = 2000;
        }
        break;
    }
  }, [gameState, lives, resetLevel, level, getCurrentLevelSettings]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let row = 0; row < mapRef.current.length; row++) {
      for (let col = 0; col < mapRef.current[0].length; col++) {
        const tile = mapRef.current[row][col];
        if (tile === 1) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        } else if (tile === 0) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (tile === 3) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (gameState !== GameState.PACMAN_DEATH_ANIMATION) {
        player.current?.draw(ctx);
    } else {
        player.current?.draw(ctx);
    }
    ghosts.current.forEach(ghost => ghost.draw(ctx));
    
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
             ctx.textAlign = "center";
             ctx.fillText(`LEVEL ${level} COMPLETE`, ctx.canvas.width / 2, ctx.canvas.height / 2);
            break;
    }
  }, [gameState, level]);

  useEffect(() => {
    let lastTime = 0;
    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      if (!Number.isNaN(deltaTime) && deltaTime > 0) {
        update(deltaTime);
      }
      draw();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    lastTime = performance.now();
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => { stopGame(); };
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
          resetGame();
          setGameState(GameState.GAME_START_ANIMATION);
          stateTimer.current = 2000;
        } else if (gameState === GameState.GAME_OVER) {
          resetGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [gameState, resetGame]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleMobileInput = (direction: { dx: number; dy: number }) => {
    if (gameState === GameState.PLAYING && player.current) {
      player.current.nextDirection = direction;
    }
  };

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
              <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
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
          {isMobile && gameState === GameState.PLAYING && (
            <div className="mt-4 flex justify-center items-center">
                <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <Button onTouchStart={() => handleMobileInput({ dx: 0, dy: -1 })} className="bg-gray-700 active:bg-yellow-500"><ArrowUp /></Button>
                    <div></div>
                    <Button onTouchStart={() => handleMobileInput({ dx: -1, dy: 0 })} className="bg-gray-700 active:bg-yellow-500"><ArrowLeft /></Button>
                    <Button onTouchStart={() => handleMobileInput({ dx: 0, dy: 1 })} className="bg-gray-700 active:bg-yellow-500"><ArrowDown /></Button>
                    <Button onTouchStart={() => handleMobileInput({ dx: 1, dy: 0 })} className="bg-gray-700 active:bg-yellow-500"><ArrowRight /></Button>
                </div>
            </div>
          )}
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
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg text-red-500">{'♥ '.repeat(Math.max(0, lives))}</div>
                  <div className="text-xs text-gray-400">LIVES</div>
                </div>
                <div>
                  <div className="text-lg text-green-400">{bestScore}</div>
                  <div className="text-xs text-gray-400">BEST</div>
                </div>
                 <div>
                  <div className="text-lg text-blue-400">{level}</div>
                  <div className="text-xs text-gray-400">LEVEL</div>
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
            </CardContent>
          </Card>
        </aside>
      </div>
      
      {/* Game Description */}
      <div className="w-full mt-6">
        <Card className="bg-gray-800 border-2 border-yellow-400 shadow-[8px_8px_0px_#FBC02D]">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">👻 THE MAZE MASTER CHALLENGE</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                  Enter the classic maze and guide Pix-Man through corridors filled with pellets while avoiding colorful ghosts! 
                  Chomp your way through every dot to advance to the next level, but watch out for four unique ghost personalities!
                </p>
              </div>
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-blue-300 mb-2 sm:mb-3">👾 GHOST AI PERSONALITIES</h3>
                <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
                  <li>• <span className="text-red-400">Blinky</span>: Chases relentlessly</li>
                  <li>• <span className="text-pink-400">Pinky</span>: Tries to ambush ahead</li>
                  <li>• <span className="text-cyan-400">Inky</span>: Flanks unpredictably</li>
                  <li>• <span className="text-orange-400">Clyde</span>: Plays it cautious</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PixManGame;
