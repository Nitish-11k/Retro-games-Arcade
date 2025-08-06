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
  Falling = 'falling',
  Hurt = 'hurt',
  Dead = 'dead'
}

export enum ObjectType {
  Platform = 'platform',
  Enemy = 'enemy',
  Coin = 'coin',
  Obstacle = 'obstacle',
  PowerUp = 'powerup'
}

export interface GameObject {
  id: number;
  type: ObjectType;
  position: Vector2;
  bounds: AABB;
  active: boolean;
  // Additional properties based on type
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
  invulnerable: number; // invulnerability timer
}

export class MarioRunnerEngine {
  // Game constants
  private readonly GRAVITY = 980; // pixels/second²
  private readonly JUMP_IMPULSE = -450; // negative is up
  private readonly PLAYER_SPEED = 200; // horizontal speed
  private readonly SCREEN_WIDTH = 800;
  private readonly SCREEN_HEIGHT = 600;
  private readonly WORLD_BUFFER = 200; // buffer zone for loading/unloading objects
  
  // Game state
  public player: Player;
  private camera: Vector2;
  private gameRunning: boolean = false;
  
  // Efficient world management using queues
  private levelObjects: GameObject[] = []; // All objects sorted by x position
  private activeObjects: GameObject[] = []; // Only objects near the player
  private objectIdCounter = 0;
  
  // Performance tracking
  private lastTime = 0;
  private accumulator = 0;
  private readonly FIXED_TIMESTEP = 1/60; // 60 FPS physics
  
  constructor() {
    this.player = {
      position: { x: 100, y: 400 },
      velocity: { x: this.PLAYER_SPEED, y: 0 },
      bounds: { x: 100, y: 400, width: 32, height: 32 },
      state: PlayerState.Running,
      grounded: true,
      health: 3,
      score: 0,
      invulnerable: 0
    };
    
    this.camera = { x: 0, y: 0 };
    this.initializeLevel();
  }
  
  // Initialize level with procedurally generated objects
  private initializeLevel(): void {
    this.levelObjects = [];
    this.activeObjects = [];
    
    // Generate platforms, enemies, and coins
    for (let x = 0; x < 10000; x += 150) {
      // Ground platforms
      this.addObject({
        type: ObjectType.Platform,
        position: { x, y: this.SCREEN_HEIGHT - 32 },
        bounds: { x, y: this.SCREEN_HEIGHT - 32, width: 128, height: 32 },
        properties: { isGround: true }
      });
      
      // Floating platforms
      if (Math.random() < 0.3) {
        const platformY = 300 + Math.random() * 200;
        this.addObject({
          type: ObjectType.Platform,
          position: { x: x + 200, y: platformY },
          bounds: { x: x + 200, y: platformY, width: 96, height: 16 },
          properties: { isFloating: true }
        });
      }
      
      // Enemies
      if (Math.random() < 0.4) {
        const enemyX = x + 300 + Math.random() * 200;
        this.addObject({
          type: ObjectType.Enemy,
          position: { x: enemyX, y: this.SCREEN_HEIGHT - 64 },
          bounds: { x: enemyX, y: this.SCREEN_HEIGHT - 64, width: 24, height: 24 },
          properties: { speed: -50, direction: -1, health: 1, startX: enemyX }
        });
      }
      
      // Coins
      if (Math.random() < 0.6) {
        const coinX = x + 100 + Math.random() * 300;
        const coinY = 200 + Math.random() * 300;
        this.addObject({
          type: ObjectType.Coin,
          position: { x: coinX, y: coinY },
          bounds: { x: coinX, y: coinY, width: 16, height: 16 },
          properties: { value: 100, collected: false }
        });
      }
    }
    
    // Sort level objects by x position for efficient processing
    this.levelObjects.sort((a, b) => a.position.x - b.position.x);
  }
  
  private addObject(config: {
    type: ObjectType;
    position: Vector2;
    bounds: AABB;
    properties?: any;
  }): void {
    const obj: GameObject = {
      id: this.objectIdCounter++,
      type: config.type,
      position: { ...config.position },
      bounds: { ...config.bounds },
      active: true,
      properties: config.properties || {}
    };
    
    this.levelObjects.push(obj);
  }
  
  // Main game loop with fixed timestep
  public update(currentTime: number): void {
    if (!this.gameRunning) return;
    
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return;
    }
    
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.accumulator += deltaTime;
    
    // Fixed timestep physics updates
    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.fixedUpdate(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }
    
    this.updateCamera();
    this.updateActiveObjects();
  }
  
  private fixedUpdate(deltaTime: number): void {
    this.updatePlayer(deltaTime);
    this.updateEnemies(deltaTime);
    this.handleCollisions();
    this.cleanupObjects();
  }
  
  // Player finite state machine and physics
  private updatePlayer(deltaTime: number): void {
    // Update invulnerability timer
    if (this.player.invulnerable > 0) {
      this.player.invulnerable -= deltaTime;
    }
    
    // Apply gravity
    if (!this.player.grounded) {
      this.player.velocity.y += this.GRAVITY * deltaTime;
    }
    
    // Update position
    this.player.position.x += this.player.velocity.x * deltaTime;
    this.player.position.y += this.player.velocity.y * deltaTime;
    
    // Update bounding box
    this.player.bounds.x = this.player.position.x;
    this.player.bounds.y = this.player.position.y;
    
    // State transitions based on physics
    if (this.player.velocity.y > 0 && this.player.state === PlayerState.Jumping) {
      this.player.state = PlayerState.Falling;
    }
    
    // Prevent falling through the world
    if (this.player.position.y > this.SCREEN_HEIGHT) {
      this.player.state = PlayerState.Dead;
      this.gameRunning = false;
    }
  }
  
  // Jump input handling with FSM validation
  public jump(): boolean {
    if (this.player.state === PlayerState.Running && this.player.grounded) {
      this.player.velocity.y = this.JUMP_IMPULSE;
      this.player.state = PlayerState.Jumping;
      this.player.grounded = false;
      return true;
    }
    return false;
  }
  
  // Efficient world management - the key DSA optimization
  private updateActiveObjects(): void {
    const playerX = this.player.position.x;
    const leftBound = playerX - this.WORLD_BUFFER;
    const rightBound = playerX + this.SCREEN_WIDTH + this.WORLD_BUFFER;
    
    // Add objects entering the active zone (from sorted levelObjects)
    while (this.levelObjects.length > 0 && 
           this.levelObjects[0].position.x < rightBound) {
      const obj = this.levelObjects.shift()!;
      this.activeObjects.push(obj);
    }
    
    // Remove objects that have left the active zone
    this.activeObjects = this.activeObjects.filter(obj => 
      obj.position.x + obj.bounds.width > leftBound && obj.active
    );
  }
  
  private updateEnemies(deltaTime: number): void {
    for (const obj of this.activeObjects) {
      if (obj.type === ObjectType.Enemy && obj.active) {
        // Simple AI: move back and forth
        if (obj.properties.speed) {
          obj.position.x += obj.properties.speed * deltaTime;
          obj.bounds.x = obj.position.x;
          
          // Reverse direction at edges (simple AI)
          if (obj.position.x < obj.properties.startX - 100 || 
              obj.position.x > obj.properties.startX + 100) {
            obj.properties.speed *= -1;
          }
        }
      }
    }
  }
  
  // AABB collision detection - highly optimized
  private checkAABBCollision(a: AABB, b: AABB): boolean {
    return (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y);
  }
  
  // Collision detection and response system
  private handleCollisions(): void {
    this.player.grounded = false;
    
    for (const obj of this.activeObjects) {
      if (!obj.active) continue;
      
      if (this.checkAABBCollision(this.player.bounds, obj.bounds)) {
        this.resolveCollision(obj);
      }
    }
  }
  
  private resolveCollision(obj: GameObject): void {
    const player = this.player;
    const objBounds = obj.bounds;
    const playerBounds = player.bounds;
    
    switch (obj.type) {
      case ObjectType.Platform:
        // Check collision direction
        const overlapX = Math.min(playerBounds.x + playerBounds.width - objBounds.x,
                                 objBounds.x + objBounds.width - playerBounds.x);
        const overlapY = Math.min(playerBounds.y + playerBounds.height - objBounds.y,
                                 objBounds.y + objBounds.height - playerBounds.y);
        
        // Resolve collision on the axis with least overlap
        if (overlapX < overlapY) {
          // Horizontal collision - hit wall
          if (playerBounds.x < objBounds.x) {
            player.position.x = objBounds.x - playerBounds.width;
            player.velocity.x = 0; // Stop forward movement (game over condition)
            player.state = PlayerState.Dead;
            this.gameRunning = false;
          }
        } else {
          // Vertical collision
          if (player.velocity.y > 0) { // Falling onto platform
            player.position.y = objBounds.y - playerBounds.height;
            player.velocity.y = 0;
            player.grounded = true;
            if (player.state === PlayerState.Falling) {
              player.state = PlayerState.Running;
            }
          }
        }
        break;
        
      case ObjectType.Enemy:
        if (player.invulnerable <= 0) {
          // Check if stomping enemy
          if (player.velocity.y > 0 && 
              playerBounds.y + playerBounds.height - 10 < objBounds.y) {
            // Stomp enemy
            obj.active = false;
            player.velocity.y = this.JUMP_IMPULSE * 0.5; // Small bounce
            player.score += 200;
          } else {
            // Take damage
            this.damagePlayer();
          }
        }
        break;
        
      case ObjectType.Coin:
        if (!obj.properties.collected) {
          obj.properties.collected = true;
          obj.active = false;
          player.score += obj.properties.value || 100;
        }
        break;
        
      case ObjectType.Obstacle:
        if (player.invulnerable <= 0) {
          this.damagePlayer();
        }
        break;
    }
  }
  
  private damagePlayer(): void {
    this.player.health--;
    this.player.invulnerable = 2.0; // 2 seconds of invulnerability
    this.player.state = PlayerState.Hurt;
    
    if (this.player.health <= 0) {
      this.player.state = PlayerState.Dead;
      this.gameRunning = false;
    }
    
    // Knockback effect
    this.player.velocity.y = this.JUMP_IMPULSE * 0.3;
    setTimeout(() => {
      if (this.player.state === PlayerState.Hurt) {
        this.player.state = PlayerState.Running;
      }
    }, 500);
  }
  
  private cleanupObjects(): void {
    // Remove inactive objects from activeObjects array
    for (let i = this.activeObjects.length - 1; i >= 0; i--) {
      if (!this.activeObjects[i].active) {
        this.activeObjects.splice(i, 1);
      }
    }
  }
  
  private updateCamera(): void {
    // Camera follows player with some offset
    this.camera.x = this.player.position.x - this.SCREEN_WIDTH * 0.3;
    this.camera.y = 0; // Fixed vertical camera for simplicity
  }
  
  // Public getters for rendering
  public getPlayer(): Player {
    return { ...this.player };
  }
  
  public getActiveObjects(): GameObject[] {
    return this.activeObjects.filter(obj => obj.active);
  }
  
  public getCamera(): Vector2 {
    return { ...this.camera };
  }
  
  public isGameRunning(): boolean {
    return this.gameRunning;
  }
  
  public startGame(): void {
    this.gameRunning = true;
    this.lastTime = 0;
  }
  
  public resetGame(): void {
    this.player = {
      position: { x: 100, y: 400 },
      velocity: { x: this.PLAYER_SPEED, y: 0 },
      bounds: { x: 100, y: 400, width: 32, height: 32 },
      state: PlayerState.Running,
      grounded: true,
      health: 3,
      score: 0,
      invulnerable: 0
    };
    
    this.camera = { x: 0, y: 0 };
    this.gameRunning = false;
    this.lastTime = 0;
    this.accumulator = 0;
    this.initializeLevel();
  }
  
  // Debug information
  public getDebugInfo(): any {
    return {
      activeObjectsCount: this.activeObjects.length,
      totalObjectsRemaining: this.levelObjects.length,
      playerState: this.player.state,
      playerPosition: this.player.position,
      cameraPosition: this.camera
    };
  }
}
