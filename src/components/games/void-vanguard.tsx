"use client";

const YouWinScreen = ({ onRestart }: { onRestart: () => void }) => (
    <GameOverlay title="YOU WIN!" buttonText="Play Again" onButtonClick={onRestart}>
        <p className="text-2xl text-white">You are the Void Vanguard!</p>
    </GameOverlay>
);

import React, { useState, useEffect, useReducer, useCallback, useRef, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Shield, Zap, ChevronsUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// --- 1. CONSTANTS & CONFIGURATION ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 25;
const PLAYER_SPEED = 350;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const PLAYER_BULLET_SPEED = 500;
const ENEMY_BULLET_SPEED = 250;
const ENEMY_FIRE_RATE = 2; // Seconds between shots for a standard enemy
const ENEMY_SPEED = 75;
const FIRE_RATE = 220;
const ENEMY_SPAWN_RATE = 1.2; // Time in seconds between each enemy spawn
const POWER_UP_SPEED = 120;
const INITIAL_LIVES = 3;
const PLAYER_BULLET_POOL_SIZE = 50;
const ENEMY_BULLET_POOL_SIZE = 100;
const POWER_UP_DROP_CHANCE = 0.15; // 15% chance to drop a power-up
const MAX_LEVELS = 10; // Total number of levels

const COLORS = {
    BACKGROUND: '#0A0A1E',
    PLAYER_SHIP: '#00FFDD',
    PLAYER_BULLET: '#FFF8B8',
    ENEMY_STANDARD: '#FF3864',
    ENEMY_GIFT: '#9D4DFF',
    ENEMY_BULLET: '#FF8B4C',
    POWER_UP: '#39FF14',
};

const FONT_FAMILY = "'Press Start 2P', monospace";

// --- 2. DATA STRUCTURES (Quadtree) ---
class Quadtree {
    private maxObjects: number;
    private maxLevels: number;
    private level: number;
    private bounds: { x: number; y: number; width: number; height: number; };
    private objects: GameObject[];
    private nodes: Quadtree[];

    constructor(bounds: { x: number, y: number, width: number, height: number }, maxObjects = 10, maxLevels = 4, level = 0) {
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
        this.bounds = bounds;
        this.objects = [];
        this.nodes = [];
    }

    private split() {
        const nextLevel = this.level + 1;
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;

        this.nodes[0] = new Quadtree({ x: x + subWidth, y, width: subWidth, height: subHeight }, this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[1] = new Quadtree({ x, y, width: subWidth, height: subHeight }, this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[2] = new Quadtree({ x, y: y + subHeight, width: subWidth, height: subHeight }, this.maxObjects, this.maxLevels, nextLevel);
        this.nodes[3] = new Quadtree({ x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight }, this.maxObjects, this.maxLevels, nextLevel);
    }

    private getIndex(pRect: GameObject): number {
        let index = -1;
        const verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        const horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        const topQuadrant = pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint;
        const bottomQuadrant = pRect.y > horizontalMidpoint;

        if (pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        } else if (pRect.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }
        return index;
    }

    public insert(pRect: GameObject) {
        if (this.nodes.length) {
            const index = this.getIndex(pRect);
            if (index !== -1) {
                this.nodes[index].insert(pRect);
                return;
            }
        }

        this.objects.push(pRect);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this.split();
            }
            let i = 0;
            while (i < this.objects.length) {
                const index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }
    }

    public retrieve(pRect: GameObject): GameObject[] {
        const index = this.getIndex(pRect);
        let returnObjects = this.objects;

        if (this.nodes.length) {
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(pRect));
            } else {
                for (let i = 0; i < this.nodes.length; i++) {
                    returnObjects = returnObjects.concat(this.nodes[i].retrieve(pRect));
                }
            }
        }
        return returnObjects;
    }
    
    public clear() {
        this.objects = [];
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }
        this.nodes = [];
    }
}


// --- 3. TYPE DEFINITIONS ---
interface GameObject { id: number; x: number; y: number; width: number; height: number; [key: string]: any; }
type Player = { x: number; y: number; shield: boolean };
type Bullet = { id: number; x: number; y: number; vx: number; vy: number; active: boolean; };
type Enemy = { id: number; x: number; y: number; width: number; height: number; type: 'standard' | 'boss'; hp: number; bossState?: BossState; attackTimer?: number; direction?: number; lastShot?: number; };
type PowerUp = { id: number; x: number; y: number; width: number; height: number; type: PowerUpType; };
type PowerUpType = 'RAPID_FIRE' | 'SPREAD_SHOT' | 'SHIELD';
type BossState = 'ENTERING' | 'PHASE_1' | 'PHASE_2' | 'DEFEATED';

type GameState = {
    status: 'START_SCREEN' | 'PLAYING' | 'LEVEL_COMPLETE' | 'GAME_OVER' | 'YOU_WIN';
    player: Player;
    playerBullets: Bullet[];
    enemyBullets: Bullet[];
    enemies: Enemy[];
    powerUps: PowerUp[];
    score: number;
    lives: number;
    level: number;
    lastFireTime: number;
    activePowerUp: PowerUpType | null;
    powerUpTimer: number;
    bossSpawned: boolean;
    enemyQueue: Enemy[];
    enemySpawnTimer: number;
};

type Action =
    | { type: 'START_GAME' }
    | { type: 'NEXT_LEVEL' }
    | { type: 'GAME_TICK'; payload: { dt: number; keys: Set<string>; quadtree: Quadtree; } }
    | { type: 'RESET_GAME' };

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | null>(null);

// --- UTILITY FUNCTIONS ---
const checkCollision = (a: GameObject, b: GameObject): boolean => {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

const useGameLoop = (callback: (dt: number) => void, running: boolean) => {
    const lastTimeRef = useRef<number>(performance.now());
    const frameRef = useRef<number>(0);
    const accumulator = useRef(0);

    const loop = useCallback((time: number) => {
        const dt = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;
        accumulator.current += dt;

        const fixedDt = 1 / 60; // Run at a fixed 60 FPS
        while (accumulator.current >= fixedDt) {
            callback(fixedDt);
            accumulator.current -= fixedDt;
        }

        frameRef.current = requestAnimationFrame(loop);
    }, [callback]);

    useEffect(() => {
        if (running) {
            lastTimeRef.current = performance.now();
            frameRef.current = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(frameRef.current);
        }
        return () => cancelAnimationFrame(frameRef.current);
    }, [running, loop]);
};


// --- 4. CORE GAME LOGIC (useReducer) ---

const createInitialState = (): GameState => ({
    status: 'START_SCREEN',
    player: { x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - 20, shield: false },
    playerBullets: Array.from({ length: PLAYER_BULLET_POOL_SIZE }, (_, i) => ({ id: i, x: 0, y: 0, vx: 0, vy: 0, active: false })),
    enemyBullets: Array.from({ length: ENEMY_BULLET_POOL_SIZE }, (_, i) => ({ id: i, x: 0, y: 0, vx: 0, vy: 0, active: false })),
    enemies: [],
    powerUps: [],
    score: 0,
    lives: INITIAL_LIVES,
    level: 1,
    lastFireTime: 0,
    activePowerUp: null,
    powerUpTimer: 0,
    bossSpawned: false,
    enemyQueue: [],
    enemySpawnTimer: ENEMY_SPAWN_RATE, // Initialize with spawn rate so enemies spawn immediately
});

const spawnWave = (level: number): Enemy[] => {
    const enemies: Enemy[] = [];
    const rows = 2 + Math.min(level, 5);
    const cols = 8;
    const enemyWidth = 50;
    const enemyHeight = 30;
    const horizontalGap = (GAME_WIDTH - cols * enemyWidth) / (cols + 1);

    const wave: Enemy[] = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            wave.push({
                id: Date.now() + (row * cols + col),
                x: horizontalGap * (col + 1) + col * enemyWidth,
                y: -100 - (row * 80), // Start further above screen, more staggered
                width: enemyWidth,
                height: enemyHeight,
                type: 'standard',
                hp: 1 + Math.floor(level / 2),
                lastShot: 0,
            });
        }
    }
    // Return sorted so they spawn from the top row first
    return wave.sort((a, b) => b.y - a.y);
};

const gameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case 'START_GAME':
            return { 
                ...createInitialState(), 
                status: 'PLAYING', 
                enemyQueue: spawnWave(1),
                enemySpawnTimer: 0 // Spawn enemies immediately
            };
        case 'NEXT_LEVEL': {
            const nextLevel = state.level + 1;
            return {
                ...createInitialState(),
                status: 'PLAYING',
                level: nextLevel,
                score: state.score,
                lives: state.lives,
                enemyQueue: spawnWave(nextLevel),
                enemySpawnTimer: 0, // Spawn enemies immediately
            };
        }
        case 'RESET_GAME':
            return createInitialState();
        case 'GAME_TICK': {
            if (state.status !== 'PLAYING') return state;
            
            const { dt, keys, quadtree } = action.payload;
            const now = performance.now();
            
            let nextState = { ...state };

            // --- Replenish Enemy Queue ---
            if (nextState.enemyQueue.length === 0 && !nextState.bossSpawned) {
                nextState.enemyQueue = spawnWave(nextState.level);
                nextState.enemySpawnTimer = 0; // Spawn immediately
            }

            // --- Enemy Spawning ---
            if (nextState.enemyQueue.length > 0 && !nextState.bossSpawned) {
                nextState.enemySpawnTimer -= dt;
                if (nextState.enemySpawnTimer <= 0) {
                    const newQueue = [...nextState.enemyQueue];
                    const spawnCount = Math.random() < 0.4 ? 2 : 1; // 40% chance to spawn two

                    for (let i = 0; i < spawnCount && newQueue.length > 0; i++) {
                        const enemyToSpawn = newQueue.shift();
                        if (enemyToSpawn) {
                            // Make sure enemies don't spawn on top of each other
                            if (i > 0 && nextState.enemies.length > 0) {
                                const lastEnemy = nextState.enemies[nextState.enemies.length-1];
                                enemyToSpawn.x = (lastEnemy.x + 70) % (GAME_WIDTH - 50);
                            }
                            // Only spawn enemy if it's not visible yet (above screen)
                            if (enemyToSpawn.y < -enemyToSpawn.height) {
                                nextState.enemies = [...nextState.enemies, { ...enemyToSpawn, lastShot: now } ];
                            } else {
                                // Put it back in the queue if it's still visible
                                newQueue.unshift(enemyToSpawn);
                            }
                        }
                    }
                    
                    nextState.enemyQueue = newQueue;
                    nextState.enemySpawnTimer = ENEMY_SPAWN_RATE * (spawnCount > 1 ? 1.5 : 1); // slightly longer delay after spawning two
                }
            }

            // --- Player Power-up Timer ---
            if (nextState.activePowerUp) {
                nextState.powerUpTimer -= dt;
                if (nextState.powerUpTimer <= 0) {
                    nextState.activePowerUp = null;
                    nextState.player = { ...nextState.player, shield: false };
                }
            }

            // --- Player Movement ---
            let newPlayerX = nextState.player.x;
            if (keys.has('arrowleft') || keys.has('a')) newPlayerX -= PLAYER_SPEED * dt;
            if (keys.has('arrowright') || keys.has('d')) newPlayerX += PLAYER_SPEED * dt;
            nextState.player = { ...nextState.player, x: Math.max(0, Math.min(GAME_WIDTH - PLAYER_WIDTH, newPlayerX)) };

            // --- Player Firing (from Object Pool) ---
            const fireRate = nextState.activePowerUp === 'RAPID_FIRE' ? FIRE_RATE / 2 : FIRE_RATE;
            if (keys.has(' ') && now - nextState.lastFireTime > fireRate) {
                nextState.lastFireTime = now;
                const newBullets = [...nextState.playerBullets];
                
                const fire = (vx: number, vy: number) => {
                    const bulletIndex = newBullets.findIndex(b => !b.active);
                    if (bulletIndex !== -1) {
                         newBullets[bulletIndex] = { ...newBullets[bulletIndex], active: true, x: nextState.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: nextState.player.y, vx, vy };
                    }
                };

                fire(0, -PLAYER_BULLET_SPEED);
                if (nextState.activePowerUp === 'SPREAD_SHOT') {
                    fire(-150, -PLAYER_BULLET_SPEED * 0.9);
                    fire(150, -PLAYER_BULLET_SPEED * 0.9);
                }
                nextState.playerBullets = newBullets;
            }

            // --- Update Object Positions ---
            nextState.playerBullets = nextState.playerBullets.map(b => b.active ? { 
                ...b, 
                y: b.y + b.vy * dt, 
                x: b.x + b.vx * dt, 
                active: b.y > -BULLET_HEIGHT && b.y < GAME_HEIGHT && b.x > -BULLET_WIDTH && b.x < GAME_WIDTH 
            } : b);
            nextState.enemyBullets = nextState.enemyBullets.map(b => b.active ? { 
                ...b, 
                y: b.y + b.vy * dt, 
                x: b.x + b.vx * dt, 
                active: b.y < GAME_HEIGHT && b.y > -BULLET_HEIGHT && b.x > -BULLET_WIDTH && b.x < GAME_WIDTH 
            } : b);
            nextState.powerUps = nextState.powerUps.map(p => ({ ...p, y: p.y + POWER_UP_SPEED * dt }));
            
            // --- Enemy Movement & Boss Logic ---
            const enemyBullets = [...nextState.enemyBullets];
            nextState.enemies = nextState.enemies.map(enemy => {
                 if (enemy.type === 'boss') {
                    let newBoss = { ...enemy };
                    // Boss State Machine
                    switch(newBoss.bossState) {
                        case 'ENTERING':
                            newBoss.y += ENEMY_SPEED * dt * 0.5;
                            if (newBoss.y >= 50) {
                                newBoss.y = 50;
                                newBoss.bossState = 'PHASE_1';
                                newBoss.attackTimer = 2; // Start firing after 2s
                            }
                            break;
                        case 'PHASE_1':
                        case 'PHASE_2':
                            // Movement
                            let newX = newBoss.x + ENEMY_SPEED * dt * (newBoss.direction || 1) * (newBoss.bossState === 'PHASE_2' ? 1.5 : 1);
                            if (newX <= 0 || newX + newBoss.width >= GAME_WIDTH) {
                                newBoss.direction = -(newBoss.direction || 1);
                            }
                            newBoss.x = newX;
                            
                            // Attacking
                            newBoss.attackTimer! -= dt;
                            if (newBoss.attackTimer! <= 0) {
                                const fire = (vx: number, vy: number) => {
                                    const bulletIndex = enemyBullets.findIndex(b => !b.active);
                                    if(bulletIndex !== -1) {
                                        enemyBullets[bulletIndex] = { ...enemyBullets[bulletIndex], active: true, x: newBoss.x + newBoss.width / 2, y: newBoss.y + newBoss.height, vx, vy };
                                    }
                                }
                                if (newBoss.bossState === 'PHASE_1') {
                                    fire(0, ENEMY_BULLET_SPEED);
                                    newBoss.attackTimer = 1.5;
                                } else { // PHASE_2
                                    fire(0, ENEMY_BULLET_SPEED * 1.2);
                                    fire(-100, ENEMY_BULLET_SPEED * 0.9);
                                    fire(100, ENEMY_BULLET_SPEED * 0.9);
                                    newBoss.attackTimer = 1;
                                }
                            }
                            // Check for phase transition
                            if (newBoss.hp < 50 && newBoss.bossState === 'PHASE_1') {
                                newBoss.bossState = 'PHASE_2';
                            }
                            break;
                    }
                     return newBoss;
                }

                // Standard enemy logic
                const newY = enemy.y + ENEMY_SPEED * dt;
                let updatedEnemy = { ...enemy, y: newY, lastShot: enemy.lastShot || now };

                // Standard enemy firing logic
                if (now - updatedEnemy.lastShot > ENEMY_FIRE_RATE * 1000 && updatedEnemy.y > 0) {
                    const bulletIndex = enemyBullets.findIndex(b => !b.active);
                    if (bulletIndex !== -1 && updatedEnemy.y > 0) {
                        const enemyCenter = updatedEnemy.x + updatedEnemy.width / 2;
                        const vx = 0; // Bullets travel straight down
                        const vy = ENEMY_BULLET_SPEED; // Downward speed
                        enemyBullets[bulletIndex] = { ...enemyBullets[bulletIndex], active: true, x: enemyCenter, y: updatedEnemy.y + updatedEnemy.height, vx, vy };
                        updatedEnemy.lastShot = now;
                    }
                }

                return updatedEnemy;
            });
            nextState.enemyBullets = enemyBullets;

            // --- Quadtree and Collisions ---
            quadtree.clear();
            nextState.enemies.forEach(e => quadtree.insert(e));
            nextState.powerUps.forEach(p => quadtree.insert(p));

            // Player Bullets vs Enemies
            const enemiesHit = new Map<number, number>();
            nextState.playerBullets.forEach(bullet => {
                if (!bullet.active) return;
                const bulletRect = { ...bullet, width: BULLET_WIDTH, height: BULLET_HEIGHT };
                const potentialCollisions = quadtree.retrieve(bulletRect);

                for (const enemy of potentialCollisions) {
                    if (checkCollision(bulletRect, enemy)) {
                        bullet.active = false;
                        enemiesHit.set(enemy.id, (enemiesHit.get(enemy.id) || 0) + 1);
                        break; 
                    }
                }
            });

            if (enemiesHit.size > 0) {
                let scoreGained = 0;
                const newPowerUps = [...nextState.powerUps];
                
                const remainingEnemies = nextState.enemies.filter(enemy => {
                    const damage = enemiesHit.get(enemy.id);
                    if (damage) {
                        enemy.hp -= damage;
                        if (enemy.hp <= 0) {
scoreGained += enemy.type === 'boss' ? 1000 : 50;
                            if (enemy.type === 'boss') {
                                enemy.bossState = 'DEFEATED';
                                nextState.status = nextState.level >= MAX_LEVELS ? 'YOU_WIN' : 'LEVEL_COMPLETE';
                            } else {
                                // Random Power-up Drop
                                if (Math.random() < POWER_UP_DROP_CHANCE) {
                                    const powerUpTypes: PowerUpType[] = ['RAPID_FIRE', 'SPREAD_SHOT', 'SHIELD'];
                                    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                                    newPowerUps.push({ id: Date.now(), x: enemy.x, y: enemy.y, width: 20, height: 20, type });
                                }
                            }
                            return false; // Remove enemy
                        }
                    }
                    return true;
                });
                nextState.enemies = remainingEnemies;
                nextState.score += scoreGained;
                nextState.powerUps = newPowerUps;
            }

            // --- Player Collisions ---
            const playerRect = { ...nextState.player, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, id: -1 };
            let playerHit = false;

            // Player vs Enemy Bullets
            nextState.enemyBullets.forEach(bullet => {
                if (!bullet.active) return;
                if (checkCollision(playerRect, { ...bullet, width: BULLET_WIDTH, height: BULLET_HEIGHT })) {
                    bullet.active = false;
                    playerHit = true;
                }
            });

            // Player vs Enemies & PowerUps
            const potentialPlayerCollisions = quadtree.retrieve(playerRect);
            for (const obj of potentialPlayerCollisions) {
                if (checkCollision(playerRect, obj)) {
                     if (obj.hp) { // It's an enemy
                        playerHit = true;
                        nextState.enemies = nextState.enemies.filter(e => e.id !== obj.id); // Ramming removes enemy
                    } else if (obj.type) { // It's a powerup
                        nextState.powerUps = nextState.powerUps.filter(p => p.id !== obj.id);
                        nextState.activePowerUp = obj.type as PowerUpType;
                        nextState.powerUpTimer = 10; // 10 seconds
                        if (obj.type === 'SHIELD') {
                            nextState.player = { ...nextState.player, shield: true };
                        }
                    }
                }
            }
            
            if (playerHit) {
                if (nextState.player.shield) {
                    nextState.player = { ...nextState.player, shield: false };
                    nextState.activePowerUp = null;
                } else {
                    nextState.lives -= 1;
                }
            }
            
            // --- Cleanup & State Transitions ---
            nextState.enemies = nextState.enemies.filter(e => e.y < GAME_HEIGHT + 100); // Allow enemies to be visible longer
            nextState.powerUps = nextState.powerUps.filter(p => p.y < GAME_HEIGHT);

            // Check for level completion when all enemies are destroyed
            if (nextState.enemies.length === 0 && nextState.enemyQueue.length === 0 && !nextState.bossSpawned) {
                nextState.status = nextState.level >= MAX_LEVELS ? 'YOU_WIN' : 'LEVEL_COMPLETE';
            }

            if (nextState.lives <= 0) {
                nextState.status = 'GAME_OVER';
            }
            
            // Boss spawn logic - only on specific levels with proper difficulty scaling
            const bossLevels = [3, 5, 7, 10]; // Boss appears on levels 3, 5, 7, and 10
            const isBossLevel = bossLevels.includes(nextState.level);
            const scoreThreshold = isBossLevel ? (nextState.level * 800) : (nextState.level * 600);
            
            if (nextState.score >= scoreThreshold && !nextState.bossSpawned && isBossLevel) {
                nextState.bossSpawned = true;
                nextState.enemyQueue = []; // Clear the queue to stop other enemies
                
                // Boss difficulty increases with level
                const bossHealth = 150 + (nextState.level * 50);
                const bossSize = 100 + (nextState.level * 10);
                
                nextState.enemies.push({
                    id: Date.now() - 1, 
                    x: GAME_WIDTH / 2 - bossSize / 2, 
                    y: -100,
                    width: bossSize, 
                    height: bossSize / 2, 
                    type: 'boss',
                    hp: bossHealth, 
                    direction: 1,
                    bossState: 'ENTERING', 
                    attackTimer: 0
                });
            }

            return nextState;
        }
        default: return state;
    }
};

// --- 5. UI & GAME COMPONENTS ---

const PlayerShip = React.memo(({ player }: { player: Player }) => (
    <g transform={`translate(${player.x}, ${player.y})`}>
        <path d={`M${PLAYER_WIDTH / 2},0 L${PLAYER_WIDTH},${PLAYER_HEIGHT} L0,${PLAYER_HEIGHT} Z`} fill={COLORS.PLAYER_SHIP} />
        {player.shield && (
            <circle cx={PLAYER_WIDTH / 2} cy={PLAYER_HEIGHT / 2} r={PLAYER_WIDTH / 1.5} fill="rgba(0, 255, 221, 0.3)" stroke={COLORS.PLAYER_SHIP} strokeWidth="2" />
        )}
    </g>
));
PlayerShip.displayName = 'PlayerShip';

const BulletComponent = React.memo(({ bullet, color }: { bullet: Bullet, color: string }) => (
    <rect x={bullet.x} y={bullet.y} width={BULLET_WIDTH} height={BULLET_HEIGHT} fill={color} rx="2" />
));
BulletComponent.displayName = 'BulletComponent';

const EnemyShip = React.memo(({ enemy }: { enemy: Enemy }) => {
    const color = enemy.type === 'boss' ? '#FFD700' : COLORS.ENEMY_STANDARD;
    
    if (enemy.type === 'boss') {
        const healthPercentage = enemy.hp / (100 * (useContext(GameContext)!.state.level || 1));
        return (
            <g transform={`translate(${enemy.x}, ${enemy.y})`}>
                <path d={`M0,10 L${enemy.width / 2},0 L${enemy.width},10 L${enemy.width * 0.8},${enemy.height} L${enemy.width * 0.2},${enemy.height} Z`} fill={color} />
                 {/* Health Bar */}
                <rect x="0" y={enemy.height + 5} width={enemy.width} height="8" fill="#555" />
                <rect x="0" y={enemy.height + 5} width={enemy.width * healthPercentage} height="8" fill="#FF3864" />
            </g>
        );
    }

    return <rect x={enemy.x} y={enemy.y} width={enemy.width} height={enemy.height} fill={color} />;
});
EnemyShip.displayName = 'EnemyShip';

const PowerUpItem = React.memo(({ powerUp }: { powerUp: PowerUp }) => {
    const icon = {
        RAPID_FIRE: <Zap size={12} />,
        SPREAD_SHOT: <ChevronsUp size={12} />,
        SHIELD: <Shield size={12} />,
    }[powerUp.type];

    return (
        <g transform={`translate(${powerUp.x}, ${powerUp.y})`}>
            <circle cx="10" cy="10" r="12" fill={COLORS.POWER_UP} />
            <text x="10" y="14" textAnchor="middle" fill="black">
                {icon}
            </text>
        </g>
    );
});
PowerUpItem.displayName = 'PowerUpItem';

const StatsSidebar: React.FC = () => {
    const { state } = useContext(GameContext)!;
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('voidVanguardHighScore');
        if (stored) setHighScore(parseInt(stored, 10));
    }, []);

    useEffect(() => {
        if (state.score > highScore) {
            setHighScore(state.score);
            localStorage.setItem('voidVanguardHighScore', state.score.toString());
        }
    }, [state.score, highScore]);

    return (
        <Card className="bg-gray-800 border-2 border-yellow-300 shadow-[4px_4px_0px_#FBC02D]">
            <CardHeader className="pb-2"><CardTitle className="text-yellow-300 text-sm">SCORE BOARD</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                    <div className="text-3xl font-bold text-white">{state.score}</div>
                    <div className="text-xs text-yellow-400/80">SCORE</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                        <div className="text-lg text-red-500">{'♥ '.repeat(Math.max(0, state.lives))}</div>
                        <div className="text-xs text-gray-400">LIVES</div>
                    </div>
                    <div>
                        <div className="text-lg text-green-400">{highScore}</div>
                        <div className="text-xs text-gray-400">BEST</div>
                    </div>
                </div>
                <div className="text-center pt-2 border-t border-yellow-300/20">
                    <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">LEVEL {state.level}</Badge>
                    <div className="mt-2 text-xs text-gray-400">
                        Progress: {state.level} / {MAX_LEVELS}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                        <div 
                            className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${(state.level / MAX_LEVELS) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {state.activePowerUp && (
                    <div className="text-center pt-2 border-t border-green-400/20">
                        <Badge variant="outline" className="text-green-400 border-green-400/50 animate-pulse">{state.activePowerUp.replace('_', ' ')}</Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const GameOverlay: React.FC<{ title: string; buttonText: string; onButtonClick: () => void; children?: React.ReactNode }> = ({ title, buttonText, onButtonClick, children }) => (
    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center z-10">
        <h2 className="text-4xl text-yellow-300 mb-4">{title}</h2>
        {children}
        <Button onClick={onButtonClick} className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900">
            <Play className="mr-2 h-4 w-4" /> {buttonText}
        </Button>
    </div>
);

const StartScreen = ({ onStart }: { onStart: () => void }) => (
    <GameOverlay title="VOID VANGUARD" buttonText="Start Game" onButtonClick={onStart}>
        <p className="text-gray-300 max-w-sm">Use Arrow Keys or A/D to move. Press Spacebar to shoot. Destroy all enemies to advance.</p>
    </GameOverlay>
);

const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
    <GameOverlay title="GAME OVER" buttonText="Try Again" onButtonClick={onRestart}>
        <p className="text-2xl text-white">Final Score: {score}</p>
    </GameOverlay>
);

const getLevelDescription = (level: number): string => {
    if (level <= 3) return "Basic Formation - Learn the basics";
    if (level <= 6) return "Staggered Enemies - More challenging patterns";
    if (level <= 9) return "Diamond Formation - Advanced tactics required";
    if (level === 10) return "Final Challenge - Ultimate test of skill";
    return "Unknown Level";
};

const LevelCompleteScreen = ({ level, onNext }: { level: number; onNext: () => void }) => (
    <GameOverlay title={`LEVEL ${level} CLEARED`} buttonText={`Start Level ${level + 1}`} onButtonClick={onNext}>
        <div className="text-center space-y-4">
            <p className="text-xl text-green-400">Level Bonus: +{(level + 1) * 100}!</p>
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-lg text-blue-400 mb-2">Progress: {level} / {MAX_LEVELS}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(level / MAX_LEVELS) * 100}%` }}
                    ></div>
                </div>
            </div>
            {level < MAX_LEVELS ? (
                <div>
                    <p className="text-sm text-gray-400 mb-2">Ready for the next challenge?</p>
                    <p className="text-xs text-purple-400">{getLevelDescription(level + 1)}</p>
                </div>
            ) : (
                <p className="text-lg text-yellow-400 font-bold">Final level completed!</p>
            )}
        </div>
    </GameOverlay>
);


const GameCanvas: React.FC = () => {
    const { state, dispatch } = useContext(GameContext)!;
    const keysPressed = useKeyboardInput();
    const quadtree = useRef(new Quadtree({ x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT })).current;
    const isMobile = useIsMobile();
    const [mobileMove, setMobileMove] = useState<'left' | 'right' | null>(null);
    const [mobileShoot, setMobileShoot] = useState(false);

    // Add mobile controls to the keys pressed
    useEffect(() => {
        if (mobileMove === 'left') {
            keysPressed.current.add('arrowleft');
        } else {
            keysPressed.current.delete('arrowleft');
        }
        if (mobileMove === 'right') {
            keysPressed.current.add('arrowright');
        } else {
            keysPressed.current.delete('arrowright');
        }
        if (mobileShoot) {
            keysPressed.current.add(' ');
        } else {
            keysPressed.current.delete(' ');
        }
    }, [mobileMove, mobileShoot, keysPressed]);

    useGameLoop(useCallback((dt: number) => {
        dispatch({ type: 'GAME_TICK', payload: { dt, keys: keysPressed.current, quadtree } });
    }, [dispatch, quadtree, keysPressed]), state.status === 'PLAYING');

    return (
        <div className="relative w-full" style={{ aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`, minHeight: '500px', maxHeight: '70vh' }}>
            <svg viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`} className="w-full h-full bg-gray-900 border-4 border-yellow-300" preserveAspectRatio="xMidYMid meet">
                <rect width={GAME_WIDTH} height={GAME_HEIGHT} fill={COLORS.BACKGROUND} />
                {(state.status === 'PLAYING' || state.status === 'GAME_OVER' || state.status === 'LEVEL_COMPLETE' || state.status === 'YOU_WIN') && (
                    <>
                        <PlayerShip player={state.player} />
                        {state.playerBullets.filter(b => b.active).map(b => <BulletComponent key={`p-${b.id}`} bullet={b} color={COLORS.PLAYER_BULLET} />)}
                        {state.enemyBullets.filter(b => b.active).map(b => <BulletComponent key={`e-${b.id}`} bullet={b} color={COLORS.ENEMY_BULLET} />)}
                        {state.enemies.map(e => <EnemyShip key={e.id} enemy={e} />)}
                        {state.powerUps.map(p => <PowerUpItem key={p.id} powerUp={p} />)}
                        
                        {/* Debug Info */}
                        <text x="10" y="30" fill="white" fontSize="12" fontFamily="monospace">
                            Enemies: {state.enemies.length} | Queue: {state.enemyQueue.length} | Timer: {state.enemySpawnTimer.toFixed(1)}
                        </text>
                    </>
                )}
            </svg>
            {state.status === 'START_SCREEN' && <StartScreen onStart={() => dispatch({ type: 'START_GAME' })} />}
            {state.status === 'GAME_OVER' && <GameOverScreen score={state.score} onRestart={() => dispatch({ type: 'RESET_GAME' })} />}
            {state.status === 'LEVEL_COMPLETE' && <LevelCompleteScreen level={state.level} onNext={() => dispatch({ type: 'NEXT_LEVEL' })} />}
            {state.status === 'YOU_WIN' && <YouWinScreen onRestart={() => dispatch({ type: 'RESET_GAME' })} />}
            
            {/* Mobile Controls */}
            {isMobile && state.status === 'PLAYING' && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                    {/* Movement Controls */}
                    <div className="flex gap-2">
                        <Button
                            onTouchStart={() => setMobileMove('left')}
                            onTouchEnd={() => setMobileMove(null)}
                            onMouseDown={() => setMobileMove('left')}
                            onMouseUp={() => setMobileMove(null)}
                            className="select-none bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 active:from-yellow-600 active:to-yellow-700 text-black font-bold w-16 h-16 border-2 border-yellow-200 shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center"
                            style={{ 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
                            }}
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <Button
                            onTouchStart={() => setMobileMove('right')}
                            onTouchEnd={() => setMobileMove(null)}
                            onMouseDown={() => setMobileMove('right')}
                            onMouseUp={() => setMobileMove(null)}
                            className="select-none bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 active:from-yellow-600 active:to-yellow-700 text-black font-bold w-16 h-16 border-2 border-yellow-200 shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center"
                            style={{ 
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
                            }}
                        >
                            <ArrowRight size={24} />
                        </Button>
                    </div>
                    
                    {/* Shoot Control */}
                    <Button
                        onTouchStart={() => setMobileShoot(true)}
                        onTouchEnd={() => setMobileShoot(false)}
                        onMouseDown={() => setMobileShoot(true)}
                        onMouseUp={() => setMobileShoot(false)}
                        className="select-none bg-gradient-to-b from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 active:from-red-600 active:to-red-700 text-white font-bold w-20 h-16 border-2 border-red-200 shadow-lg active:scale-95 transition-all duration-150 flex items-center justify-center"
                        style={{ 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                    >
                        <span className="drop-shadow-sm text-sm">FIRE</span>
                    </Button>
                </div>
            )}
        </div>
    );
};

// --- 6. HOOKS & MAIN COMPONENT ---
const useKeyboardInput = () => {
    const keysPressed = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === ' ' || key.startsWith('arrow')) e.preventDefault();
            keysPressed.current.add(key);
        };
        const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keysPressed;
};

const VoidVanguardGame = () => {
    const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
    const isMobile = useIsMobile();
    const [mobileMove, setMobileMove] = useState<'left' | 'right' | null>(null);
    const [mobileShoot, setMobileShoot] = useState(false);
    
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card className="bg-gray-800 border-2 border-green-400 shadow-[8px_8px_0px_#2E7D32]">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
                                <div className="flex gap-2">
                                    {state.status === 'START_SCREEN' || state.status === 'GAME_OVER' || state.status === 'YOU_WIN' ? (
                                        <Button onClick={() => dispatch({ type: 'START_GAME' })} className="bg-yellow-400 text-black hover:bg-yellow-300">
                                            <Play className="w-4 h-4 mr-2" /> PLAY
                                        </Button>
                                    ) : (
                                        <Button onClick={() => dispatch({ type: 'RESET_GAME' })} className="bg-red-600 text-white hover:bg-red-700">
                                            <RotateCcw className="w-4 h-4 mr-2" /> QUIT
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center p-2">
                            <GameCanvas />
                        </CardContent>
                    </Card>
                </div>
                <aside className="space-y-4">
                    <StatsSidebar />
                    
                    <Card className="bg-gray-800 border-2 border-blue-400">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-400 text-sm">CONTROLS</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                                <div className="text-lg font-bold text-white">ARROW KEYS</div>
                                <div className="text-xs text-blue-400/80">TO MOVE</div>
                            </div>
                            <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                                <div className="text-lg font-bold text-white">SPACEBAR</div>
                                <div className="text-xs text-blue-400/80">TO SHOOT</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-2 border-green-400">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-green-400 text-sm">GAME INFO</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                                <div className="text-sm text-gray-300 mb-1">Standard Enemy = 50 pts</div>
                                <div className="text-xs text-green-400">Boss Enemy = 1000 pts</div>
                            </div>
                            <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                                <div className="text-sm text-gray-300 mb-1">Power-ups boost abilities</div>
                                <div className="text-xs text-blue-400">Survive enemy waves!</div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </GameContext.Provider>
    );
};

export default function VoidVanguard() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: FONT_FAMILY }}>
            <header className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">VOID VANGUARD</h1>
                <p className="text-sm text-green-400">A RETRO SPACE SHOOTER</p>
            </header>

            <VoidVanguardGame />

            {/* Game Description */}
            <div className="w-full mt-6">
                <Card className="bg-gray-800 border-2 border-yellow-400">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <p className="text-sm sm:text-base lg:text-lg text-gray-300 text-center leading-relaxed max-w-none">
                            Defend the galaxy as the ultimate Void Vanguard in this intense retro space shooter! 
                            Pilot your advanced starfighter through waves of alien invaders, each with unique attack patterns 
                            and behaviors. Collect powerful power-ups including rapid fire, spread shots, and protective shields 
                            to enhance your combat abilities. Face massive boss enemies that require strategy and skill to defeat. 
                            The action intensifies as enemy formations become more complex and aggressive. Use precise movement 
                            and well-timed shots to survive increasingly challenging waves. Every enemy destroyed earns points, 
                            but survival is your primary mission. Can you become the legendary Void Vanguard?
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
