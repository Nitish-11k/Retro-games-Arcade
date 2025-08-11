// Constants
export const TILE_SIZE = 20;
export const POWER_PELLET_TIME = 300; // 5 seconds at 60fps

// Player initial state
export const PLAYER = {
  x: TILE_SIZE * 10 + TILE_SIZE / 2,
  y: TILE_SIZE * 20 + TILE_SIZE / 2,
  radius: TILE_SIZE / 2 - 2,
  speed: 2,
  dx: 0,
  dy: 0,
  nextDirection: { dx: 0, dy: 0 },
  // ... other player properties
};

// Ghosts initial state
export const GHOSTS = [
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 9 + TILE_SIZE / 2, color: 'red', personality: 'blinky' },
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'pink', personality: 'pinky' },
  { x: TILE_SIZE * 9 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'cyan', personality: 'inky' },
  { x: TILE_SIZE * 11 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'orange', personality: 'clyde' },
];

// Map layout
export const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 4, 4, 4, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export class Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;
  nextDirection: { dx: number; dy: number };
  mouthOpen: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = TILE_SIZE / 2 - 2;
    this.speed = 2;
    this.dx = 0;
    this.dy = 0;
    this.nextDirection = { dx: 0, dy: 0 };
    this.mouthOpen = 0;
  }

  update() {
    this.mouthOpen = (this.mouthOpen + 1) % 20;

    // Try to change direction
    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    const isAtCenterOfTile = 
      Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < this.speed &&
      Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < this.speed;

    if (isAtCenterOfTile) {
      const nextGridX = currentGridX + this.nextDirection.dx;
      const nextGridY = currentGridY + this.nextDirection.dy;
      if (MAP[nextGridY] && MAP[nextGridY][nextGridX] !== 1) {
        this.dx = this.nextDirection.dx;
        this.dy = this.nextDirection.dy;
      }
    }
    
    // Wall collision
    const nextX = this.x + this.dx * this.speed;
    const nextY = this.y + this.dy * this.speed;
    const nextGridX = Math.floor(nextX / TILE_SIZE);
    const nextGridY = Math.floor(nextY / TILE_SIZE);

    if (MAP[nextGridY] && MAP[nextGridY][nextGridX] !== 1) {
      this.x = nextX;
      this.y = nextY;
    } else {
      // If moving and hitting a wall, stop at the tile center
      if (isAtCenterOfTile) {
        this.dx = 0;
        this.dy = 0;
      }
    }

    // Tunneling
    if (this.x < 0) this.x = MAP[0].length * TILE_SIZE;
    if (this.x > MAP[0].length * TILE_SIZE) this.x = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    
    const angle = Math.atan2(this.dy, this.dx);
    const mouthAngle = (Math.sin(this.mouthOpen * Math.PI / 10) + 1) / 4 * Math.PI; // from 0 to PI/2
    
    ctx.arc(this.x, this.y, this.radius, angle + mouthAngle / 2, angle - mouthAngle / 2);
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.fill();
  }

  reset() {
    this.x = TILE_SIZE * 10 + TILE_SIZE / 2;
    this.y = TILE_SIZE * 17 + TILE_SIZE / 2;
    this.dx = 0;
    this.dy = 0;
    this.nextDirection = { dx: 0, dy: 0 };
  }
}

export class Ghost {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;
  color: string;
  personality: string;
  isFrightened: boolean;
  frightenedTimer: number;
  initialX: number;
  initialY: number;

  constructor(x: number, y: number, color: string, personality: string) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.radius = TILE_SIZE / 2 - 2;
    this.speed = 1.5;
    this.dx = 0;
    this.dy = -1; // Start moving up
    this.color = color;
    this.personality = personality;
    this.isFrightened = false;
    this.frightenedTimer = 0;
  }

  update(playerX: number, playerY: number) {
    if (this.isFrightened) {
      this.frightenedTimer--;
      if (this.frightenedTimer <= 0) {
        this.isFrightened = false;
        this.speed = 1.5;
      }
    }
    
    // Simple AI: Move towards player or randomly at junctions
    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    const isAtCenterOfTile = 
      Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < this.speed &&
      Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < this.speed;

    if (isAtCenterOfTile) {
      const possibleDirections = [];
      if (this.dx !== 1 && MAP[currentGridY]?.[currentGridX - 1] !== 1) possibleDirections.push({ dx: -1, dy: 0 }); // Left
      if (this.dx !== -1 && MAP[currentGridY]?.[currentGridX + 1] !== 1) possibleDirections.push({ dx: 1, dy: 0 }); // Right
      if (this.dy !== 1 && MAP[currentGridY - 1]?.[currentGridX] !== 1) possibleDirections.push({ dx: 0, dy: -1 }); // Up
      if (this.dy !== -1 && MAP[currentGridY + 1]?.[currentGridX] !== 1) possibleDirections.push({ dx: 0, dy: 1 }); // Down
      
      if (possibleDirections.length > 0) {
        // Basic AI: Blinky (red) chases directly
        if (this.personality === 'blinky' && !this.isFrightened) {
            let bestDirection = possibleDirections[0];
            let minDistance = Infinity;
            for(const dir of possibleDirections) {
                const distance = Math.hypot((this.x + dir.dx * TILE_SIZE) - playerX, (this.y + dir.dy * TILE_SIZE) - playerY);
                if(distance < minDistance) {
                    minDistance = distance;
                    bestDirection = dir;
                }
            }
            this.dx = bestDirection.dx;
            this.dy = bestDirection.dy;
        } else {
            // Other ghosts or frightened ghosts move randomly
            const choice = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            this.dx = choice.dx;
            this.dy = choice.dy;
        }
      }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // Tunneling
    if (this.x < 0) this.x = MAP[0].length * TILE_SIZE;
    if (this.x > MAP[0].length * TILE_SIZE) this.x = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isFrightened ? 'blue' : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = 'white';
    const eyeXOffset = this.dx * this.radius * 0.3;
    const eyeYOffset = this.dy * this.radius * 0.3;
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.4 + eyeXOffset, this.y - this.radius * 0.4 + eyeYOffset, 3, 0, Math.PI * 2);
    ctx.arc(this.x + this.radius * 0.4 + eyeXOffset, this.y - this.radius * 0.4 + eyeYOffset, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.4 + eyeXOffset + this.dx*1.5, this.y - this.radius * 0.4 + eyeYOffset + this.dy*1.5, 1.5, 0, Math.PI * 2);
    ctx.arc(this.x + this.radius * 0.4 + eyeXOffset + this.dx*1.5, this.y - this.radius * 0.4 + eyeYOffset + this.dy*1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.isFrightened = false;
    this.frightenedTimer = 0;
    this.speed = 1.5;
    this.dx = 0;
    this.dy = -1;
  }
}
// Utility functions for Pix-Man game can be added here
