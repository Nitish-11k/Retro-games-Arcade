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

export enum GhostState {
  CHASE,
  SCATTER,
  FRIGHTENED,
  EATEN,
}

export class Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  dx: number;
  dy: number;
  nextDirection: { dx: number; dy: number };
  direction: { dx: number; dy: number };
  mouthOpen: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = TILE_SIZE / 2 - 2;
    this.speed = 2;
    this.dx = 0;
    this.dy = 0;
    this.nextDirection = { dx: 0, dy: 0 };
    this.direction = { dx: -1, dy: 0 }; // Pac-Man starts moving left
    this.mouthOpen = 0;
  }

  update() {
    this.mouthOpen = (this.mouthOpen + 1) % 20;

    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    
    // At an intersection (center of a tile)
    if (Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < this.speed &&
        Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < this.speed) {
        
        // Snap to grid for precision
        this.x = currentGridX * TILE_SIZE + TILE_SIZE / 2;
        this.y = currentGridY * TILE_SIZE + TILE_SIZE / 2;

        // Check if the buffered (next) direction is valid from the current tile
        const nextGridX_nextDir = currentGridX + this.nextDirection.dx;
        const nextGridY_nextDir = currentGridY + this.nextDirection.dy;
        if (MAP[nextGridY_nextDir]?.[nextGridX_nextDir] !== 1) {
            this.dx = this.nextDirection.dx;
            this.dy = this.nextDirection.dy;
            if (this.dx !== 0 || this.dy !== 0) {
                this.direction = { dx: this.dx, dy: this.dy };
            }
        }
        
        // After potentially changing direction, check if the current path is blocked
        const nextGridX_currentDir = currentGridX + this.dx;
        const nextGridY_currentDir = currentGridY + this.dy;
        if (MAP[nextGridY_currentDir]?.[nextGridX_currentDir] === 1) {
            this.dx = 0;
            this.dy = 0;
        }
    }

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // Tunneling
    if (this.x < -this.radius) this.x = MAP[0].length * TILE_SIZE + this.radius;
    if (this.x > MAP[0].length * TILE_SIZE + this.radius) this.x = -this.radius;
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
    this.direction = { dx: -1, dy: 0 };
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
  state: GhostState;
  frightenedTimer: number;
  initialX: number;
  initialY: number;
  targetTile: { x: number; y: number };
  scatterTarget: { x: number; y: number };

  constructor(x: number, y: number, color: string, personality: string) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.radius = TILE_SIZE / 2 - 2;
    this.speed = 1.5;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = 0;
    this.color = color;
    this.personality = personality;
    this.state = GhostState.SCATTER;
    this.frightenedTimer = 0;
    
    switch (this.personality) {
        case 'blinky': this.scatterTarget = { x: 19, y: 1 }; break;
        case 'pinky': this.scatterTarget = { x: 1, y: 1 }; break;
        case 'inky': this.scatterTarget = { x: 19, y: 20 }; break;
        case 'clyde': this.scatterTarget = { x: 1, y: 20 }; break;
        default: this.scatterTarget = { x: 1, y: 1 }; break;
    }
    this.targetTile = { x: this.scatterTarget.x * TILE_SIZE, y: this.scatterTarget.y * TILE_SIZE };
  }

  update(player: Player, ghosts: Ghost[]) {
    if (this.frightenedTimer > 0 && this.state === GhostState.FRIGHTENED) {
      this.frightenedTimer--;
    } else if (this.state === GhostState.FRIGHTENED) {
      this.state = GhostState.CHASE;
    }

    this.updateTargetTile(player, ghosts);
    this.moveTowardsTarget();

    if (this.state === GhostState.EATEN) {
        const atGhostHouse = Math.hypot(this.x - this.initialX, this.y - this.initialY) < TILE_SIZE;
        if (atGhostHouse) {
            this.state = GhostState.CHASE;
        }
    }
  }

  updateTargetTile(player: Player, ghosts: Ghost[]) {
    switch(this.state) {
      case GhostState.SCATTER:
        this.targetTile = { x: this.scatterTarget.x * TILE_SIZE, y: this.scatterTarget.y * TILE_SIZE };
        break;
      case GhostState.EATEN:
        this.targetTile = { x: this.initialX, y: this.initialY };
        break;
      case GhostState.FRIGHTENED:
        // Move randomly
        this.targetTile = { x: Math.random() * MAP[0].length * TILE_SIZE, y: Math.random() * MAP.length * TILE_SIZE };
        break;
      case GhostState.CHASE:
        switch (this.personality) {
          case 'blinky':
            this.targetTile = { x: player.x, y: player.y };
            break;
          case 'pinky':
            let pTargetX = player.x + player.direction.dx * 4 * TILE_SIZE;
            let pTargetY = player.y + player.direction.dy * 4 * TILE_SIZE;
            if (player.direction.dy === -1) { // Original arcade bug
              pTargetX -= 4 * TILE_SIZE;
            }
            this.targetTile = { x: pTargetX, y: pTargetY };
            break;
          case 'inky':
            const blinky = ghosts.find(g => g.personality === 'blinky');
            if (!blinky) {
              this.targetTile = { x: player.x, y: player.y };
              break;
            }
            const twoTilesAhead = {
              x: player.x + player.direction.dx * 2 * TILE_SIZE,
              y: player.y + player.direction.dy * 2 * TILE_SIZE,
            };
            const vectorX = twoTilesAhead.x - blinky.x;
            const vectorY = twoTilesAhead.y - blinky.y;
            this.targetTile = { x: twoTilesAhead.x + vectorX, y: twoTilesAhead.y + vectorY };
            break;
          case 'clyde':
            const distanceToPlayer = Math.hypot(this.x - player.x, this.y - player.y);
            if (distanceToPlayer > 8 * TILE_SIZE) {
              this.targetTile = { x: player.x, y: player.y };
            } else {
              this.targetTile = { x: this.scatterTarget.x * TILE_SIZE, y: this.scatterTarget.y * TILE_SIZE };
            }
            break;
        }
        break;
    }
  }

  moveTowardsTarget() {
    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    const isAtCenterOfTile = 
      Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < (this.speed) &&
      Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < (this.speed);

    if (isAtCenterOfTile) {
        this.x = currentGridX * TILE_SIZE + TILE_SIZE / 2;
        this.y = currentGridY * TILE_SIZE + TILE_SIZE / 2;

        const possibleDirections = [];
        if (this.dx !== 1 && MAP[currentGridY]?.[currentGridX - 1] !== 1) possibleDirections.push({ dx: -1, dy: 0 }); // Left
        if (this.dx !== -1 && MAP[currentGridY]?.[currentGridX + 1] !== 1) possibleDirections.push({ dx: 1, dy: 0 }); // Right
        if (this.dy !== 1 && MAP[currentGridY - 1]?.[currentGridX] !== 1 && MAP[currentGridY - 1]?.[currentGridX] !== 4) possibleDirections.push({ dx: 0, dy: -1 }); // Up
        if (this.dy !== -1 && MAP[currentGridY + 1]?.[currentGridX] !== 1) possibleDirections.push({ dx: 0, dy: 1 }); // Down

        if (possibleDirections.length > 0) {
            let bestDirection = possibleDirections[0];
            let minDistance = Infinity;

            for(const dir of possibleDirections) {
                const nextTileX = (currentGridX + dir.dx) * TILE_SIZE + TILE_SIZE / 2;
                const nextTileY = (currentGridY + dir.dy) * TILE_SIZE + TILE_SIZE / 2;
                const distanceSquared = Math.pow(nextTileX - this.targetTile.x, 2) + Math.pow(nextTileY - this.targetTile.y, 2);
                
                if (distanceSquared < minDistance) {
                    minDistance = distanceSquared;
                    bestDirection = dir;
                }
            }
            this.dx = bestDirection.dx;
            this.dy = bestDirection.dy;
        }
    }

    this.speed = this.state === GhostState.FRIGHTENED ? 1 : this.state === GhostState.EATEN ? 4 : 1.5;

    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // Tunneling
    if (this.x < 0) this.x = MAP[0].length * TILE_SIZE - TILE_SIZE;
    if (this.x > MAP[0].length * TILE_SIZE) this.x = TILE_SIZE;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const bodyColor = this.state === GhostState.FRIGHTENED ? 'blue' : this.color;
    const eyeColor = this.state === GhostState.FRIGHTENED ? 'white' : 'white';
    const pupilColor = 'black';

    if (this.state === GhostState.EATEN) {
        // Draw only eyes
    } else {
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.radius * 0.7);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.closePath();
        ctx.fill();
    }

    // Draw eyes
    ctx.fillStyle = eyeColor;
    const eyeX1 = this.x - this.radius * 0.4;
    const eyeX2 = this.x + this.radius * 0.4;
    const eyeY = this.y - this.radius * 0.2;
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY, this.radius * 0.3, 0, Math.PI * 2);
    ctx.arc(eyeX2, eyeY, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw pupils
    ctx.fillStyle = pupilColor;
    const pupilXOffset = this.dx * this.radius * 0.1;
    const pupilYOffset = this.dy * this.radius * 0.1;
    ctx.beginPath();
    ctx.arc(eyeX1 + pupilXOffset, eyeY + pupilYOffset, this.radius * 0.15, 0, Math.PI * 2);
    ctx.arc(eyeX2 + pupilXOffset, eyeY + pupilYOffset, this.radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.state = GhostState.SCATTER;
    this.frightenedTimer = 0;
    this.speed = 1.5;
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = 0;
  }
}
// Utility functions for Pix-Man game can be added here
