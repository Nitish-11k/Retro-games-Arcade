'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pause, Play, RotateCcw, Star, Heart, Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// --- GAME CONSTANTS ---
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

// Physics
const GRAVITY = 2000; // px/s^2
const MOVE_ACCELERATION = 3000; // px/s^2
const MAX_MOVE_SPEED = 450; // px/s
const GROUND_FRICTION = 2200; // px/s^2 (applied to vx when grounded and no input)
const JUMP_VELOCITY = 800; // px/s upward
const RESTITUTION = 0.15; // small bounce
const COYOTE_TIME_MS = 120; // grace period after leaving ground
const JUMP_BUFFER_MS = 140; // accept jump shortly before landing

// Types
interface Vector2 { x: number; y: number }
interface Circle { x: number; y: number; r: number }
interface Rect { x: number; y: number; w: number; h: number }
interface Enemy extends Rect { dir: 1 | -1; minX: number; maxX: number; speed: number; alive: boolean }
interface StarItem extends Circle { collected: boolean }

type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'LEVEL_COMPLETE' | 'GAME_OVER';

// Simple helpers
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function aabbIntersect(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function circleRectIntersect(c: Circle, r: Rect) {
  const closestX = clamp(c.x, r.x, r.x + r.w);
  const closestY = clamp(c.y, r.y, r.y + r.h);
  const dx = c.x - closestX;
  const dy = c.y - closestY;
  return (dx * dx + dy * dy) <= c.r * c.r;
}

const RedBallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const jumpQueuedRef = useRef<boolean>(false);
  const lastGroundedAtRef = useRef<number>(-Infinity);
  const lastJumpPressedAtRef = useRef<number>(-Infinity);
  const isClient = typeof window !== 'undefined';
  const isMobile = useIsMobile();

  // Player
  const [player, setPlayer] = useState<{ pos: Vector2; vel: Vector2; r: number; isOnGround: boolean }>({
    pos: { x: 120, y: 300 },
    vel: { x: 0, y: 0 },
    r: 16,
    isOnGround: false,
  });

  // Level
  const platformsRef = useRef<Rect[]>([]);
  const hazardsRef = useRef<Rect[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const starsRef = useRef<StarItem[]>([]);
  const goalRef = useRef<Rect>({ x: 880, y: 380, w: 30, h: 90 });

  // UI / Progress
  const [state, setState] = useState<GameState>('START');
  const [lives, setLives] = useState<number>(3);
  const [collectedStars, setCollectedStars] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  // Mobile controls
  const [mobileMove, setMobileMove] = useState<'left' | 'right' | null>(null);

  // Build a simple demo level with platforms, hazards, enemies, and stars
  const buildLevel = useCallback(() => {
    platformsRef.current = [
      { x: 0, y: 500, w: 960, h: 40 }, // ground
      { x: 60, y: 440, w: 120, h: 20 },
      { x: 260, y: 400, w: 160, h: 20 },
      { x: 520, y: 340, w: 120, h: 20 },
      { x: 720, y: 420, w: 140, h: 20 },
      { x: 400, y: 480, w: 60, h: 20 }, // small step
    ];

    hazardsRef.current = [
      { x: 200, y: 500 - 16, w: 80, h: 16 }, // spikes bar
      { x: 600, y: 500 - 16, w: 80, h: 16 },
    ];

    enemiesRef.current = [
      { x: 320, y: 380, w: 24, h: 24, dir: 1, minX: 320, maxX: 420, speed: 80, alive: true },
      { x: 760, y: 400, w: 24, h: 24, dir: -1, minX: 720, maxX: 860, speed: 90, alive: true },
    ];

    starsRef.current = [
      { x: 110, y: 430, r: 8, collected: false },
      { x: 340, y: 370, r: 8, collected: false },
      { x: 760, y: 390, r: 8, collected: false },
    ];

    setTotalStars(starsRef.current.length);
  }, []);

  const resetPlayer = useCallback(() => {
    setPlayer({ pos: { x: 120, y: 300 }, vel: { x: 0, y: 0 }, r: 16, isOnGround: false });
  }, []);

  const startGame = () => {
    setCollectedStars(0);
    setScore(0);
    setLives(3);
    buildLevel();
    resetPlayer();
    lastTimeRef.current = 0;
    setState('PLAYING');
  };

  const restartAfterDeath = () => {
    buildLevel();
    resetPlayer();
    lastTimeRef.current = 0;
    setState('PLAYING');
  };

  // Input
  useEffect(() => {
    if (!isClient) return;
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        jumpQueuedRef.current = true;
        lastJumpPressedAtRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      }
      if (e.key === 'p') {
        setState((s) => (s === 'PLAYING' ? 'PAUSED' : s === 'PAUSED' ? 'PLAYING' : s));
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [isClient]);

  // Physics and game loop
  useEffect(() => {
    if (!isClient) return;
    if (state !== 'PLAYING') {
      cancelAnimationFrame(requestIdRef.current);
      return;
    }

    const loop = (ts: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const dt = Math.min(0.033, (ts - (lastTimeRef.current || ts)) / 1000);
      lastTimeRef.current = ts;

      // Update
      setPlayer((prev) => {
        const next = { ...prev, pos: { ...prev.pos }, vel: { ...prev.vel }, isOnGround: false };

        // Horizontal input
        const movingLeft = keysRef.current['arrowleft'] || keysRef.current['a'] || mobileMove === 'left';
        const movingRight = keysRef.current['arrowright'] || keysRef.current['d'] || mobileMove === 'right';
        if (movingLeft) next.vel.x -= MOVE_ACCELERATION * dt;
        if (movingRight) next.vel.x += MOVE_ACCELERATION * dt;
        if (!movingLeft && !movingRight && next.isOnGround) {
          // Apply friction towards zero
          const sign = Math.sign(next.vel.x);
          const mag = Math.max(0, Math.abs(next.vel.x) - GROUND_FRICTION * dt);
          next.vel.x = mag * sign;
        }
        next.vel.x = clamp(next.vel.x, -MAX_MOVE_SPEED, MAX_MOVE_SPEED);

        // Gravity
        next.vel.y += GRAVITY * dt;

        // Jump handling (coyote time + jump buffer)
        const nowMs = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const canCoyote = nowMs - lastGroundedAtRef.current <= COYOTE_TIME_MS;
        const hasBufferedJump = nowMs - lastJumpPressedAtRef.current <= JUMP_BUFFER_MS;
        if ((jumpQueuedRef.current || hasBufferedJump) && (prev.isOnGround || canCoyote)) {
          next.vel.y = -JUMP_VELOCITY;
          next.isOnGround = false;
          jumpQueuedRef.current = false;
          lastJumpPressedAtRef.current = -Infinity; // consume
        } else {
          jumpQueuedRef.current = false;
        }

        // Integrate position
        next.pos.x += next.vel.x * dt;
        next.pos.y += next.vel.y * dt;

        // World bounds (left/right)
        if (next.pos.x - next.r < 0) { next.pos.x = next.r; next.vel.x *= -RESTITUTION; }
        if (next.pos.x + next.r > CANVAS_WIDTH) { next.pos.x = CANVAS_WIDTH - next.r; next.vel.x *= -RESTITUTION; }

        // Collisions with platforms
        for (const plat of platformsRef.current) {
          if (!circleRectIntersect({ x: next.pos.x, y: next.pos.y, r: next.r }, plat)) continue;

          // Resolve by minimal translation along axes via AABB approach
          const closestX = clamp(next.pos.x, plat.x, plat.x + plat.w);
          const closestY = clamp(next.pos.y, plat.y, plat.y + plat.h);
          const dx = next.pos.x - closestX;
          const dy = next.pos.y - closestY;

          // Determine penetration vector by testing small steps
          const overlapX = next.r - Math.abs(dx);
          const overlapY = next.r - Math.abs(dy);

          if (overlapX < overlapY) {
            // Resolve horizontally
            if (dx > 0) { next.pos.x += overlapX; } else { next.pos.x -= overlapX; }
            next.vel.x *= -RESTITUTION;
          } else {
            // Resolve vertically
            if (dy > 0) { // from below
              next.pos.y += overlapY;
              next.vel.y = Math.abs(next.vel.y) * RESTITUTION;
            } else { // from above
              next.pos.y -= overlapY;
              next.vel.y = -Math.abs(next.vel.y) * RESTITUTION;
              next.isOnGround = true;
              lastGroundedAtRef.current = (typeof performance !== 'undefined' ? performance.now() : Date.now());
            }
          }
        }

        // Hazards -> lose life
        for (const hz of hazardsRef.current) {
          if (circleRectIntersect({ x: next.pos.x, y: next.pos.y, r: next.r }, hz)) {
            // Lose a life and reset
            setLives((l) => {
              const nl = l - 1;
              if (nl <= 0) {
                setState('GAME_OVER');
              } else {
                setTimeout(restartAfterDeath, 150);
              }
              return nl;
            });
            return prev; // keep previous until reset happens
          }
        }

        // Enemies
        enemiesRef.current = enemiesRef.current.map((en) => {
          if (!en.alive) return en;
          // Patrol
          en.x += en.dir * en.speed * dt;
          if (en.x < en.minX) { en.x = en.minX; en.dir = 1; }
          if (en.x + en.w > en.maxX) { en.x = en.maxX - en.w; en.dir = -1; }

          const ballRect: Rect = { x: next.pos.x - next.r, y: next.pos.y - next.r, w: next.r * 2, h: next.r * 2 };
          const enemyRect: Rect = { x: en.x, y: en.y, w: en.w, h: en.h };
          if (aabbIntersect(ballRect, enemyRect)) {
            // If falling and top-hit -> defeat enemy, bounce
            const falling = next.vel.y > 0;
            const hitFromTop = (ballRect.y + ballRect.h) - enemyRect.y < 16;
            if (falling && hitFromTop) {
              en.alive = false;
              next.vel.y = -JUMP_VELOCITY * 0.6; // bounce
            } else {
              // Hurt player
              setLives((l) => {
                const nl = l - 1;
                if (nl <= 0) {
                  setState('GAME_OVER');
                } else {
                  setTimeout(restartAfterDeath, 150);
                }
                return nl;
              });
              return en;
            }
          }
          return en;
        });

        // Stars
        starsRef.current = starsRef.current.map((s) => {
          if (s.collected) return s;
          if (circleRectIntersect({ x: next.pos.x, y: next.pos.y, r: next.r }, { x: s.x - s.r, y: s.y - s.r, w: s.r * 2, h: s.r * 2 })) {
            s.collected = true;
            setCollectedStars((c) => c + 1);
            setScore((sc) => sc + 10);
          }
          return s;
        });

        // Goal
        if (circleRectIntersect({ x: next.pos.x, y: next.pos.y, r: next.r }, goalRef.current)) {
          setScore((sc) => sc + 100);
          setState('LEVEL_COMPLETE');
        }

        // Fall off map -> life lost
        if (next.pos.y - next.r > CANVAS_HEIGHT + 100) {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) {
              setState('GAME_OVER');
            } else {
              setTimeout(restartAfterDeath, 150);
            }
            return nl;
          });
          return prev;
        }

        return next;
      });

      // Draw
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // Background
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Decorative grid
      ctx.strokeStyle = 'rgba(255,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
      }

      // Platforms
      for (const p of platformsRef.current) {
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#81c784';
        ctx.strokeRect(p.x, p.y, p.w, p.h);
      }

      // Hazards (spikes as red bars with triangles)
      for (const h of hazardsRef.current) {
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(h.x, h.y, h.w, h.h);
        ctx.fillStyle = '#ef5350';
        const spikes = Math.floor(h.w / 10);
        for (let i = 0; i < spikes; i++) {
          const sx = h.x + i * 10 + 5;
          ctx.beginPath();
          ctx.moveTo(sx - 5, h.y + h.h);
          ctx.lineTo(sx, h.y);
          ctx.lineTo(sx + 5, h.y + h.h);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Enemies (evil squares)
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        ctx.fillStyle = '#ff6f00';
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.strokeStyle = '#ffe082';
        ctx.strokeRect(e.x, e.y, e.w, e.h);
        // simple eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(e.x + 5, e.y + 6, 4, 4);
        ctx.fillRect(e.x + e.w - 9, e.y + 6, 4, 4);
      }

      // Stars
      for (const s of starsRef.current) {
        if (s.collected) continue;
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff59d';
        ctx.stroke();
      }

      // Goal flag
      const goal = goalRef.current;
      ctx.fillStyle = '#1565c0';
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
      ctx.fillStyle = '#42a5f5';
      ctx.fillRect(goal.x + goal.w, goal.y, 18, 12);

      // Player (red ball)
      const p = player;
      ctx.shadowColor = '#ff5252';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      requestIdRef.current = requestAnimationFrame(loop);
    };

    requestIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestIdRef.current);
  }, [state, isClient, mobileMove, restartAfterDeath, player]);

  // Build level initially
  useEffect(() => {
    if (!isClient) return;
    buildLevel();
    // Load high score
    try {
      const saved = localStorage.getItem('redball_high_score');
      if (saved) setHighScore(Number(saved) || 0);
    } catch {}
  }, [isClient, buildLevel]);

  // Persist high score when beating it
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try { localStorage.setItem('redball_high_score', String(score)); } catch {}
    }
  }, [score, highScore]);

  // UI
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl text-red-400">RED BALL QUEST</h1>
        <p className="text-xs text-gray-400">ROLL • JUMP • COLLECT • SURVIVE</p>
      </header>

      <div className="mb-4 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-red-400 shadow-[8px_8px_0px_#B71C1C]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-red-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  {state === 'PLAYING' && (
                    <Button onClick={() => setState('PAUSED')} className="bg-red-600 hover:bg-red-700 text-white"><Pause className="w-4 h-4 mr-1"/>PAUSE</Button>
                  )}
                  {state === 'PAUSED' && (
                    <Button onClick={() => setState('PLAYING')} className="bg-green-600 hover:bg-green-700 text-white"><Play className="w-4 h-4 mr-1"/>RESUME</Button>
                  )}
                  {state !== 'PLAYING' && (
                    <Button onClick={startGame} className="bg-red-400 text-black hover:bg-red-300"><Play className="w-4 h-4 mr-1"/>PLAY</Button>
                  )}
                  {state === 'PLAYING' && (
                    <Button onClick={() => { setState('START'); setLives(3); setCollectedStars(0); resetPlayer(); }} className="bg-gray-700 text-white hover:bg-gray-600"><RotateCcw className="w-4 h-4 mr-1"/>QUIT</Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center p-2">
              <div className="relative">
                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-4 border-red-400 bg-black" style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }} />

                {state !== 'PLAYING' && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center p-6 border-2 border-red-400 bg-gray-900">
                      {state === 'START' && (
                        <>
                          <h3 className="text-2xl text-red-300 mb-2">RED BALL QUEST</h3>
                          <p className="text-xs text-gray-400 mb-4">ARROWS / A D to move • SPACE / W to jump • P to pause</p>
                          <Button onClick={startGame} className="bg-red-400 text-black hover:bg-red-300 text-lg px-8 py-6">START</Button>
                        </>
                      )}
                      {state === 'LEVEL_COMPLETE' && (
                        <>
                          <h3 className="text-2xl text-green-400 mb-2">LEVEL COMPLETE!</h3>
                          <p className="text-sm text-gray-200">STARS: {collectedStars} / {totalStars}</p>
                          <p className="text-sm text-yellow-300 mb-4">SCORE: {score} {score >= highScore ? '(NEW BEST!)' : ''}</p>
                          <Button onClick={startGame} className="bg-red-400 text-black hover:bg-red-300">PLAY AGAIN</Button>
                        </>
                      )}
                      {state === 'GAME_OVER' && (
                        <>
                          <h3 className="text-2xl text-red-500 mb-2">GAME OVER</h3>
                          <p className="text-sm text-gray-200">STARS: {collectedStars} / {totalStars}</p>
                          <p className="text-sm text-yellow-300 mb-4">SCORE: {score}  BEST: {highScore}</p>
                          <Button onClick={startGame} className="bg-red-400 text-black hover:bg-red-300">RETRY</Button>
                        </>
                      )}
                      {state === 'PAUSED' && (
                        <>
                          <h3 className="text-2xl text-yellow-300 mb-4">PAUSED</h3>
                          <Button onClick={() => setState('PLAYING')} className="bg-green-500 text-black hover:bg-green-400">RESUME</Button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* HUD */}
                <div className="absolute top-2 left-2 flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="border-red-400/60 text-red-300">STARS <span className="ml-2">{collectedStars} / {totalStars}</span></Badge>
                  <Badge variant="outline" className="border-yellow-400/60 text-yellow-300">SCORE <span className="ml-2">{score}</span></Badge>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`inline-flex items-center justify-center w-6 h-6 ${i < lives ? 'text-red-400' : 'text-gray-600'}`}>
                      <Heart className="w-4 h-4" />
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="bg-gray-800 border-2 border-yellow-300 shadow-[4px_4px_0px_#FBC02D]">
            <CardHeader className="pb-2"><CardTitle className="text-yellow-300 text-sm">SCORE BOARD</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-xs text-yellow-400/80">SCORE</div>
              </div>
              <div className="p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-yellow-300"><Trophy className="w-5 h-5" />{highScore}</div>
                <div className="text-xs text-yellow-400/80">BEST</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-2 border-red-300">
            <CardHeader className="pb-2"><CardTitle className="text-red-300 text-sm">HOW TO PLAY</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-2 text-gray-300">
              <p>Move with A/D or ◀/▶. Jump with W, ↑, or Space. Avoid hazards, defeat squares by jumping on them, and collect all stars!</p>
              <div className="flex gap-2">
                <Badge className="bg-red-400 text-black">Gravity</Badge>
                <Badge className="bg-yellow-400 text-black">Bouncy</Badge>
                <Badge className="bg-blue-400 text-black flex items-center"><Star className="w-3 h-3 mr-1"/>Collect</Badge>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Mobile Controls */}
      {isMobile && state === 'PLAYING' && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-between px-8 z-50 pointer-events-none">
          <div className="pointer-events-auto flex gap-4">
            <Button
              onTouchStart={() => setMobileMove('left')}
              onTouchEnd={() => setMobileMove(null)}
              onMouseDown={() => setMobileMove('left')}
              onMouseUp={() => setMobileMove(null)}
              className="select-none bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 active:from-red-600 active:to-red-700 text-black font-bold rounded-full w-20 h-20 text-3xl border-4 border-red-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            >
              ←
            </Button>
            <Button
              onTouchStart={() => setMobileMove('right')}
              onTouchEnd={() => setMobileMove(null)}
              onMouseDown={() => setMobileMove('right')}
              onMouseUp={() => setMobileMove(null)}
              className="select-none bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 active:from-red-600 active:to-red-700 text-black font-bold rounded-full w-20 h-20 text-3xl border-4 border-red-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            >
              →
            </Button>
          </div>
          <div className="pointer-events-auto">
            <Button
              onTouchStart={() => { jumpQueuedRef.current = true; }}
              onMouseDown={() => { jumpQueuedRef.current = true; }}
              className="select-none bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-black font-bold rounded-full w-24 h-24 text-3xl border-4 border-yellow-200 shadow-lg transform active:scale-95 transition-all duration-150 flex items-center justify-center"
            >
              ↑
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedBallGame;


