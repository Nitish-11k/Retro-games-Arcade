export interface Vector2 {
  x: number;
  y: number;
}

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum PlayerState {
  Running = 'running',
  Jumping = 'jumping',
  DoubleJumping = 'double_jumping',
  Falling = 'falling',
  Hurt = 'hurt',
  Dead = 'dead',
}

export enum ObjectType {
  Platform = 'platform',
  Enemy = 'enemy',
  Coin = 'coin',
  Obstacle = 'obstacle',
  PowerUp = 'powerup',
}

export interface GameObject {
  id: number;
  type: ObjectType;
  position: Vector2;
  velocity: Vector2;
  bounds: AABB;
  active: boolean;
  properties?: any;
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  bounds: AABB;
  state: PlayerState;
  grounded: boolean;
  health: number;
  score: number;
  invulnerable: number;
  jumpCount: number;
  lastGroundedTime: number;
  isJumpHeld: boolean;
}

export class MarioRunnerEngine {
  // Core Physics Constants - Smoother Feel
  private readonly GRAVITY = 2400; // Slightly reduced gravity for better control
  private readonly MAX_FALL_SPEED = 900;
  private readonly PLAYER_SPEED = 250;
  
  // Jump Mechanics - More Forgiving
  private readonly JUMP_INITIAL_VELOCITY = -550;
  private readonly DOUBLE_JUMP_VELOCITY = -480;
  private readonly JUMP_HOLD_FORCE = -60;
  private readonly JUMP_HOLD_DURATION = 200;
  private readonly COYOTE_TIME = 120; // Increased coyote time
  private readonly JUMP_BUFFER_TIME = 120; // Increased jump buffer
  private readonly ENEMY_STOMP_BOUNCE = -350;

  // Game State
  public player: Player;
  private camera: Vector2;
  private gameRunning: boolean = false;
  
  // World Management
  private levelObjects: GameObject[] = [];
  private activeObjects: Map<number, GameObject> = new Map();
  private spatialGrid: Map<string, GameObject[]> = new Map();
  private readonly GRID_CELL_SIZE = 200;
  private objectIdCounter = 0;
  
  // Input State
  private lastJumpPressedTime = 0;
  private jumpStartTime = 0;

  // Audio
  private audio: { [key: string]: HTMLAudioElement } = {};

  // Performance
  private lastTime = 0;
  private accumulator = 0;
  private readonly FIXED_TIMESTEP = 1 / 60;

  constructor() {
    this.player = this.createInitialPlayer();
    this.camera = { x: 0, y: 0 };
    this.initializeLevel();
    this.loadAudio();
  }

  private createInitialPlayer(): Player {
    const startY = 400;
    return {
      position: { x: 100, y: startY },
      velocity: { x: this.PLAYER_SPEED, y: 0 },
      bounds: { x: 100, y: startY, width: 32, height: 48 },
      state: PlayerState.Falling,
      grounded: false,
      health: 3,
      score: 0,
      invulnerable: 0,
      jumpCount: 0,
      lastGroundedTime: 0,
      isJumpHeld: false,
    };
  }

  private loadAudio(): void {
    this.audio = {
      jump: new Audio('/sounds/jump.wav'),
      doubleJump: new Audio('/sounds/double-jump.wav'),
      stomp: new Audio('/sounds/stomp.wav'),
      coin: new Audio('/sounds/coin.wav'),
      hurt: new Audio('/sounds/hurt.wav'),
      gameOver: new Audio('/sounds/game-over.wav'),
      land: new Audio('/sounds/land.wav'),
    };
    Object.values(this.audio).forEach(audio => audio.load());
  }

  private playSound(sound: string): void {
    if (this.audio[sound]) {
      this.audio[sound].currentTime = 0;
      this.audio[sound].play().catch(e => console.error(`Audio play failed for ${sound}:`, e));
    }
  }

  private initializeLevel(): void {
    this.levelObjects = [];
    this.activeObjects.clear();
    this.spatialGrid.clear();
    this.objectIdCounter = 0;

    this.addObject({ type: ObjectType.Platform, position: { x: -100, y: 550 }, bounds: { width: 500, height: 50 } });
    let currentX = 400;

    for (let i = 0; i < 200; i++) {
      const gap = 80 + Math.random() * 150;
      currentX += gap;

      const platformWidth = 100 + Math.random() * 200;
      const platformY = 550 - Math.random() * 250;
      this.addObject({ type: ObjectType.Platform, position: { x: currentX, y: platformY }, bounds: { width: platformWidth, height: 50 } });

      if (Math.random() < 0.7) {
        for (let j = 0; j < 5; j++) {
          this.addObject({ type: ObjectType.Coin, position: { x: currentX + j * 40, y: platformY - 60 }, bounds: { width: 24, height: 24 } });
        }
      }

      if (Math.random() < 0.4) {
        this.addObject({ type: ObjectType.Enemy, position: { x: currentX + 50, y: platformY - 32 }, bounds: { width: 32, height: 32 }, properties: { patrol: { start: currentX, end: currentX + platformWidth - 32 } } });
      }
      
      currentX += platformWidth;
    }
    
    this.buildSpatialGrid();
  }

  private addObject(config: { type: ObjectType; position: Vector2; bounds: { width: number, height: number }; properties?: any; }): void {
    const obj: GameObject = {
      id: this.objectIdCounter++,
      type: config.type,
      position: { ...config.position },
      velocity: { x: 0, y: 0 },
      bounds: { ...config.position, ...config.bounds },
      active: true,
      properties: config.properties || {},
    };
    this.levelObjects.push(obj);
  }

  private buildSpatialGrid(): void {
    this.spatialGrid.clear();
    for (const obj of this.levelObjects) {
      const startX = Math.floor(obj.bounds.x / this.GRID_CELL_SIZE);
      const endX = Math.floor((obj.bounds.x + obj.bounds.width) / this.GRID_CELL_SIZE);
      const startY = Math.floor(obj.bounds.y / this.GRID_CELL_SIZE);
      const endY = Math.floor((obj.bounds.y + obj.bounds.height) / this.GRID_CELL_SIZE);

      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          const key = `${x},${y}`;
          if (!this.spatialGrid.has(key)) {
            this.spatialGrid.set(key, []);
          }
          this.spatialGrid.get(key)!.push(obj);
        }
      }
    }
  }

  public pressJump(): void {
    this.lastJumpPressedTime = Date.now();
    this.player.isJumpHeld = true;
  }

  public releaseJump(): void {
    this.player.isJumpHeld = false;
  }

  public update(currentTime: number): void {
    if (!this.gameRunning) return;

    const deltaTime = (currentTime - (this.lastTime || currentTime)) / 1000;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.fixedUpdate(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    this.updateCamera();
    this.updateActiveObjects();
  }

  private fixedUpdate(deltaTime: number): void {
    this.handlePlayerInput();
    this.updatePlayer(deltaTime);
    this.updateEntities(deltaTime);
    this.handleCollisions();
  }

  private handlePlayerInput(): void {
    const now = Date.now();
    const wasGroundedRecently = (now - this.player.lastGroundedTime) < this.COYOTE_TIME;

    if ((now - this.lastJumpPressedTime) < this.JUMP_BUFFER_TIME) {
      if (this.player.jumpCount < 1) {
        if (this.player.grounded || wasGroundedRecently) {
          this.player.velocity.y = this.JUMP_INITIAL_VELOCITY;
          this.player.state = PlayerState.Jumping;
          this.player.grounded = false;
          this.player.jumpCount = 1;
          this.jumpStartTime = now;
          this.playSound('jump');
          this.lastJumpPressedTime = 0;
        }
      } else if (this.player.jumpCount < 2) {
        this.player.velocity.y = this.DOUBLE_JUMP_VELOCITY;
        this.player.state = PlayerState.DoubleJumping;
        this.player.jumpCount = 2;
        this.playSound('doubleJump');
        this.lastJumpPressedTime = 0;
      }
    }
  }

  private updatePlayer(deltaTime: number): void {
    if (this.player.velocity.x > 0) {
        this.player.position.x += this.player.velocity.x * deltaTime;
    }

    this.player.velocity.y += this.GRAVITY * deltaTime;
    if (this.player.velocity.y > this.MAX_FALL_SPEED) {
      this.player.velocity.y = this.MAX_FALL_SPEED;
    }

    if (this.player.isJumpHeld && this.player.state === PlayerState.Jumping) {
      if (Date.now() - this.jumpStartTime < this.JUMP_HOLD_DURATION) {
        this.player.velocity.y += this.JUMP_HOLD_FORCE;
      } else {
        this.player.isJumpHeld = false;
      }
    }

    this.player.position.y += this.player.velocity.y * deltaTime;
    this.player.bounds.x = this.player.position.x;
    this.player.bounds.y = this.player.position.y;

    if (!this.player.grounded) {
      if (this.player.velocity.y > 0 && this.player.state !== PlayerState.Falling && this.player.state !== PlayerState.DoubleJumping) {
        this.player.state = PlayerState.Falling;
      }
    }

    if (this.player.position.y > 1000) {
      this.damagePlayer(true);
    }
    
    if (this.player.invulnerable > 0) {
      this.player.invulnerable -= deltaTime;
    }
  }
  
  private updateEntities(deltaTime: number): void {
    for (const obj of this.activeObjects.values()) {
      if (obj.type === ObjectType.Enemy && obj.properties.patrol) {
        obj.velocity.x = obj.velocity.x || -50;
        obj.position.x += obj.velocity.x * deltaTime;
        if (obj.position.x < obj.properties.patrol.start || obj.position.x > obj.properties.patrol.end) {
          obj.velocity.x *= -1;
        }
        obj.bounds.x = obj.position.x;
      }
    }
  }

  private getNearbyObjects(bounds: AABB): GameObject[] {
    const nearby = new Set<GameObject>();
    const startX = Math.floor(bounds.x / this.GRID_CELL_SIZE) - 1;
    const endX = Math.floor((bounds.x + bounds.width) / this.GRID_CELL_SIZE) + 1;
    const startY = Math.floor(bounds.y / this.GRID_CELL_SIZE) - 1;
    const endY = Math.floor((bounds.y + bounds.height) / this.GRID_CELL_SIZE) + 1;

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x},${y}`;
        if (this.spatialGrid.has(key)) {
          this.spatialGrid.get(key)!.forEach(obj => nearby.add(obj));
        }
      }
    }
    return Array.from(nearby);
  }

  private handleCollisions(): void {
    const wasGrounded = this.player.grounded;
    this.player.grounded = false;
    
    const nearbyObjects = this.getNearbyObjects(this.player.bounds);

    for (const obj of nearbyObjects) {
      if (!obj.active) continue;
      
      const collision = this.checkAABBCollision(this.player.bounds, obj.bounds);
      if (collision) {
        this.resolveCollision(obj, collision);
      }
    }

    if (this.player.grounded && !wasGrounded) {
        this.player.jumpCount = 0;
        this.playSound('land');
    }
  }

  private checkAABBCollision(a: AABB, b: AABB): { overlapX: number, overlapY: number } | null {
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

    if (overlapX > 0 && overlapY > 0) {
      return { overlapX, overlapY };
    }
    return null;
  }

  private resolveCollision(obj: GameObject, collision: { overlapX: number, overlapY: number }): void {
    const player = this.player;
    
    switch (obj.type) {
      case ObjectType.Platform:
        if (collision.overlapY < collision.overlapX) {
          if (player.velocity.y >= 0 && player.bounds.y < obj.bounds.y) {
            player.position.y -= collision.overlapY;
            player.velocity.y = 0;
            player.grounded = true;
            player.lastGroundedTime = Date.now();
            if (player.state !== PlayerState.Running) {
              player.state = PlayerState.Running;
            }
          } else if (player.velocity.y < 0) {
            player.position.y += collision.overlapY;
            player.velocity.y = 0;
          }
        } else {
          // Stop player instead of killing them
          this.player.velocity.x = 0;
        }
        break;

      case ObjectType.Enemy:
        if (player.invulnerable <= 0) {
          if (player.velocity.y > 0 && collision.overlapY < collision.overlapX && (player.bounds.y + player.bounds.height - collision.overlapY) < obj.bounds.y + 10) {
            obj.active = false;
            player.velocity.y = this.ENEMY_STOMP_BOUNCE;
            player.score += 200;
            this.playSound('stomp');
          } else {
            this.damagePlayer();
          }
        }
        break;

      case ObjectType.Coin:
        if (obj.active) {
          obj.active = false;
          player.score += 100;
          this.playSound('coin');
        }
        break;
    }
  }

  private damagePlayer(instantKill = false): void {
    if (this.player.invulnerable > 0 && !instantKill) return;
    
    this.player.health = instantKill ? 0 : this.player.health - 1;
    
    if (this.player.health <= 0) {
      this.player.state = PlayerState.Dead;
      this.gameRunning = false;
      this.playSound('gameOver');
    } else {
      this.player.invulnerable = 1.5;
      this.player.state = PlayerState.Hurt;
      this.player.velocity.y = -300;
      this.playSound('hurt');
    }
  }

  private updateActiveObjects(): void {
    const viewRect = { x: this.camera.x - 200, y: this.camera.y - 200, width: 1200, height: 1000 };
    this.activeObjects.clear();
    const nearby = this.getNearbyObjects(viewRect);
    for (const obj of nearby) {
        if (obj.active) {
            this.activeObjects.set(obj.id, obj);
        }
    }
  }

  private updateCamera(): void {
    const targetX = this.player.position.x - 200;
    const targetY = this.player.position.y - 300;
    
    this.camera.x += (targetX - this.camera.x) * 0.08;
    this.camera.y += (targetY - this.camera.y) * 0.08;

    if (this.camera.y < 0) this.camera.y = 0;
    if (this.camera.y > 200) this.camera.y = 200; 
  }

  public getPlayer(): Player { return { ...this.player }; }
  public getActiveObjects(): GameObject[] { return Array.from(this.activeObjects.values()); }
  public getCamera(): Vector2 { return { ...this.camera }; }
  public isGameRunning(): boolean { return this.gameRunning; }

  public startGame(): void {
    if (this.gameRunning) return;
    this.gameRunning = true;
    this.lastTime = performance.now();
  }

  public resetGame(): void {
    this.player = this.createInitialPlayer();
    this.camera = { x: 0, y: 0 };
    this.gameRunning = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.initializeLevel();
  }
  
  public getDebugInfo(): any {
    return {
      activeObjectsCount: this.activeObjects.size,
      playerState: this.player.state,
      grounded: this.player.grounded,
      velocity: this.player.velocity,
      jumpCount: this.player.jumpCount,
      lastJumpPressedTime: this.lastJumpPressedTime,
      lastGroundedTime: this.player.lastGroundedTime,
    };
  }
}