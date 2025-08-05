// Game Constants based on the new logic specification
export const BOUNCE_BALL_CONFIG = {
  FONT_FAMILY: `'Press Start 2P', monospace`,
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLAYER_RADIUS: 15,
  MOVEMENT_SPEED: 300,      // pixels/second horizontal speed
  JUMP_FORCE: 600,          // pixels/second initial upward velocity
  GRAVITY: 1200,            // pixels/second^2 downward acceleration
  MAX_JUMPS: 1,             // Single jump before landing
};

// Game levels with platforms, collectibles (rings), and hazards (spikes)
export const LEVELS = [
  {
    platforms: [
      { x: 100, y: 500, width: 200, height: 20 },
      { x: 400, y: 400, width: 200, height: 20 },
      { x: 150, y: 300, width: 150, height: 20 },
      { x: 500, y: 200, width: 150, height: 20 },
    ],
    collectibles: [
      { x: 200, y: 460, collected: false },
      { x: 500, y: 360, collected: false },
      { x: 225, y: 260, collected: false },
    ],
    hazards: [
      { x: 0, y: BOUNCE_BALL_CONFIG.GAME_HEIGHT - 30, width: 50, height: 30 },
      { x: 750, y: BOUNCE_BALL_CONFIG.GAME_HEIGHT - 30, width: 50, height: 30 },
    ],
    exit: { x: 550, y: 140, width: 50, height: 50 }
  },
  {
    platforms: [
      { x: 50, y: 550, width: 150, height: 20 },
      { x: 250, y: 450, width: 100, height: 20 },
      { x: 450, y: 350, width: 150, height: 20 },
      { x: 100, y: 250, width: 100, height: 20 },
      { x: 300, y: 150, width: 200, height: 20 },
    ],
    collectibles: [
      { x: 125, y: 510, collected: false },
      { x: 300, y: 410, collected: false },
      { x: 525, y: 310, collected: false },
      { x: 150, y: 210, collected: false },
    ],
    hazards: [
      { x: 0, y: BOUNCE_BALL_CONFIG.GAME_HEIGHT - 30, width: 50, height: 30 },
      { x: 650, y: BOUNCE_BALL_CONFIG.GAME_HEIGHT - 30, width: 150, height: 30 },
      { x: 200, y: 380, width: 50, height: 20 },
    ],
    exit: { x: 400, y: 100, width: 50, height: 50 }
  },
];

// Type definitions
export type PlayerState = 'Idle' | 'Running' | 'Jumping' | 'Falling';
export type GameState = 'Playing' | 'Paused' | 'GameOver';

export type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  state: PlayerState;
  jumps: number;
};

export type GameManager = {
  lives: number;
  score: number;
  timerScore: number;
  gameState: GameState;
  currentLevel: number;
};

export type Platform = { x: number; y: number; width: number; height: number; };
export type Collectible = { x: number; y: number; collected: boolean; };
export type Hazard = { x: number; y: number; width: number; height: number; };
export type Exit = { x: number; y: number; width: number; height: number; };

// Game Manager Logic Functions
export const createGameManager = (): GameManager => ({
  lives: 3,
  score: 0,
  timerScore: 500,
  gameState: 'Playing',
  currentLevel: 0,
});

export const createPlayer = (x: number, y: number): Player => ({
  x,
  y,
  vx: 0,
  vy: 0,
  isGrounded: false,
  state: 'Idle',
  jumps: 0,
});

// Collision Detection Functions
export const checkAABBCollision = (
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean => {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
};

export const checkCircleRectCollision = (
  circleX: number, circleY: number, radius: number,
  rectX: number, rectY: number, rectW: number, rectH: number
): boolean => {
  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectW));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectH));
  const distance = Math.hypot(circleX - closestX, circleY - closestY);
  return distance < radius;
};

