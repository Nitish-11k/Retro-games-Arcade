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
    if (!this.checkWallCollision(this.x + this.nextDirection.dx * this.speed, this.y + this.nextDirection.dy * this.speed)) {
      this.dx = this.nextDirection.dx;
      this.dy = this.nextDirection.dy;
    }

    if (this.checkWallCollision(this.x + this.dx * this.speed, this.y + this.dy * this.speed)) {
      // Don't move if there's a wall
    } else {
      this.x += this.dx * this.speed;
      this.y += this.dy * this.speed;
    }

    // Tunnel wrap-around (horizontal tunnels)
    if (this.x < 0) {
      this.x = COLS * TILE_SIZE;
    } else if (this.x > COLS * TILE_SIZE) {
      this.x = 0;
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
    const margin = this.radius;
    const gridX1 = Math.floor((nextX - margin) / TILE_SIZE);
    const gridY1 = Math.floor((nextY - margin) / TILE_SIZE);
    const gridX2 = Math.floor((nextX + margin) / TILE_SIZE);
    const gridY2 = Math.floor((nextY + margin) / TILE_SIZE);

    if (
      gridY1 < 0 ||
      gridY1 >= ROWS ||
      gridX1 < 0 ||
      gridX1 >= COLS ||
      gridY2 < 0 ||
      gridY2 >= ROWS ||
      gridX2 < 0 ||
      gridX2 >= COLS
    ) {
      return true;
    }

    if (
      map[gridY1][gridX1] === 1 ||
      map[gridY1][gridX2] === 1 ||
      map[gridY2][gridX1] === 1 ||
      map[gridY2][gridX2] === 1
    ) {
      return true;
    }
    return false;
  }

  reset() {
    // Reset Pac-Man to starting position and state
    this.x = TILE_SIZE * 10 + TILE_SIZE / 2;
    this.y = TILE_SIZE * 17 + TILE_SIZE / 2;
    this.dx = 1;
    this.dy = 0;
    this.nextDirection = { dx: 1, dy: 0 };
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

  constructor(x: number, y: number, color: string) {
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
  }

  update() {
    if (this.frightenedTimer > 0) {
      this.frightenedTimer--;
      if (this.frightenedTimer === 0) {
        this.isFrightened = false;
        this.speed = 2;
      }
    }

    if (this.checkWallCollision(this.x + this.dx * this.speed, this.y + this.dy * this.speed) || Math.random() < 0.02) {
      this.changeDirection();
    } else {
      this.x += this.dx * this.speed;
      this.y += this.dy * this.speed;
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

  changeDirection() {
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