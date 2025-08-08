export const COLS = 21;
export const ROWS = 22;
export const TILE_SIZE = 20;

// 1: Wall, 0: Pellet, 2: Empty, 3: Power Pellet, 4: Ghost Spawn
export const map = [
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

export class Pacman {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  radius: number;
  mouthOpen: number;
  mouthOpening: boolean;
  nextDirection: { dx: number; dy: number };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dx = 1;
    this.dy = 0;
    this.speed = 3;
    this.radius = TILE_SIZE / 2 - 2;
    this.mouthOpen = 0.2;
    this.mouthOpening = true;
    this.nextDirection = { dx: 1, dy: 0 };
  }

  update() {
    // Check if we can change direction
    const nextX = this.x + this.nextDirection.dx * this.speed;
    const nextY = this.y + this.nextDirection.dy * this.speed;
    
    if (!this.checkWallCollision(nextX, nextY)) {
      this.dx = this.nextDirection.dx;
      this.dy = this.nextDirection.dy;
    }

    // Move in current direction if possible
    const newX = this.x + this.dx * this.speed;
    const newY = this.y + this.dy * this.speed;
    
    if (!this.checkWallCollision(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    // Tunnel wrap-around (horizontal tunnels) - fix boundaries
    if (this.x < -this.radius) {
      this.x = COLS * TILE_SIZE + this.radius;
    } else if (this.x > COLS * TILE_SIZE + this.radius) {
      this.x = -this.radius;
    }

    // Mouth animation
    if (this.mouthOpening) {
      this.mouthOpen += 0.05;
      if (this.mouthOpen >= 0.4) this.mouthOpening = false;
    } else {
      this.mouthOpen -= 0.05;
      if (this.mouthOpen <= 0.1) this.mouthOpening = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    const angle = Math.atan2(this.dy, this.dx);
    ctx.arc(this.x, this.y, this.radius, angle + this.mouthOpen, angle - this.mouthOpen);
    ctx.lineTo(this.x, this.y);
    ctx.fill();
  }

  checkWallCollision(nextX: number, nextY: number): boolean {
    const margin = this.radius - 2; // Slightly smaller margin for better movement
    const gridX1 = Math.floor((nextX - margin) / TILE_SIZE);
    const gridY1 = Math.floor((nextY - margin) / TILE_SIZE);
    const gridX2 = Math.floor((nextX + margin) / TILE_SIZE);
    const gridY2 = Math.floor((nextY + margin) / TILE_SIZE);

    // Allow horizontal tunneling by not checking X bounds for tunnel rows
    const isTunnelRow = gridY1 >= 10 && gridY1 <= 10; // Row where horizontal tunnel exists
    
    if (!isTunnelRow) {
      if (gridX1 < 0 || gridX1 >= COLS || gridX2 < 0 || gridX2 >= COLS) {
        return true;
      }
    }
    
    if (gridY1 < 0 || gridY1 >= ROWS || gridY2 < 0 || gridY2 >= ROWS) {
      return true;
    }

    // Check bounds and walls, but allow tunnel movement
    const checkTile = (x: number, y: number) => {
      if (y < 0 || y >= ROWS) return true;
      if (x < 0 || x >= COLS) {
        // Allow tunnel passage
        return !isTunnelRow;
      }
      return map[y][x] === 1;
    };

    if (
      checkTile(gridX1, gridY1) ||
      checkTile(gridX2, gridY1) ||
      checkTile(gridX1, gridY2) ||
      checkTile(gridX2, gridY2)
    ) {
      return true;
    }
    return false;
  }

  reset() {
    // Reset Pac-Man to starting position and state - better spawn position
    this.x = TILE_SIZE * 10 + TILE_SIZE / 2;
    this.y = TILE_SIZE * 20 + TILE_SIZE / 2; // Row 20 is a safe open area
    this.dx = 0;
    this.dy = 0;
    this.nextDirection = { dx: 0, dy: 0 };
    this.mouthOpen = 0.2;
    this.mouthOpening = true;
  }
}

export class Ghost {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  radius: number;
  color: string;
  isFrightened: boolean;
  frightenedTimer: number;
  startX: number;
  startY: number;
  personality: 'blinky' | 'pinky' | 'inky' | 'clyde';
  scatterCorner: { x: number; y: number };
  mode: 'chase' | 'scatter' | 'frightened';

  constructor(x: number, y: number, color: string, personality: 'blinky' | 'pinky' | 'inky' | 'clyde') {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = -1;
    this.speed = 2;
    this.radius = TILE_SIZE / 2 - 2;
    this.color = color;
    this.isFrightened = false;
    this.frightenedTimer = 0;
    this.startX = x;
    this.startY = y;
    this.personality = personality;
    this.mode = 'chase';
    
    // Set scatter corners for each ghost
    switch (personality) {
      case 'blinky': this.scatterCorner = { x: COLS - 1, y: 0 }; break; // Top-right
      case 'pinky': this.scatterCorner = { x: 0, y: 0 }; break; // Top-left
      case 'inky': this.scatterCorner = { x: COLS - 1, y: ROWS - 1 }; break; // Bottom-right
      case 'clyde': this.scatterCorner = { x: 0, y: ROWS - 1 }; break; // Bottom-left
    }
  }

  update(pacmanX: number, pacmanY: number, blinkyX?: number, blinkyY?: number) {
    if (this.frightenedTimer > 0) {
      this.frightenedTimer--;
      if (this.frightenedTimer === 0) {
        this.isFrightened = false;
        this.speed = 2;
      }
    }

    // Only change direction when centered on a tile to avoid getting stuck
    const isAtTileCenter = this.isAtTileCenter();
    if (isAtTileCenter) {
      this.changeDirection(pacmanX, pacmanY, blinkyX || pacmanX, blinkyY || pacmanY);
    }

    // Move in current direction if possible
    const nextX = this.x + this.dx * this.speed;
    const nextY = this.y + this.dy * this.speed;
    
    if (!this.checkWallCollision(nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
    } else if (isAtTileCenter) {
      // If we hit a wall and we're at tile center, try to find a new direction
      this.findAlternativeDirection(pacmanX, pacmanY);
    }

    // Handle tunnel wrap-around (like Pac-Man)
    if (this.x < -this.radius) {
      this.x = COLS * TILE_SIZE + this.radius;
    } else if (this.x > COLS * TILE_SIZE + this.radius) {
      this.x = -this.radius;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isFrightened ? 'blue' : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, Math.PI, 0);
    ctx.lineTo(this.x + this.radius, this.y + this.radius);
    ctx.lineTo(this.x - this.radius, this.y + this.radius);
    ctx.fill();
  }

  checkWallCollision(nextX: number, nextY: number): boolean {
    const margin = this.radius;
    const gridX1 = Math.floor((nextX - margin) / TILE_SIZE);
    const gridY1 = Math.floor((nextY - margin) / TILE_SIZE);
    const gridX2 = Math.floor((nextX + margin) / TILE_SIZE);
    const gridY2 = Math.floor((nextY + margin) / TILE_SIZE);

    if (
      map[gridY1]?.[gridX1] === 1 ||
      map[gridY1]?.[gridX2] === 1 ||
      map[gridY2]?.[gridX1] === 1 ||
      map[gridY2]?.[gridX2] === 1
    ) {
      return true;
    }
    return false;
  }

  findPath(targetX: number, targetY: number): { dx: number; dy: number } | null {
    const startX = Math.floor(this.x / TILE_SIZE);
    const startY = Math.floor(this.y / TILE_SIZE);
    const endX = Math.floor(targetX / TILE_SIZE);
    const endY = Math.floor(targetY / TILE_SIZE);

    const queue: { x: number; y: number; path: { dx: number; dy: number }[] }[] = [
      { x: startX, y: startY, path: [] },
    ];
    const visited: boolean[][] = Array(ROWS)
      .fill(0)
      .map(() => Array(COLS).fill(false));
    visited[startY][startX] = true;

    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    while (queue.length > 0) {
      const { x, y, path } = queue.shift()!;

      if (x === endX && y === endY) {
        return path.length > 0 ? path[0] : null;
      }

      for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;

        if (
          newX >= 0 &&
          newX < COLS &&
          newY >= 0 &&
          newY < ROWS &&
          map[newY][newX] !== 1 &&
          !visited[newY][newX]
        ) {
          visited[newY][newX] = true;
          queue.push({ x: newX, y: newY, path: [...path, dir] });
        }
      }
    }
    return null;
  }

  changeDirection(pacmanX: number, pacmanY: number, blinkyX: number, blinkyY: number) {
    let targetX: number;
    let targetY: number;

    // Determine target tile based on personality and mode
    switch (this.personality) {
      case 'blinky':
        // Blinky aims directly at Pac-Man
        targetX = pacmanX;
        targetY = pacmanY;
        break;

      case 'pinky':
        // Pinky tries to get four tiles ahead of Pac-Man
        targetX = pacmanX + 4 * (pacmanX > this.x ? 1 : -1);
        targetY = pacmanY + 4 * (pacmanY > this.y ? 1 : -1);
        break;

      case 'inky':
        // Inky tries to flank with Blinky
        const twoTilesAheadX = pacmanX + 2 * (pacmanX > this.x ? 1 : -1);
        const twoTilesAheadY = pacmanY + 2 * (pacmanY > this.y ? 1 : -1);
        targetX = twoTilesAheadX * 2 - blinkyX;
        targetY = twoTilesAheadY * 2 - blinkyY;
        break;

      case 'clyde':
        // Clyde changes target if closer than 8 tiles
        const distanceToPacman = Math.hypot(this.x - pacmanX, this.y - pacmanY);
        if (distanceToPacman < 8 * TILE_SIZE) {
          targetX = this.scatterCorner.x;
          targetY = this.scatterCorner.y;
        } else {
          targetX = pacmanX;
          targetY = pacmanY;
        }
        break;
    }

    if (this.isFrightened) {
      // In frightened mode, move away from Pac-Man
      const currentGridX = Math.floor(this.x / TILE_SIZE);
      const currentGridY = Math.floor(this.y / TILE_SIZE);
      const pacmanGridX = Math.floor(pacmanX / TILE_SIZE);
      const pacmanGridY = Math.floor(pacmanY / TILE_SIZE);

      let furthestDir = null;
      let maxDistance = -1;

      const directions = [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
      ];

      for (const dir of directions) {
        const newX = currentGridX + dir.dx;
        const newY = currentGridY + dir.dy;

        if (
          newX >= 0 &&
          newX < COLS &&
          newY >= 0 &&
          newY < ROWS &&
          map[newY][newX] !== 1
        ) {
          const distance = Math.abs(newX - pacmanGridX) + Math.abs(newY - pacmanGridY);
          if (distance > maxDistance) {
            maxDistance = distance;
            furthestDir = dir;
          }
        }
      }
      if (furthestDir) {
        this.dx = furthestDir.dx;
        this.dy = furthestDir.dy;
        return;
      }
    }

    const nextMove = this.findPath(targetX, targetY);
    if (nextMove) {
      this.dx = nextMove.dx;
      this.dy = nextMove.dy;
    } else {
      // Fallback to random movement if no path is found (e.g., trapped)
      const directions = [
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
      ];

      const validDirections = directions.filter(dir =>
        !this.checkWallCollision(this.x + dir.dx * this.speed, this.y + dir.dy * this.speed) &&
        (dir.dx !== -this.dx || dir.dy !== -this.dy)
      );

      if (validDirections.length > 0) {
        const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        this.dx = newDirection.dx;
        this.dy = newDirection.dy;
      }
    }
  }

  isAtTileCenter(): boolean {
    // Check if ghost is approximately centered on a tile
    const centerX = Math.floor(this.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    const centerY = Math.floor(this.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    const threshold = 3; // Allow some tolerance
    
    return Math.abs(this.x - centerX) < threshold && Math.abs(this.y - centerY) < threshold;
  }

  findAlternativeDirection(pacmanX: number, pacmanY: number) {
    // Find any valid direction when stuck
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    // Prefer continuing in the same direction if possible
    const currentDir = { dx: this.dx, dy: this.dy };
    if (!this.checkWallCollision(this.x + currentDir.dx * this.speed, this.y + currentDir.dy * this.speed)) {
      return;
    }

    // Filter out invalid directions and reverse direction (to avoid oscillation)
    const validDirections = directions.filter(dir => {
      const isReverse = (dir.dx === -this.dx && dir.dy === -this.dy);
      const isValid = !this.checkWallCollision(this.x + dir.dx * this.speed, this.y + dir.dy * this.speed);
      return isValid && !isReverse;
    });

    if (validDirections.length > 0) {
      // If we have multiple valid directions, prefer the one towards Pac-Man
      let bestDir = validDirections[0];
      let minDistance = Infinity;
      
      for (const dir of validDirections) {
        const futureX = this.x + dir.dx * TILE_SIZE;
        const futureY = this.y + dir.dy * TILE_SIZE;
        const distance = Math.hypot(futureX - pacmanX, futureY - pacmanY);
        
        if (!this.isFrightened && distance < minDistance) {
          minDistance = distance;
          bestDir = dir;
        } else if (this.isFrightened && distance > minDistance) {
          minDistance = distance;
          bestDir = dir;
        }
      }
      
      this.dx = bestDir.dx;
      this.dy = bestDir.dy;
    } else if (validDirections.length === 0) {
      // Last resort: allow reverse direction
      const allDirections = directions.filter(dir => 
        !this.checkWallCollision(this.x + dir.dx * this.speed, this.y + dir.dy * this.speed)
      );
      if (allDirections.length > 0) {
        const newDir = allDirections[Math.floor(Math.random() * allDirections.length)];
        this.dx = newDir.dx;
        this.dy = newDir.dy;
      }
    }
  }

  reset() {
    // Reset ghost to starting position and state  
    this.x = this.startX;
    this.y = this.startY;
    this.dx = 0;
    this.dy = -1;
    this.speed = 2;
    this.isFrightened = false;
    this.frightenedTimer = 0;
  }
}
