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

  const generateInitialWorld = useCallback(() => {
    const initialPlatform: GameObject = {
      type: ObjectType.Platform,
      position: { x: 0, y: 550 },
      bounds: { width: 1000, height: 50 },
      isSolid: true,
    };
    objectsRef.current = [initialPlatform];
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
    
    // Collision detection with platforms
    player.grounded = false;
    objectsRef.current.forEach(obj => {
      if (obj.isSolid) {
        if (
          player.position.x < obj.position.x + obj.bounds.width &&
          player.position.x + player.bounds.width > obj.position.x &&
          player.position.y < obj.position.y + obj.bounds.height &&
          player.position.y + player.bounds.height > obj.position.y
        ) {
          if (player.velocity.y >= 0 && player.position.y + player.bounds.height - player.velocity.y <= obj.position.y) {
            player.position.y = obj.position.y - player.bounds.height;
            player.velocity.y = 0;
            player.grounded = true;
            player.jumpCount = 0;
            player.state = PlayerState.Running;
          }
        }
      }
    });

    if (player.position.y > 600) { // Fell off screen
      setLives(l => l - 1);
      player.position.x = 100;
      player.position.y = 300;
      player.velocity.y = 0;
    }
    
    setScore(player.score);

  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw objects
    objectsRef.current.forEach(obj => {
      if(obj.type === ObjectType.Platform) {
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(obj.position.x, obj.position.y, obj.bounds.width, obj.bounds.height);
      }
    });
    
    // Draw player
    const player = playerRef.current;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.position.x, player.position.y, player.bounds.width, player.bounds.height);

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

  const startGame = () => {
    setGameState('running');
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