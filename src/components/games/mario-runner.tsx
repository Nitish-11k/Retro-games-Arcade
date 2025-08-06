'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarioRunnerEngine, PlayerState, ObjectType, GameObject, Player } from '@/lib/mario-runner-engine';

const MarioRunner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MarioRunnerEngine | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<{
    score: number;
    health: number;
    state: PlayerState;
    showInstructions: boolean;
    gameOver: boolean;
    debugInfo?: any;
  }>({
    score: 0,
    health: 3,
    state: PlayerState.Running,
    showInstructions: true,
    gameOver: false
  });

  // Initialize game engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new MarioRunnerEngine();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Render game objects
  const renderGameObjects = useCallback((ctx: CanvasRenderingContext2D, objects: GameObject[], camera: { x: number; y: number }) => {
    objects.forEach(obj => {
      const screenX = obj.position.x - camera.x;
      const screenY = obj.position.y - camera.y;
      
      // Only render objects that are on screen
      if (screenX + obj.bounds.width < 0 || screenX > ctx.canvas.width) return;
      
      ctx.save();
      
      switch (obj.type) {
        case ObjectType.Platform:
          ctx.fillStyle = obj.properties?.isGround ? '#8B4513' : '#654321';
          ctx.strokeStyle = '#4A4A4A';
          ctx.lineWidth = 2;
          ctx.fillRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          ctx.strokeRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          
          // Add some texture to platforms
          ctx.fillStyle = '#A0522D';
          for (let x = 0; x < obj.bounds.width; x += 16) {
            for (let y = 0; y < obj.bounds.height; y += 16) {
              if ((x + y) % 32 === 0) {
                ctx.fillRect(screenX + x, screenY + y, 4, 4);
              }
            }
          }
          break;
          
        case ObjectType.Enemy:
          // Draw Goomba-like enemy
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          
          // Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(screenX + 4, screenY + 4, 4, 4);
          ctx.fillRect(screenX + 16, screenY + 4, 4, 4);
          
          // Pupils
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 6, screenY + 6, 2, 2);
          ctx.fillRect(screenX + 18, screenY + 6, 2, 2);
          
          // Frown
          ctx.fillStyle = '#000000';
          ctx.fillRect(screenX + 8, screenY + 16, 8, 2);
          break;
          
        case ObjectType.Coin:
          // Animated spinning coin
          const time = Date.now() * 0.01;
          const scale = Math.abs(Math.sin(time)) * 0.5 + 0.5;
          
          ctx.fillStyle = '#FFD700';
          ctx.strokeStyle = '#FFA500';
          ctx.lineWidth = 2;
          
          const coinSize = obj.bounds.width * scale;
          const offsetX = (obj.bounds.width - coinSize) / 2;
          
          ctx.fillRect(screenX + offsetX, screenY, coinSize, obj.bounds.height);
          ctx.strokeRect(screenX + offsetX, screenY, coinSize, obj.bounds.height);
          
          // Coin symbol
          ctx.fillStyle = '#FF8C00';
          ctx.font = `${obj.bounds.height * 0.6}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('$', screenX + obj.bounds.width / 2, screenY + obj.bounds.height * 0.8);
          break;
      }
      
      ctx.restore();
    });
  }, []);

  // Render Mario player
  const renderPlayer = useCallback((ctx: CanvasRenderingContext2D, player: Player, camera: { x: number; y: number }) => {
    const screenX = player.position.x - camera.x;
    const screenY = player.position.y - camera.y;
    
    ctx.save();
    
    // Invulnerability flashing effect
    if (player.invulnerable > 0) {
      ctx.globalAlpha = Math.abs(Math.sin(Date.now() * 0.02)) * 0.5 + 0.5;
    }
    
    // Mario body (red shirt)
    ctx.fillStyle = player.state === PlayerState.Hurt ? '#FF6B6B' : '#FF0000';
    ctx.fillRect(screenX + 8, screenY + 12, 16, 12);
    
    // Mario overalls (blue)
    ctx.fillStyle = '#0066CC';
    ctx.fillRect(screenX + 4, screenY + 20, 24, 12);
    
    // Mario head (skin tone)
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(screenX + 6, screenY, 20, 16);
    
    // Mario hat
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(screenX + 4, screenY, 24, 8);
    
    // Hat emblem (M)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('M', screenX + 16, screenY + 7);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(screenX + 10, screenY + 6, 2, 2);
    ctx.fillRect(screenX + 18, screenY + 6, 2, 2);
    
    // Mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(screenX + 8, screenY + 10, 16, 3);
    
    // Shoes
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(screenX + 2, screenY + 28, 10, 4);
    ctx.fillRect(screenX + 20, screenY + 28, 10, 4);
    
    // Animation based on state
    if (player.state === PlayerState.Jumping || player.state === PlayerState.Falling) {
      // Arms up when jumping
      ctx.fillStyle = '#FFDBAC';
      ctx.fillRect(screenX, screenY + 8, 4, 8);
      ctx.fillRect(screenX + 28, screenY + 8, 4, 8);
    } else {
      // Running animation
      const runCycle = Math.floor(Date.now() * 0.02) % 2;
      ctx.fillStyle = '#FFDBAC';
      if (runCycle === 0) {
        ctx.fillRect(screenX + 2, screenY + 16, 4, 8);
        ctx.fillRect(screenX + 26, screenY + 16, 4, 8);
      } else {
        ctx.fillRect(screenX - 2, screenY + 16, 4, 8);
        ctx.fillRect(screenX + 30, screenY + 16, 4, 8);
      }
    }
    
    ctx.restore();
  }, []);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 + Date.now() * 0.02) % (canvas.width + 100) - 50;
      ctx.fillRect(x, 50 + i * 30, 60, 20);
      ctx.fillRect(x + 20, 40 + i * 30, 60, 20);
      ctx.fillRect(x + 40, 50 + i * 30, 60, 20);
    }
    
    const player = engine.getPlayer();
    const objects = engine.getActiveObjects();
    const camera = engine.getCamera();
    
    // Render game objects
    renderGameObjects(ctx, objects, camera);
    
    // Render player
    renderPlayer(ctx, player, camera);
    
    // Update game state for UI
    setGameState(prev => ({
      ...prev,
      score: player.score,
      health: player.health,
      state: player.state,
      gameOver: !engine.isGameRunning() || player.state === PlayerState.Dead,
      debugInfo: engine.getDebugInfo()
    }));
    
  }, [renderGameObjects, renderPlayer]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    
    engine.update(currentTime);
    render();
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [render]);

  // Handle input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (gameState.showInstructions) {
          startGame();
        } else if (engineRef.current) {
          engineRef.current.jump();
        }
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (gameState.showInstructions) {
        startGame();
      } else if (engineRef.current) {
        engineRef.current.jump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouch);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, [gameState.showInstructions]);

  const startGame = () => {
    if (!engineRef.current) return;
    
    setGameState(prev => ({ ...prev, showInstructions: false, gameOver: false }));
    engineRef.current.startGame();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const resetGame = () => {
    if (!engineRef.current) return;
    
    engineRef.current.resetGame();
    setGameState({
      score: 0,
      health: 3,
      state: PlayerState.Running,
      showInstructions: true,
      gameOver: false
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden border-2 border-red-500">
      {/* Game Header */}
      <div className="w-full bg-gradient-to-r from-red-800 to-red-600 p-4 border-b-2 border-red-400">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white font-mono">MARIO RUNNER</h2>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < gameState.health
                      ? 'bg-red-500 border-red-300'
                      : 'bg-gray-700 border-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-300 font-mono text-lg">
              SCORE: {gameState.score.toString().padStart(6, '0')}
            </div>
            <div className="text-sm text-gray-300">
              State: {gameState.state.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block border-b-2 border-red-500"
          style={{ background: '#000' }}
        />
        
        {/* Instructions Overlay */}
        {gameState.showInstructions && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="text-center text-white p-8 bg-red-900 rounded-lg border-2 border-red-500">
              <h3 className="text-2xl font-bold mb-4 text-yellow-300 font-mono">MARIO RUNNER</h3>
              <div className="space-y-2 mb-6">
                <p className="text-lg">🎮 <strong>CONTROLS:</strong></p>
                <p>🖱️ <strong>SPACEBAR</strong> or <strong>CLICK/TAP</strong> to JUMP</p>
                <p>🏃 Mario runs automatically!</p>
                <p>🪙 Collect coins for points</p>
                <p>🍄 Stomp on enemies to defeat them</p>
                <p>❤️ Avoid obstacles and enemy collisions</p>
              </div>
              <Button 
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-lg font-mono"
              >
                ▶ START GAME
              </Button>
            </div>
          </div>
        )}
        
        {/* Game Over Overlay */}
        {gameState.gameOver && !gameState.showInstructions && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="text-center text-white p-8 bg-red-900 rounded-lg border-2 border-red-500">
              <h3 className="text-3xl font-bold mb-4 text-red-300 font-mono">GAME OVER!</h3>
              <div className="mb-6">
                <p className="text-xl text-yellow-300 font-mono">
                  Final Score: {gameState.score}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={resetGame}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 font-mono"
                >
                  🔄 PLAY AGAIN
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Footer with stats */}
      <div className="w-full bg-gradient-to-r from-red-800 to-red-600 p-3 border-t-2 border-red-400">
        <div className="flex justify-center gap-8 text-sm font-mono text-white">
          <Badge className="bg-blue-600 text-white">
            Active Objects: {gameState.debugInfo?.activeObjectsCount || 0}
          </Badge>
          <Badge className="bg-purple-600 text-white">
            Auto-Runner Engine
          </Badge>
          <Badge className="bg-green-600 text-white">
            60 FPS Physics
          </Badge>
          <Badge className="bg-yellow-600 text-white">
            Efficient DSA
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MarioRunner;
