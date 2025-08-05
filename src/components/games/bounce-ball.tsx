'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import {
  BOUNCE_BALL_CONFIG as CONFIG,
  LEVELS,
  Player,
  GameManager,
  createGameManager,
  createPlayer,
  checkCircleRectCollision
} from '@/lib/bounce-ball-utils';

const BounceBallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameManager, setGameManager] = useState<GameManager>(createGameManager());
  const [highScore, setHighScore] = useState(0);

  const playerRef = useRef<Player>(createPlayer(CONFIG.GAME_WIDTH / 2, 100));
  const levelData = useRef({
    platforms: LEVELS[0].platforms,
    collectibles: LEVELS[0].collectibles.map(c => ({...c})),
    hazards: LEVELS[0].hazards,
    exit: LEVELS[0].exit
  });
  const keysPressed = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem('bounceBallHighScore');
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (gameManager.score > highScore) {
      setHighScore(gameManager.score);
      localStorage.setItem('bounceBallHighScore', gameManager.score.toString());
    }
  }, [gameManager.score, highScore]);

  const resetLevel = (levelIndex: number) => {
    playerRef.current = createPlayer(CONFIG.GAME_WIDTH / 2, 100);
    const currentLevel = LEVELS[levelIndex];
    levelData.current = {
      platforms: currentLevel.platforms,
      collectibles: currentLevel.collectibles.map(c => ({...c})),
      hazards: currentLevel.hazards,
      exit: currentLevel.exit,
    };
  };

  const startGame = () => {
    setGameManager(createGameManager());
    resetLevel(0);
  };

  const handlePlayerDeath = () => {
    setGameManager(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        return { ...prev, lives: 0, gameState: 'GameOver' };
      }
      resetLevel(prev.currentLevel);
      return { ...prev, lives: newLives };
    });
  };

  const gameLoop = useCallback((timestamp: number) => {
    if (gameManager.gameState !== 'Playing') {
      lastTimeRef.current = timestamp;
      requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    const player = playerRef.current;

    // Handle Input
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      player.vx = -CONFIG.MOVEMENT_SPEED;
    } else if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      player.vx = CONFIG.MOVEMENT_SPEED;
    } else {
      player.vx = 0;
    }

    if (keysPressed.current.has(' ') || keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      if (player.jumps < CONFIG.MAX_JUMPS) {
        player.vy = -CONFIG.JUMP_FORCE;
        player.jumps++;
        player.isGrounded = false;
      }
    }

    // Apply Gravity
    if (!player.isGrounded) {
      player.vy += CONFIG.GRAVITY * deltaTime;
    }

    // Update Position
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;
    player.isGrounded = false;

    // Collision Detection
    // Floor
    if (player.y + CONFIG.PLAYER_RADIUS > CONFIG.GAME_HEIGHT) {
      player.y = CONFIG.GAME_HEIGHT - CONFIG.PLAYER_RADIUS;
      player.vy = 0;
      player.isGrounded = true;
      player.jumps = 0;
    }

    // Platforms
    levelData.current.platforms.forEach(p => {
      if (checkCircleRectCollision(player.x, player.y, CONFIG.PLAYER_RADIUS, p.x, p.y, p.width, p.height)) {
        const prevPlayerY = player.y - player.vy * deltaTime;
        if (prevPlayerY + CONFIG.PLAYER_RADIUS <= p.y && player.vy >= 0) {
          player.y = p.y - CONFIG.PLAYER_RADIUS;
          player.vy = 0;
          player.isGrounded = true;
          player.jumps = 0;
        } else {
          // Side collision logic simplified
          if (player.vx > 0) player.x = p.x - CONFIG.PLAYER_RADIUS;
          else if (player.vx < 0) player.x = p.x + p.width + CONFIG.PLAYER_RADIUS;
        }
      }
    });

    // Hazards
    levelData.current.hazards.forEach(h => {
        if (checkCircleRectCollision(player.x, player.y, CONFIG.PLAYER_RADIUS, h.x, h.y, h.width, h.height)) {
            handlePlayerDeath();
        }
    });

    // Collectibles
    levelData.current.collectibles.forEach((c) => {
      if (!c.collected && checkCircleRectCollision(player.x, player.y, CONFIG.PLAYER_RADIUS, c.x, c.y, 10, 10)) {
        c.collected = true;
        setGameManager(prev => ({...prev, score: prev.score + 100}));
      }
    });

    // Render
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
      ctx.fillStyle = '#0A0A1E';
      ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
      
      // Draw elements
      levelData.current.platforms.forEach(p => {
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });
      levelData.current.hazards.forEach(h => {
        ctx.fillStyle = '#FF3864';
        ctx.fillRect(h.x, h.y, h.width, h.height);
      });
      levelData.current.collectibles.forEach(c => {
        if (!c.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw player
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(player.x, player.y, CONFIG.PLAYER_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(gameLoop);
  }, [gameManager.gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameLoop]);

    return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: CONFIG.FONT_FAMILY }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-cyan-300 mb-2">BOUNCE BALL</h1>
        <p className="text-sm text-green-400">A RETRO PLATFORMER ADVENTURE</p>
      </header>

      <div className="mb-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-cyan-400 shadow-[8px_8px_0px_#008B8B]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-cyan-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={startGame} className="bg-cyan-600 text-white hover:bg-cyan-700">
                    <RotateCcw className="w-4 h-4 mr-2" /> RESTART
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
                <canvas ref={canvasRef} width={CONFIG.GAME_WIDTH} height={CONFIG.GAME_HEIGHT} />
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
            <Card className="bg-gray-800 border-2 border-cyan-300 shadow-[4px_4px_0px_#008B8B]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-cyan-300 text-sm">SCORE BOARD</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                        <div className="text-3xl font-bold text-white">{String(gameManager.score).padStart(5, '0')}</div>
                        <div className="text-xs text-cyan-400/80">SCORE</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                            <div className="text-lg text-red-500">{'♥ '.repeat(gameManager.lives)}</div>
                            <div className="text-xs text-gray-400">LIVES</div>
                        </div>
                        <div>
                            <div className="text-lg text-green-400">{String(gameManager.timerScore).padStart(7, '0')}</div>
                            <div className="text-xs text-gray-400">TIMER</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <div className="flex justify-around">
                <Button onMouseDown={() => keysPressed.current.add('arrowleft')} onMouseUp={() => keysPressed.current.delete('arrowleft')} className="w-20 h-20 rounded-full"><ArrowLeft /></Button>
                <Button onMouseDown={() => keysPressed.current.add(' ')} onMouseUp={() => keysPressed.current.delete(' ')} className="w-20 h-20 rounded-full"><ArrowUp /></Button>
                <Button onMouseDown={() => keysPressed.current.add('arrowright')} onMouseUp={() => keysPressed.current.delete('arrowright')} className="w-20 h-20 rounded-full"><ArrowRight /></Button>
            </div>
            <Button onClick={() => setGameManager(prev => ({...prev, gameState: prev.gameState === 'Playing' ? 'Paused' : 'Playing'}))}>
                {gameManager.gameState === 'Playing' ? <Pause /> : <Play />}
            </Button>
        </aside>
      </div>
      <footer className="mt-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">FOOTER ADVERTISEMENT</p>
      </footer>
    </div>
  );
}

export default BounceBallGame;

