// Constants
export const TILE_SIZE = 20;

// Difficulty and Level Progression
export const LEVEL_SETTINGS = [
    { ghostSpeed: 1.5,  frightenedTime: 6000, scatterTime: 7000, chaseTime: 20000 }, // Level 1
    { ghostSpeed: 1.6,  frightenedTime: 5000, scatterTime: 7000, chaseTime: 20000 }, // Level 2
    { ghostSpeed: 1.7,  frightenedTime: 4000, scatterTime: 5000, chaseTime: 20000 }, // Level 3
    { ghostSpeed: 1.8,  frightenedTime: 3000, scatterTime: 5000, chaseTime: 20000 }, // Level 4
    { ghostSpeed: 1.9,  frightenedTime: 2000, scatterTime: 5000, chaseTime: 1033000 }, // Level 5
    { ghostSpeed: 2.0,  frightenedTime: 1000, scatterTime: 1,    chaseTime: 1037000 }, // Level 6+
];

// Player initial state
export const PLAYER = {
  x: TILE_SIZE * 10 + TILE_SIZE / 2,
  y: TILE_SIZE * 17 + TILE_SIZE / 2,
  radius: TILE_SIZE / 2 - 2,
  speed: 2,
};

// Ghosts initial state
export const GHOSTS = [
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 9 + TILE_SIZE / 2, color: 'red', personality: 'blinky' },
  { x: TILE_SIZE * 10 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'pink', personality: 'pinky' },
  { x: TILE_SIZE * 9 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'cyan', personality: 'inky' },
  { x: TILE_SIZE * 11 + TILE_SIZE / 2, y: TILE_SIZE * 11 + TILE_SIZE / 2, color: 'orange', personality: 'clyde' },
];

// Map layout (0: pellet, 1: wall, 3: power pellet, 4: ghost house door, 5: empty)
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

export enum GhostState { CHASE, SCATTER, FRIGHTENED, EATEN }

export class Player {
  x: number; y: number; radius: number; speed: number; dx: number; dy: number;
  nextDirection: { dx: number; dy: number };
  direction: { dx: number; dy: number };
  mouthOpen: number;

  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.radius = TILE_SIZE / 2 - 2; this.speed = 2;
    this.dx = 0; this.dy = 0; this.nextDirection = { dx: 0, dy: 0 };
    this.direction = { dx: -1, dy: 0 }; this.mouthOpen = 0;
  }

  update() {
    this.mouthOpen = (this.mouthOpen + 1) % 20;
    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    
    if (Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < this.speed &&
        Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < this.speed) {
        this.x = currentGridX * TILE_SIZE + TILE_SIZE / 2;
        this.y = currentGridY * TILE_SIZE + TILE_SIZE / 2;
        const nextGridX_nextDir = currentGridX + this.nextDirection.dx;
        const nextGridY_nextDir = currentGridY + this.nextDirection.dy;
        if (MAP[nextGridY_nextDir]?.[nextGridX_nextDir] !== 1) {
            this.dx = this.nextDirection.dx; this.dy = this.nextDirection.dy;
            if (this.dx !== 0 || this.dy !== 0) { this.direction = { dx: this.dx, dy: this.dy }; }
        }
        const nextGridX_currentDir = currentGridX + this.dx;
        const nextGridY_currentDir = currentGridY + this.dy;
        if (MAP[nextGridY_currentDir]?.[nextGridX_currentDir] === 1) { this.dx = 0; this.dy = 0; }
    }
    this.x += this.dx * this.speed; this.y += this.dy * this.speed;
    if (this.x < -this.radius) this.x = MAP[0].length * TILE_SIZE + this.radius;
    if (this.x > MAP[0].length * TILE_SIZE + this.radius) this.x = -this.radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'yellow'; ctx.beginPath();
    const angle = Math.atan2(this.dy, this.dx);
    const mouthAngle = (Math.sin(this.mouthOpen * Math.PI / 10) + 1) / 4 * Math.PI;
    ctx.arc(this.x, this.y, this.radius, angle + mouthAngle / 2, angle - mouthAngle / 2);
    ctx.lineTo(this.x, this.y); ctx.closePath(); ctx.fill();
  }

  reset() {
    this.x = PLAYER.x; this.y = PLAYER.y; this.dx = 0; this.dy = 0;
    this.nextDirection = { dx: 0, dy: 0 }; this.direction = { dx: -1, dy: 0 };
  }
}

export class Ghost {
  x: number; y: number; radius: number; speed: number; dx: number; dy: number;
  color: string; personality: string; state: GhostState; frightenedTimer: number;
  initialX: number; initialY: number; targetTile: { x: number; y: number };
  scatterTarget: { x: number; y: number }; baseSpeed: number;

  constructor(x: number, y: number, color: string, personality: string, level: number) {
    this.x = x; this.y = y; this.initialX = x; this.initialY = y;
    this.radius = TILE_SIZE / 2 - 2; this.dx = Math.random() < 0.5 ? 1 : -1; this.dy = 0;
    this.color = color; this.personality = personality; this.state = GhostState.SCATTER;
    this.frightenedTimer = 0;
    const settings = LEVEL_SETTINGS[Math.min(level - 1, LEVEL_SETTINGS.length - 1)];
    this.baseSpeed = settings.ghostSpeed; this.speed = this.baseSpeed;
    
    switch (this.personality) {
        case 'blinky': this.scatterTarget = { x: 19, y: 1 }; break;
        case 'pinky': this.scatterTarget = { x: 1, y: 1 }; break;
        case 'inky': this.scatterTarget = { x: 19, y: 20 }; break;
        case 'clyde': this.scatterTarget = { x: 1, y: 20 }; break;
        default: this.scatterTarget = { x: 1, y: 1 }; break;
    }
    this.targetTile = { x: this.scatterTarget.x, y: this.scatterTarget.y };
  }

  update(player: Player, ghosts: Ghost[], level: number, pelletsRemaining: number) {
    if (this.state === GhostState.FRIGHTENED) {
      this.frightenedTimer -= 1000/60; // Decrement timer based on 60fps
      if (this.frightenedTimer <= 0) {
        this.state = GhostState.CHASE;
      }
    }
    
    // Blinky's speed boost
    if (this.personality === 'blinky') {
        const pelletThresholds = [20, 10]; // Pellets remaining to speed up
        if (pelletsRemaining <= pelletThresholds[0] && pelletsRemaining > pelletThresholds[1]) {
            this.speed = this.baseSpeed * 1.1;
        } else if (pelletsRemaining <= pelletThresholds[1]) {
            this.speed = this.baseSpeed * 1.2;
        } else {
            this.speed = this.baseSpeed;
        }
    }

    this.updateTargetTile(player, ghosts);
    this.moveTowardsTarget();

    if (this.state === GhostState.EATEN && Math.hypot(this.x - this.initialX, this.y - this.initialY) < TILE_SIZE) {
        this.state = GhostState.CHASE;
    }
  }

  updateTargetTile(player: Player, ghosts: Ghost[]) {
    const playerGridX = Math.floor(player.x / TILE_SIZE);
    const playerGridY = Math.floor(player.y / TILE_SIZE);

    switch(this.state) {
      case GhostState.SCATTER:
        this.targetTile = { x: this.scatterTarget.x, y: this.scatterTarget.y };
        break;
      case GhostState.EATEN:
        this.targetTile = { x: Math.floor(this.initialX/TILE_SIZE), y: Math.floor(this.initialY/TILE_SIZE) };
        break;
      case GhostState.FRIGHTENED:
        const currentGridX = Math.floor(this.x / TILE_SIZE);
        const currentGridY = Math.floor(this.y / TILE_SIZE);
        const possibleDirections = [];
        if (MAP[currentGridY]?.[currentGridX - 1] !== 1) possibleDirections.push({ x: -1, y: 0 });
        if (MAP[currentGridY]?.[currentGridX + 1] !== 1) possibleDirections.push({ x: 1, y: 0 });
        if (MAP[currentGridY - 1]?.[currentGridX] !== 1) possibleDirections.push({ x: 0, y: -1 });
        if (MAP[currentGridY + 1]?.[currentGridX] !== 1) possibleDirections.push({ x: 0, y: 1 });
        if(possibleDirections.length > 0) {
            const randomDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            this.targetTile = { x: currentGridX + randomDir.x, y: currentGridY + randomDir.y };
        }
        break;
      case GhostState.CHASE:
        switch (this.personality) {
          case 'blinky':
            this.targetTile = { x: playerGridX, y: playerGridY };
            break;
          case 'pinky':
            let pTargetX = playerGridX + player.direction.dx * 4;
            let pTargetY = playerGridY + player.direction.dy * 4;
            if (player.direction.dy === -1) { pTargetX -= 4; } // Original arcade bug
            this.targetTile = { x: pTargetX, y: pTargetY };
            break;
          case 'inky':
            const blinky = ghosts.find(g => g.personality === 'blinky');
            if (!blinky) { this.targetTile = { x: playerGridX, y: playerGridY }; break; }
            const blinkyGridX = Math.floor(blinky.x / TILE_SIZE);
            const blinkyGridY = Math.floor(blinky.y / TILE_SIZE);
            const twoTilesAhead = { x: playerGridX + player.direction.dx * 2, y: playerGridY + player.direction.dy * 2 };
            const vectorX = twoTilesAhead.x - blinkyGridX;
            const vectorY = twoTilesAhead.y - blinkyGridY;
            this.targetTile = { x: twoTilesAhead.x + vectorX, y: twoTilesAhead.y + vectorY };
            break;
          case 'clyde':
            const distanceToPlayer = Math.hypot(this.x - player.x, this.y - player.y);
            if (distanceToPlayer > 8 * TILE_SIZE) { this.targetTile = { x: playerGridX, y: playerGridY }; } 
            else { this.targetTile = { x: this.scatterTarget.x, y: this.scatterTarget.y }; }
            break;
        }
        break;
    }
  }

  moveTowardsTarget() {
    const currentGridX = Math.floor(this.x / TILE_SIZE);
    const currentGridY = Math.floor(this.y / TILE_SIZE);
    
    if (Math.abs(this.x - (currentGridX * TILE_SIZE + TILE_SIZE / 2)) < this.speed &&
        Math.abs(this.y - (currentGridY * TILE_SIZE + TILE_SIZE / 2)) < this.speed) {
        this.x = currentGridX * TILE_SIZE + TILE_SIZE / 2;
        this.y = currentGridY * TILE_SIZE + TILE_SIZE / 2;

        const startNode = new GraphNode(currentGridX, currentGridY);
        const targetX = Math.max(0, Math.min(MAP[0].length - 1, this.targetTile.x));
        const targetY = Math.max(0, Math.min(MAP.length - 1, this.targetTile.y));
        const endNode = new GraphNode(targetX, targetY);

        // Prevent ghosts from reversing direction
        const oppositeDx = -this.dx;
        const oppositeDy = -this.dy;

        const path = mazeGraph.findShortestPath(startNode, endNode, {dx: oppositeDx, dy: oppositeDy});

        if (path && path.length > 1) {
            const nextNode = path[1];
            this.dx = nextNode.x - currentGridX;
            this.dy = nextNode.y - currentGridY;
        }
    }

    this.speed = this.state === GhostState.FRIGHTENED ? this.baseSpeed * 0.75 : this.state === GhostState.EATEN ? 4 : this.baseSpeed;
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    if (this.x < 0) this.x = MAP[0].length * TILE_SIZE - TILE_SIZE;
    if (this.x > MAP[0].length * TILE_SIZE) this.x = TILE_SIZE;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const bodyColor = this.state === GhostState.FRIGHTENED ? (this.frightenedTimer < 2000 && Math.floor(this.frightenedTimer/250) % 2 === 0 ? 'white' : 'blue') : this.color;
    const eyeColor = 'white';
    const pupilColor = 'black';

    if (this.state === GhostState.EATEN) {
        // Draw only eyes
    } else {
        ctx.fillStyle = bodyColor; ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.radius * 0.7);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.closePath(); ctx.fill();
    }

    ctx.fillStyle = eyeColor;
    const eyeX1 = this.x - this.radius * 0.4; const eyeX2 = this.x + this.radius * 0.4;
    const eyeY = this.y - this.radius * 0.2;
    ctx.beginPath(); ctx.arc(eyeX1, eyeY, this.radius * 0.3, 0, Math.PI * 2);
    ctx.arc(eyeX2, eyeY, this.radius * 0.3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = pupilColor;
    const pupilXOffset = this.dx * this.radius * 0.1; const pupilYOffset = this.dy * this.radius * 0.1;
    ctx.beginPath(); ctx.arc(eyeX1 + pupilXOffset, eyeY + pupilYOffset, this.radius * 0.15, 0, Math.PI * 2);
    ctx.arc(eyeX2 + pupilXOffset, eyeY + pupilYOffset, this.radius * 0.15, 0, Math.PI * 2); ctx.fill();
  }

  reset() {
    this.x = this.initialX; this.y = this.initialY;
    this.state = GhostState.SCATTER; this.frightenedTimer = 0;
    this.speed = this.baseSpeed; this.dx = Math.random() < 0.5 ? 1 : -1; this.dy = 0;
  }
}

class GraphNode {
  constructor(public x: number, public y: number) {}
  get key() { return `${this.x},${this.y}`; }
}

class MazeGraph {
  public nodes: Map<string, GraphNode> = new Map();
  public adjacencyList: Map<string, GraphNode[]> = new Map();

  constructor(map: number[][]) { this.buildGraph(map); }

  private addNode(node: GraphNode) { this.nodes.set(node.key, node); this.adjacencyList.set(node.key, []); }
  private addEdge(node1: GraphNode, node2: GraphNode) {
    this.adjacencyList.get(node1.key)?.push(node2);
    this.adjacencyList.get(node2.key)?.push(node1);
  }

  private buildGraph(map: number[][]) {
    const height = map.length; const width = map[0].length;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (map[y][x] !== 1 && map[y][x] !== 4) { this.addNode(new GraphNode(x, y)); }
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nodeKey = `${x},${y}`;
        if (this.nodes.has(nodeKey)) {
          const currentNode = this.nodes.get(nodeKey)!;
          const neighbors = [{ dx: 1, dy: 0 }, { dx: 0, dy: 1 }];
          for (const { dx, dy } of neighbors) {
            const neighborX = x + dx; const neighborY = y + dy;
            const neighborKey = `${neighborX},${neighborY}`;
            if (this.nodes.has(neighborKey)) {
              const neighborNode = this.nodes.get(neighborKey)!;
              this.addEdge(currentNode, neighborNode);
            }
          }
        }
      }
    }
    const tunnelY = 10;
    const leftTunnelNode = this.nodes.get(`0,${tunnelY}`);
    const rightTunnelNode = this.nodes.get(`${width - 1},${tunnelY}`);
    if (leftTunnelNode && rightTunnelNode) { this.addEdge(leftTunnelNode, rightTunnelNode); }
  }

  public findShortestPath(startNode: GraphNode, endNode: GraphNode, disallowedMove?: {dx: number, dy: number}): GraphNode[] | null {
    if (!this.nodes.has(startNode.key) || !this.nodes.has(endNode.key)) { return null; }
    const queue: GraphNode[] = [startNode];
    const visited: Set<string> = new Set([startNode.key]);
    const cameFrom: Map<string, GraphNode | null> = new Map([[startNode.key, null]]);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      if (currentNode.key === endNode.key) {
        const path: GraphNode[] = []; let current: GraphNode | null = currentNode;
        while (current) { path.unshift(current); current = cameFrom.get(current.key) ?? null; }
        return path;
      }
      const neighbors = this.adjacencyList.get(currentNode.key) || [];
      for (const neighbor of neighbors) {
        const moveDx = neighbor.x - currentNode.x;
        const moveDy = neighbor.y - currentNode.y;
        if (disallowedMove && moveDx === disallowedMove.dx && moveDy === disallowedMove.dy) {
            continue; // Skip the disallowed move (reversing direction)
        }
        if (!visited.has(neighbor.key)) {
          visited.add(neighbor.key); cameFrom.set(neighbor.key, currentNode); queue.push(neighbor);
        }
      }
    }
    return null;
  }
}

export const mazeGraph = new MazeGraph(MAP);

export function isWall(x: number, y: number) {
  const gridX = Math.floor(x / TILE_SIZE);
  const gridY = Math.floor(y / TILE_SIZE);
  return MAP[gridY]?.[gridX] === 1;
}
