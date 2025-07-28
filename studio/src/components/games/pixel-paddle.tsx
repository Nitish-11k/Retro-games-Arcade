'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Play, RotateCcw, Trophy, Star, Crown, Lock, Zap, Target, Flame, Award, Medal } from 'lucide-react';
import { createPaddleAchievements, loadPaddleGameData, savePaddleGameData, type PaddleGameData } from '@/lib/pixel-paddle-utils';

// --- GAME CONSTANTS ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_START_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_SPEED = 500;
const BALL_RADIUS = 10;
const BASE_BALL_SPEED = 350;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_COLORS = {
  3: { base: '#D4AF37', light: '#FFFF00' }, // Yellow (Gold)
  2: { base: '#FF4500', light: '#FF6600' }, // Orange
  1: { base: '#B22222', light: '#FF0000' }, // Red
};

// --- INTERFACES ---
interface Brick {
  x: number; y: number;
  w: number; h: number;
  health: number;
  initialHealth: number;
  color: { base: string; light: string };
}

interface Ball {
  x: number; y: number;
  dx: number; dy: number;
  radius: number;
}

interface Particle {
  x: number; y: number;
  dx: number; dy: number;
  radius: number;
  life: number;
  color: string;
}

interface PowerUp {
  x: number; y: number;
  type: 'wide_paddle' | 'slow_ball';
  life: number; // For active timer
}

// --- AUDIO HOOKS (PLACEHOLDER) ---
const playSound = (sound: 'hit_brick' | 'hit_paddle' | 'lose_life' | 'get_powerup') => {
  // In a real app, you'd use a library like Howler.js here
  // console.log(`Playing sound: ${sound}`);
};

// --- PREDEFINED LEVELS ---
const predefinedLevels = [
  // Level 1
  [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 2
  [
    [2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 2, 1],
  ],
  // Level 3
  [
    [0, 2, 2, 2, 2, 2, 0],
    [2, 0, 1, 1, 1, 0, 2],
    [1, 1, 0, 0, 0, 1, 1],
  ],
  // Level 4
  [
    [3, 2, 1, 3, 1, 2, 3],
    [1, 0, 2, 0, 2, 0, 1],
    [2, 1, 0, 1, 0, 1, 2],
    [0, 2, 1, 2, 1, 2, 0],
  ],
];

const PixelPaddle: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopId = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pressedKeys = useRef<{ [key: string]: boolean }>({});
  const lifeDeductedRef = useRef<boolean>(false);

  const [gameState, setGameState] = useState<'START_SCREEN' | 'PLAYING' | 'LEVEL_COMPLETE' | 'GAME_OVER'>('START_SCREEN');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);

  const [level, setLevel] = useState(0);
  const [ballSpeed, setBallSpeed] = useState(BASE_BALL_SPEED);
  const [isClient, setIsClient] = useState(false);
  
  const [gameData, setGameData] = useState<PaddleGameData>(() => ({
    highScore: 0,
    achievements: [],
    leaderboard: [],
    totalGames: 0,
    totalScore: 0,
    highestLevel: 0,
    totalBricksDestroyed: 0,
  }));
  
  // --- Game Object States ---
  const [paddle, setPaddle] = useState({ x: 0, w: PADDLE_START_WIDTH });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: BALL_RADIUS });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);
  
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!isClient) return;
    const canvas = canvasRef.current;
    if (canvas) setPaddle(p => ({ ...p, x: (canvas.width - p.w) / 2 }));
    setGameData(loadPaddleGameData());
  }, [isClient]);

  // --- LEVEL GENERATION ---
  const generateLevelLayout = useCallback((levelNum: number): number[][] => {
    const rows = Math.min(8, 4 + Math.floor(levelNum / 3));
    const cols = 7;
    const layout: number[][] = [];
    const density = Math.min(0.85, 0.6 + levelNum * 0.02);
    const maxType = Math.min(3, 1 + Math.floor(levelNum / 4));

    for (let r = 0; r < rows; r++) {
      layout.push(Array.from({ length: cols }, () => 
        Math.random() < density ? 1 + Math.floor(Math.random() * maxType) : 0
      ));
    }
    return layout;
  }, []);

  // --- BRICK BUILDING ---
  const buildBricks = useCallback((currentLevel: number) => {
    const levelLayout = currentLevel < predefinedLevels.length 
      ? predefinedLevels[currentLevel] 
      : generateLevelLayout(currentLevel);
    
    const newBricks: Brick[] = [];
    if (!levelLayout?.[0]) return;

    const BRICK_OFFSET_LEFT = (CANVAS_WIDTH - (levelLayout[0].length * (BRICK_WIDTH + BRICK_PADDING) - BRICK_PADDING)) / 2;
    const BRICK_OFFSET_TOP = 60;

    levelLayout.forEach((row, r) => {
      row.forEach((type, c) => {
        if (type > 0) {
          newBricks.push({
            x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
            y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
            w: BRICK_WIDTH, h: BRICK_HEIGHT,
            health: type,
            initialHealth: type,
            color: BRICK_COLORS[type as keyof typeof BRICK_COLORS],
          });
        }
      });
    });
    setBricks(newBricks);
  }, [generateLevelLayout]);

  const createExplosion = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x, y,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        radius: Math.random() * 2 + 1,
        life: 30, // frames
        color: color,
      });
    }
    setParticles(p => [...p, ...newParticles]);
  };

  // --- MAIN GAME LOOP ---
  useEffect(() => {
    if (gameState !== 'PLAYING' || !isClient) {
      cancelAnimationFrame(gameLoopId.current);
      return;
    }

    const gameLoop = (timestamp: number) => {
      const deltaTime = (timestamp - (lastTimeRef.current || timestamp)) / 1000;
      lastTimeRef.current = timestamp;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      
      // 1. UPDATE LOGIC
      // Paddle
      setPaddle(p => {
        let newX = p.x;
        if (pressedKeys.current.a || pressedKeys.current.arrowleft) newX -= PADDLE_SPEED * deltaTime;
        if (pressedKeys.current.d || pressedKeys.current.arrowright) newX += PADDLE_SPEED * deltaTime;
        return { ...p, x: Math.max(0, Math.min(CANVAS_WIDTH - p.w, newX)) };
      });

      // Ball
      setBall(b => {
        let newBall = { ...b };
        newBall.x += newBall.dx * ballSpeed * deltaTime;
        newBall.y += newBall.dy * ballSpeed * deltaTime;

        // Wall collision with proper positioning
        // Left wall
        if (newBall.x - b.radius <= 0) {
          newBall.x = b.radius;
          newBall.dx = Math.abs(newBall.dx); // Ensure positive direction
        }
        // Right wall
        if (newBall.x + b.radius >= CANVAS_WIDTH) {
          newBall.x = CANVAS_WIDTH - b.radius;
          newBall.dx = -Math.abs(newBall.dx); // Ensure negative direction
        }
        // Top wall
        if (newBall.y - b.radius <= 0) {
          newBall.y = b.radius;
          newBall.dy = Math.abs(newBall.dy); // Ensure positive direction (downward)
        }

        // Paddle collision (with advanced physics)
        const paddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;
        if (newBall.dy > 0 && 
            newBall.y + b.radius >= paddleY && 
            newBall.y - b.radius < paddleY + PADDLE_HEIGHT &&
            newBall.x >= paddle.x && 
            newBall.x <= paddle.x + paddle.w) {
          
          playSound('hit_paddle');
          
          // Calculate hit position on paddle (-1 to 1)
          const hitPos = (newBall.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          
          // Calculate new angle based on hit position (max 75 degrees)
          const maxAngle = Math.PI * 75 / 180; // 75 degrees in radians
          const angle = hitPos * maxAngle;
          
          // Set new direction based on angle
          const speed = Math.sqrt(newBall.dx * newBall.dx + newBall.dy * newBall.dy);
          newBall.dx = Math.sin(angle) * speed;
          newBall.dy = -Math.abs(Math.cos(angle) * speed); // Ensure upward direction
          
          // Position ball just above paddle
          newBall.y = paddleY - b.radius;
          
          createExplosion(newBall.x, newBall.y, '#FFF2CC');
        }

        // Bottom collision (lose life)
        if (newBall.y + b.radius > CANVAS_HEIGHT && !lifeDeductedRef.current) {
          lifeDeductedRef.current = true;
          playSound('lose_life');
          setLives(l => {
            const newLives = Math.max(0, l - 1);
            if (newLives > 0) {
              // Reset ball and paddle after a short delay
              setTimeout(() => {
                resetBallAndPaddle();
                lifeDeductedRef.current = false;
              }, 100);
            } else {
              // Game over
              setTimeout(() => {
                handleGameOver();
                lifeDeductedRef.current = false;
              }, 100);
            }
            return newLives;
          });
          return b; // Return original ball state
        }
        
        return newBall;
      });

      // Brick collision
      let allBricksDestroyed = true;
      let bricksDestroyedThisFrame = 0;
      const newBricks = bricks.map(brick => {
        // Check if ball is colliding with brick
        const ballLeft = ball.x - ball.radius;
        const ballRight = ball.x + ball.radius;
        const ballTop = ball.y - ball.radius;
        const ballBottom = ball.y + ball.radius;
        
        const brickLeft = brick.x;
        const brickRight = brick.x + brick.w;
        const brickTop = brick.y;
        const brickBottom = brick.y + brick.h;
        
        if (ballRight > brickLeft && ballLeft < brickRight && 
            ballBottom > brickTop && ballTop < brickBottom) {
          
          playSound('hit_brick');
          
          // Determine collision side for better bounce physics
          const overlapLeft = ballRight - brickLeft;
          const overlapRight = brickRight - ballLeft;
          const overlapTop = ballBottom - brickTop;
          const overlapBottom = brickBottom - ballTop;
          
          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
          
          setBall(b => {
            let newBall = { ...b };
            
            if (minOverlap === overlapTop || minOverlap === overlapBottom) {
              // Hit top or bottom of brick
              newBall.dy = -newBall.dy;
              if (minOverlap === overlapTop) {
                newBall.y = brickTop - ball.radius;
              } else {
                newBall.y = brickBottom + ball.radius;
              }
            } else {
              // Hit left or right side of brick
              newBall.dx = -newBall.dx;
              if (minOverlap === overlapLeft) {
                newBall.x = brickLeft - ball.radius;
              } else {
                newBall.x = brickRight + ball.radius;
              }
            }
            
            return newBall;
          });
          
          const newBrick = { ...brick, health: brick.health - 1 };
          if (newBrick.health <= 0) {
            setScore(s => s + brick.initialHealth * 10);
            createExplosion(ball.x, ball.y, brick.color.light);
            bricksDestroyedThisFrame++;
            // Drop power-up chance
            if (brick.initialHealth === 3 && Math.random() < 0.3) {
              setPowerUps(pus => [...pus, { x: brick.x + brick.w / 2, y: brick.y, type: 'wide_paddle', life: 0 }]);
            }
            return null; // Mark for removal
          }
          return newBrick;
        } else {
          allBricksDestroyed = false;
          return brick;
        }
      }).filter(brick => brick !== null) as Brick[];
      
      if (bricksDestroyedThisFrame > 0) {
        setGameData(prev => ({ ...prev, totalBricksDestroyed: prev.totalBricksDestroyed + bricksDestroyedThisFrame }));
      }
      setBricks(newBricks);
      
      if (allBricksDestroyed && bricks.length > 0) {
          setGameState('LEVEL_COMPLETE');
          if (level + 1 > gameData.highestLevel) {
            setGameData(prev => ({...prev, highestLevel: level + 1}));
          }
      }

      // Particles
      setParticles(parts => parts.map(p => ({
        ...p,
        x: p.x + p.dx,
        y: p.y + p.dy,
        life: p.life - 1,
      })).filter(p => p.life > 0));
      
      // Power-ups
      const now = Date.now();
      setPowerUps(pus => {
          const updated = pus.map(p => ({ ...p, y: p.y + 200 * deltaTime }));
          for (let i = updated.length - 1; i >= 0; i--) {
              const pu = updated[i];
              if (pu.x > paddle.x && pu.x < paddle.x + paddle.w && pu.y > CANVAS_HEIGHT - PADDLE_HEIGHT) {
                  playSound('get_powerup');
                  setActivePowerUp({ ...pu, life: now + 7000 }); // 7 seconds
                  updated.splice(i, 1);
              } else if (pu.y > CANVAS_HEIGHT) {
                  updated.splice(i, 1);
              }
          }
          return updated;
      });
      if (activePowerUp && now > activePowerUp.life) {
          setActivePowerUp(null);
      }
      setPaddle(p => ({ ...p, w: activePowerUp?.type === 'wide_paddle' ? 150 : PADDLE_START_WIDTH }));
      
      // 2. DRAW LOGIC
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Bricks
      bricks.forEach(brick => {
        const colorRatio = brick.health / brick.initialHealth;
        ctx.fillStyle = brick.color.light;
        ctx.globalAlpha = 0.2 + (0.8 * colorRatio);
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = brick.color.base;
        ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
      });

      // Paddle
      ctx.fillStyle = '#FFCC00';
      ctx.fillRect(paddle.x, CANVAS_HEIGHT - PADDLE_HEIGHT, paddle.w, PADDLE_HEIGHT);
      
      // Ball
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Power-ups
      powerUps.forEach(p => {
        ctx.fillStyle = '#39FF14'; // Neon green
        ctx.fillRect(p.x - 15, p.y, 30, 15);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('W', p.x - 5, p.y + 12);
      });
      
      gameLoopId.current = requestAnimationFrame(gameLoop);
    };
    gameLoopId.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopId.current);
  }, [gameState, isClient, ball, bricks, paddle, lives, level, gameData, ballSpeed, activePowerUp]);
  
  // --- CONTROLS ---
  useEffect(() => {
    if (!isClient) return;
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      pressedKeys.current[e.key.toLowerCase()] = isDown;
    };
    const down = (e: KeyboardEvent) => handleKey(e, true);
    const up = (e: KeyboardEvent) => handleKey(e, false);
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, [isClient]);

  // --- GAME STATE FUNCTIONS ---
  const resetBallAndPaddle = useCallback(() => {
    setPaddle(p => ({ ...p, x: (CANVAS_WIDTH - p.w) / 2 }));
    
    // Generate a random angle between -45 and 45 degrees for initial ball direction
    const angle = (Math.random() - 0.5) * Math.PI / 2; // -45 to 45 degrees
    const dx = Math.sin(angle);
    const dy = -Math.abs(Math.cos(angle)); // Always start going upward
    
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
      dx: dx,
      dy: dy,
      radius: BALL_RADIUS,
    });
    
    // Reset particles and power-ups when ball resets
    setParticles([]);
    setPowerUps([]);
    setActivePowerUp(null);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('GAME_OVER');
    setGameData(prevData => {
      const currentScore = scoreRef.current;
      const newGameData = {
        ...prevData,
        totalGames: (prevData.totalGames || 0) + 1,
        totalScore: (prevData.totalScore || 0) + currentScore,
        highScore: Math.max(prevData.highScore || 0, currentScore),
        leaderboard: [...(prevData.leaderboard || []), {
          name: 'Player',
          score: currentScore,
          level: level + 1,
          date: new Date().toLocaleDateString(),
        }].sort((a, b) => b.score - a.score).slice(0, 10),
      };
      savePaddleGameData(newGameData);
      return newGameData;
    });
  }, [level]);

  const startGame = (startLevel: number, resetScore: boolean = true) => {
    setLevel(startLevel);
    // Progressive speed increase: starts slow, gets exponentially faster
    // Level 0: 350, Level 1: 385, Level 2: 438, Level 3: 514, Level 4: 615, etc.
    const speedMultiplier = 1 + (startLevel * 0.1) + (startLevel * startLevel * 0.025);
    setBallSpeed(Math.floor(BASE_BALL_SPEED * speedMultiplier));
    
    // Only reset score if explicitly requested (new game), not when advancing levels
    if (resetScore) {
      setScore(0);
    }
    
    setLives(3);
    buildBricks(startLevel);
    resetBallAndPaddle();
    lastTimeRef.current = 0;
    lifeDeductedRef.current = false; // Reset life deduction flag
    setGameState('PLAYING');
  };
  
  const nextLevel = () => {
    const next = level + 1;
    // Add level completion bonus to score
    const levelBonus = (level + 1) * 100; // Bonus increases with level
    setScore(prevScore => prevScore + levelBonus);
    
    // Start next level without resetting score
    startGame(next, false);
  };

  const resetGame = () => {
    setGameState('START_SCREEN');
    setScore(0);
    setLives(3);
    setLevel(0);
    setBallSpeed(BASE_BALL_SPEED);
  };
  
  const achievements = createPaddleAchievements(gameData);
  const iconMap = { Target, Star, Award, Medal, Crown, Trophy, Flame, Zap };
  type IconName = keyof typeof iconMap;
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 flex items-center justify-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">PIXEL PADDLE</h1>
          <p className="text-sm text-green-400 animate-pulse">LOADING ARCADE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">PIXEL PADDLE</h1>
        <p className="text-sm text-green-400">A RETRO BREAKOUT ADVENTURE</p>
      </header>
      
      <div className="mb-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-green-400 shadow-[8px_8px_0px_#2E7D32]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  {gameState === 'PLAYING' ? (
                     <Button onClick={resetGame} className="bg-red-600 text-white hover:bg-red-700">
                       <RotateCcw className="w-4 h-4 mr-2" /> QUIT
                     </Button>
                  ) : (
                    <Button onClick={() => startGame(0, true)} className="bg-yellow-400 text-black hover:bg-yellow-300">
                      <Play className="w-4 h-4 mr-2" /> PLAY
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              <div className="relative">
                <canvas 
                  ref={canvasRef} 
                  width={CANVAS_WIDTH} 
                  height={CANVAS_HEIGHT} 
                  className="border-4 border-yellow-300 bg-gray-900"
                  style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
                />
                {gameState !== 'PLAYING' && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    {gameState === 'START_SCREEN' && (
                      <>
                        <h3 className="text-2xl mb-4 font-bold text-yellow-300">PIXEL PADDLE</h3>
                        <p className="text-sm mb-2 text-gray-300">USE A/D KEYS TO CONTROL PADDLE</p>
                        <p className="text-xs text-gray-400 mb-4">BREAK ALL THE BRICKS!</p>
                        <Button onClick={() => startGame(0, true)} className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-8 py-6">
                          START GAME
                        </Button>
                      </>
                    )}
                    {gameState === 'LEVEL_COMPLETE' && (
                      <>
                        <h3 className="text-2xl mb-2 font-bold text-green-400">LEVEL COMPLETE!</h3>
                        <p className="text-lg mb-2 text-gray-200">SCORE: {score}</p>
                        <p className="text-sm mb-4 text-yellow-400">LEVEL BONUS: +{(level + 1) * 100} POINTS</p>
                        <Button onClick={nextLevel} className="bg-yellow-400 text-black hover:bg-yellow-300">
                          NEXT LEVEL
                        </Button>
                      </>
                    )}
                    {gameState === 'GAME_OVER' && (
                      <>
                        <h3 className="text-2xl mb-2 font-bold text-red-500">GAME OVER</h3>
                        <p className="text-lg mb-2 text-gray-200">FINAL SCORE: {scoreRef.current}</p>
                        <p className="text-sm mb-4 text-yellow-400">
                          {scoreRef.current === gameData.highScore ? 'NEW HIGH SCORE!' : `BEST: ${gameData.highScore}`}
                       </p>
                        <Button onClick={resetGame} className="bg-yellow-400 text-black hover:bg-yellow-300">
                          PLAY AGAIN
                        </Button>
                      </>
                    )}
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
                  <div className="text-lg text-green-400">{gameData.highScore}</div>
                  <div className="text-xs text-gray-400">BEST</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-yellow-300/20">
                <div>
                  <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">
                    LEVEL {level + 1}
                  </Badge>
                </div>
                <div>
                  <Badge variant="outline" className="text-blue-300 border-blue-300/50">
                    SPEED {Math.floor(ballSpeed)}
                  </Badge>
                </div>
              </div>
              {activePowerUp && (
                <div className="text-center pt-2 border-t border-green-400/20">
                  <Badge variant="outline" className="text-green-400 border-green-400/50 animate-pulse">
                    {activePowerUp.type === 'wide_paddle' ? 'WIDE PADDLE' : 'SLOW BALL'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-green-400">
             <CardHeader className="pb-2">
               <CardTitle className="text-green-400 text-sm">RECORDS</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 gap-2">
               <Dialog>
                 <DialogTrigger asChild>
                   <Button className="w-full bg-green-600 text-white hover:bg-green-500">
                     <Trophy className="w-4 h-4 mr-2" />LEADERBOARD
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-gray-900 border-green-400 text-gray-200">
                   <DialogHeader>
                     <DialogTitle className="text-green-400">LEADERBOARD</DialogTitle>
                   </DialogHeader>
                   <Tabs defaultValue="global" className="w-full">
                     <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-green-400/50">
                       <TabsTrigger value="global">GLOBAL</TabsTrigger>
                       <TabsTrigger value="friends" disabled>FRIENDS <Lock className="w-3 h-3 ml-2" /></TabsTrigger>
                     </TabsList>
                     <TabsContent value="global">
                       <ScrollArea className="h-72 pr-3">
                         {gameData.leaderboard.length > 0 ? gameData.leaderboard.map((entry, i) => (
                           <div key={i} className="flex items-center justify-between p-2 my-1 bg-green-500/10 border-l-2 border-green-500">
                             <div className="flex items-center gap-3">
                               <Badge variant="secondary" className="bg-green-500/50">#{i + 1}</Badge>
                               <span>{entry.name}</span>
                             </div>
                             <span className="font-bold">{entry.score}</span>
                           </div>
                         )) : <p className="text-center py-8">NO SCORES YET!</p>}
                       </ScrollArea>
                     </TabsContent>
                   </Tabs>
                 </DialogContent>
               </Dialog>
              
               <Dialog>
                 <DialogTrigger asChild>
                   <Button className="w-full bg-yellow-600 text-white hover:bg-yellow-500">
                     <Star className="w-4 h-4 mr-2" />ACHIEVEMENTS
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="bg-gray-900 border-yellow-400 text-gray-200">
                   <DialogHeader>
                     <DialogTitle className="text-yellow-400">ACHIEVEMENTS</DialogTitle>
                   </DialogHeader>
                   <ScrollArea className="h-80 pr-3">
                     <div className="space-y-3">
                       {achievements.map((a) => {
                         const Icon = iconMap[a.iconName as IconName];
                         return (
                           <div key={a.id} className={`p-3 border ${a.unlocked ? 'bg-yellow-400/10 border-yellow-400' : 'bg-gray-800 border-gray-700 opacity-60'}`}>
                             <div className="flex items-center gap-3 mb-2">
                               <div className={`p-2 ${a.unlocked ? 'bg-yellow-400' : 'bg-gray-700'}`}>
                                 <Icon className={`w-4 h-4 ${a.unlocked ? 'text-black' : 'text-gray-200'}`} />
                               </div>
                               <div className="flex-1">
                                 <h4 className="font-bold text-sm">{a.name}</h4>
                                 <p className="text-xs text-gray-400">{a.description}</p>
                               </div>
                               {a.unlocked && (
                                 <Badge className="bg-yellow-400 text-black">✓</Badge>
                               )}
                             </div>
                             <Progress value={(a.current / a.requirement) * 100} className="h-1 [&>div]:bg-yellow-400" />
                             <p className="text-xs text-gray-500 mt-1 text-right">{a.current} / {a.requirement}</p>
                           </div>
                         );
                       })}
                     </div>
                   </ScrollArea>
                 </DialogContent>
               </Dialog>
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

export default PixelPaddle;