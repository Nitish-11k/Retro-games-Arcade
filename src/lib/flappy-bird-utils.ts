import type { Game as GameType } from './types';

export const flappyBirdGame: GameType = {
  id: 'flappy-bird',
  title: 'Flappy Bird',
  description: 'A classic Flappy Bird game.',
  instructions: 'Press SPACEBAR to jump! Avoid the pipes and try to get a high score!',
  image: '/path/to/flappy-bird-image.png', // Replace with actual image path
  dataAiHint: 'Flappy Bird, a side-scrolling game where the player controls a bird, attempting to fly between columns of green pipes without hitting them.',
};

export class Bird {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: number;
    gravity: number;
    jumpStrength: number;
    rotation: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.velocity = 0;
        this.gravity = 0.4;
        this.jumpStrength = -6;
        this.rotation = 0;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = this.jumpStrength;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 5, 0);
        ctx.lineTo(this.width / 2 + 5, -2);
        ctx.lineTo(this.width / 2 + 5, 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

export class Pipe {
    x: number;
    width: number;
    gapY: number;
    gapSize: number;
    speed: number;
    passed: boolean;
    canvasHeight: number;

    constructor(x: number, gapY: number, gapSize: number, speed: number = 2) {
        this.x = x;
        this.width = 60;
        this.gapY = gapY;
        this.gapSize = gapSize;
        this.speed = speed;
        this.passed = false;
        this.canvasHeight = 600;
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, 0, this.width, this.gapY);
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - 5, this.gapY - 20, this.width + 10, 20);
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, this.gapY + this.gapSize, this.width, this.canvasHeight - (this.gapY + this.gapSize));
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x - 5, this.gapY + this.gapSize, this.width + 10, 20);
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, 0, this.width, this.gapY);
        ctx.strokeRect(this.x, this.gapY + this.gapSize, this.width, this.canvasHeight - (this.gapY + this.gapSize));
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    collidesWith(bird: Bird) {
        const birdBounds = bird.getBounds();
        if (birdBounds.x < this.x + this.width &&
            birdBounds.x + birdBounds.width > this.x) {
            if (birdBounds.y < this.gapY ||
                birdBounds.y + birdBounds.height > this.gapY + this.gapSize) {
                return true;
            }
        }
        return false;
    }

    hasPassedBird(bird: Bird) {
        if (!this.passed && this.x + this.width < bird.x) {
            this.passed = true;
            return true;
        }
        return false;
    }
}

export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    bird: Bird;
    pipes: Pipe[];
    score: number;
    gameState: 'playing' | 'gameOver';
    pipeSpawnTimer: number;
    pipeSpawnDelay: number;
    groundHeight: number;
    baseSpeed: number;
    speedIncrement: number;
    isRunning: boolean;
    animationFrameId: number | null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.bird = new Bird(80, this.height / 2);
        this.pipes = [];
        this.score = 0;
        this.gameState = 'playing';
        
        this.pipeSpawnTimer = 0;
        this.pipeSpawnDelay = 120;
        this.groundHeight = 50;
        
        // Speed progression system (adjusted for 10-point scoring)
        this.baseSpeed = 2;
        this.speedIncrement = 0.02; // Reduced since score increases by 10 each time
        
        this.isRunning = false;
        this.animationFrameId = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('click', this.handleClick);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.canvas.removeEventListener('click', this.handleClick);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            this.handleInput();
        }
    }

    handleClick = () => {
        this.handleInput();
    }

    handleInput = () => {
        if (this.gameState === 'playing') {
            this.bird.jump();
        } else if (this.gameState === 'gameOver') {
            this.restart();
        }
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.bird.update();

        if (this.bird.y + this.bird.height >= this.height - this.groundHeight) {
            this.gameOver();
            return;
        }

        this.pipeSpawnTimer++;
        if (this.pipeSpawnTimer >= this.pipeSpawnDelay) {
            this.spawnPipe();
            this.pipeSpawnTimer = 0;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update();

            if (pipe.collidesWith(this.bird)) {
                this.gameOver();
                return;
            }

            if (pipe.hasPassedBird(this.bird)) {
                this.score += 10; // 10 points per pipe
            }

            if (pipe.isOffScreen()) {
                this.pipes.splice(i, 1);
            }
        }
    }

    spawnPipe() {
        const minGapY = 100;
        const maxGapY = this.height - this.groundHeight - 150;
        const gapSize = 120;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        // Calculate current speed based on score (distance covered)
        const currentSpeed = this.baseSpeed + (this.score * this.speedIncrement);
        const finalSpeed = Math.min(currentSpeed, 8); // Cap maximum speed at 8
        
        const pipe = new Pipe(this.width, gapY, gapSize, finalSpeed);
        
        this.pipes.push(pipe);
    }

    draw() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.drawClouds();
        this.pipes.forEach(pipe => pipe.draw(this.ctx));
        this.bird.draw(this.ctx);
        this.drawGround();
        this.drawScore();

        if (this.gameState === 'gameOver') {
            this.drawGameOver();
        }
    }

    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const clouds = [
            { x: 50, y: 80, size: 30 },
            { x: 200, y: 60, size: 25 },
            { x: 320, y: 100, size: 35 }
        ];
        clouds.forEach(cloud => {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 20, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 35, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawGround() {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.height - this.groundHeight, this.width, this.groundHeight);
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.height - this.groundHeight, this.width, 10);
    }

    drawScore() {
        // Score and speed will be displayed in the sidebar, not on canvas
        // Only show score during game over
        if (this.gameState === 'gameOver') {
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'center';
            const text = this.score.toString();
            this.ctx.strokeText(text, this.width / 2, 60);
            this.ctx.fillText(text, this.width / 2, 60);
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.width / 2, this.height / 2 - 50);
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2);
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('Click or Press SPACE to restart', this.width / 2, this.height / 2 + 50);
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.isRunning = false;
    }

    restart() {
        this.bird = new Bird(80, this.height / 2);
        this.pipes = [];
        this.score = 0;
        this.gameState = 'playing';
        this.pipeSpawnTimer = 0;
        this.start();
    }

    start = () => {
        if (this.isRunning) return;
        this.isRunning = true;
        this.run();
    }

    run = () => {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(this.run);
    }

    stop = () => {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.removeEventListeners();
    }

    // Methods to get current game state for sidebar display
    getCurrentScore() {
        return this.score;
    }

    getCurrentSpeed() {
        const currentSpeed = this.baseSpeed + (this.score * this.speedIncrement);
        return Math.min(currentSpeed, 8);
    }

    getGameState() {
        return this.gameState;
    }
}