'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -15;
const DOUBLE_JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 48;
const INVULNERABILITY_DURATION = 1500; // 1.5 seconds

// TypeScript Enums and Types
export enum PlayerState {
  Running,
  Jumping,
  DoubleJumping,
  Falling,
  Hurt,
}

export enum ObjectType {
  Platform,
  Enemy,
  Coin,
}

export interface GameObject {
  type: ObjectType;
  position: { x: number; y: number };
  bounds: { width: number; height: number };
  isSolid: boolean;
}

export interface Player {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  bounds: { width: number; height: number };
  state: PlayerState;
  grounded: boolean;
  jumpCount: number;
  lastJumpPressedTime: number;
  lastGroundedTime: number;
  health: number;
  invulnerable: number;
  score: number;
}

// Custom Hook: usePixelRunnerEngine
const usePixelRunnerEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'initial' | 'running' | 'gameOver'>('initial');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameReady, setIsGameReady] = useState(false);

  const playerRef = useRef<Player>({
    position: { x: 100, y: 300 },
    velocity: { x: 0, y: 0 },
    bounds: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
    state: PlayerState.Falling,
    grounded: false,
    jumpCount: 0,
    lastJumpPressedTime: 0,
    lastGroundedTime: 0,
    health: 3,
    invulnerable: 0,
    score: 0,
  });

  const objectsRef = useRef<GameObject[]>([]);
  const cameraRef = useRef({ x: 0, y: 0 });
  const gameTimeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastObstacleRef = useRef(0);

  const resetGame = useCallback(() => {
    playerRef.current = {
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      bounds: { width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
      state: PlayerState.Falling,
      grounded: false,
      jumpCount: 0,
      lastJumpPressedTime: 0,
      lastGroundedTime: 0,
      health: 3,
      invulnerable: 0,
      score: 0,
    };
    setScore(0);
    setLives(3);
    generateInitialWorld();
  }, []);

  const generateInitialWorld = useCallback(() => {
    const initialPlatform: GameObject = {
      type: ObjectType.Platform,
      position: { x: 0, y: 550 },
      bounds: { width: 1000, height: 50 },
      isSolid: true,
    };
    objectsRef.current = [initialPlatform];
    lastObstacleRef.current = 0;
  }, []);
  
  useEffect(() => {
    generateInitialWorld();
    setIsGameReady(true);
  }, [generateInitialWorld]);

  const update = useCallback((deltaTime: number) => {
    const player = playerRef.current;
    
    // Player movement and physics
    player.velocity.y += GRAVITY;
    player.position.y += player.velocity.y;
    
    // Automatic forward movement
    player.position.x += MOVE_SPEED;
    player.score = Math.floor(player.position.x / 100);

    // Camera follow
    cameraRef.current.x = player.position.x - 200;

    // Generate new world objects
    const furthestX = player.position.x + 1200;
    while(lastObstacleRef.current < furthestX) {
        const nextX = lastObstacleRef.current + 200 + Math.random() * 400;
        const type = Math.random();
        if(type < 0.6) { // Platform
            objectsRef.current.push({
                type: ObjectType.Platform,
                position: { x: nextX, y: 450 + Math.random() * 100 },
                bounds: { width: 150 + Math.random() * 150, height: 40 },
                isSolid: true,
            });
        } else if (type < 0.8) { // Enemy
            objectsRef.current.push({
                type: ObjectType.Enemy,
                position: { x: nextX, y: 550 - 30 },
                bounds: { width: 30, height: 30 },
                isSolid: false,
            });
        } else { // Coin
            objectsRef.current.push({
                type: ObjectType.Coin,
                position: { x: nextX, y: 400 + Math.random() * 100 },
                bounds: { width: 20, height: 20 },
                isSolid: false,
            });
        }
        lastObstacleRef.current = nextX;
    }

    // Remove off-screen objects
    objectsRef.current = objectsRef.current.filter(obj => obj.position.x + obj.bounds.width > cameraRef.current.x);

    // Collision detection
    player.grounded = false;
    objectsRef.current.forEach(obj => {
      // Broad-phase check
      if (
        player.position.x < obj.position.x + obj.bounds.width &&
        player.position.x + player.bounds.width > obj.position.x &&
        player.position.y < obj.position.y + obj.bounds.height &&
        player.position.y + player.bounds.height > obj.position.y
      ) {
        // Narrow-phase check
        if (obj.isSolid) {
          if (player.velocity.y >= 0 && player.position.y + player.bounds.height - player.velocity.y <= obj.position.y) {
            player.position.y = obj.position.y - player.bounds.height;
            player.velocity.y = 0;
            player.grounded = true;
            player.jumpCount = 0;
            player.state = PlayerState.Running;
          }
        } else {
          if (obj.type === ObjectType.Coin) {
            player.score += 100;
            objectsRef.current = objectsRef.current.filter(o => o !== obj);
          } else if (obj.type === ObjectType.Enemy && player.invulnerable <= 0) {
            setLives(l => l - 1);
            player.invulnerable = INVULNERABILITY_DURATION;
          }
        }
      }
    });

    if (player.invulnerable > 0) {
      player.invulnerable -= deltaTime;
    }

    if (player.position.y > 600) { // Fell off screen
      setLives(l => l - 1);
      player.position.x = cameraRef.current.x + 100;
      player.position.y = 300;
      player.velocity.y = 0;
      player.invulnerable = INVULNERABILITY_DURATION;
    }
    
    setScore(player.score);

  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-cameraRef.current.x, 0);
    
    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(cameraRef.current.x, 0, canvas.width, canvas.height);

    // Draw objects
    objectsRef.current.forEach(obj => {
      if(obj.type === ObjectType.Platform) {
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(obj.position.x, obj.position.y, obj.bounds.width, obj.bounds.height);
      } else if (obj.type === ObjectType.Enemy) {
        ctx.fillStyle = '#ff4141';
        ctx.fillRect(obj.position.x, obj.position.y, obj.bounds.width, obj.bounds.height);
      } else if (obj.type === ObjectType.Coin) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(obj.position.x + obj.bounds.width / 2, obj.position.y + obj.bounds.height / 2, obj.bounds.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw player
    const player = playerRef.current;
    if (player.invulnerable > 0 && Math.floor(player.invulnerable / 100) % 2 === 0) {
      // Flashing effect when invulnerable
    } else {
      ctx.fillStyle = '#33FF57';
      ctx.fillRect(player.position.x, player.position.y, player.bounds.width, player.bounds.height);
    }

    ctx.restore();
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const deltaTime = (timestamp - lastTimeRef.current);
    lastTimeRef.current = timestamp;
    gameTimeRef.current += deltaTime;

    update(deltaTime);
    draw();

    if (gameState === 'running') {
      requestAnimationFrame(gameLoop);
    }
  }, [update, draw, gameState]);
  
  useEffect(() => {
    if (gameState === 'running') {
      lastTimeRef.current = 0;
      requestAnimationFrame(gameLoop);
    }
  }, [gameState, gameLoop]);

  const handleJump = useCallback(() => {
    const player = playerRef.current;
    if (player.jumpCount < 2) {
      player.velocity.y = player.jumpCount === 0 ? JUMP_FORCE : DOUBLE_JUMP_FORCE;
      player.jumpCount++;
      player.grounded = false;
      player.state = player.jumpCount === 1 ? PlayerState.Jumping : PlayerState.DoubleJumping;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if(gameState === 'initial' || gameState === 'gameOver') {
            startGame();
        } else {
            handleJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleJump]);

  useEffect(() => {
    if (lives <= 0) {
      setGameState('gameOver');
    }
  }, [lives]);

  const startGame = () => {
    if (gameState !== 'running') {
      resetGame();
      setGameState('running');
    }
  };

  return {
    canvasRef,
    gameState,
    score,
    lives,
    startGame,
    isGameReady,
  };
};

export default usePixelRunnerEngine;