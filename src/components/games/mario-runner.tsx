'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarioRunnerEngine, PlayerState, ObjectType, GameObject, Player } from '@/lib/mario-runner-engine';
import AdPlaceholder from '@/components/ad-placeholder';
import { RotateCcw, Play } from 'lucide-react';

const MarioRunner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MarioRunnerEngine | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<{
    score: number;
    bestScore: number;
    health: number;
    state: PlayerState;
    showInstructions: boolean;
    gameOver: boolean;
    debugInfo?: any;
  }>({
    score: 0,
    bestScore: 0,
    health: 3,
    state: PlayerState.Running,
    showInstructions: true,
    gameOver: false,
    debugInfo: {},
  });

  useEffect(() => {
    const savedBestScore = localStorage.getItem('mario-runner-best-score');
    if (savedBestScore) {
      setGameState(prev => ({ ...prev, bestScore: parseInt(savedBestScore, 10) }));
    }
  }, []);

  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      setGameState(prev => ({ ...prev, bestScore: prev.score }));
      localStorage.setItem('mario-runner-best-score', gameState.score.toString());
    }
  }, [gameState.score, gameState.bestScore]);

  useEffect(() => {
    engineRef.current = new MarioRunnerEngine();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderGameObjects = useCallback((ctx: CanvasRenderingContext2D, objects: GameObject[], camera: { x: number; y: number }) => {
    objects.forEach(obj => {
      const screenX = obj.position.x - camera.x;
      const screenY = obj.position.y - camera.y;
      
      if (screenX + obj.bounds.width < 0 || screenX > 800) return;
      if (screenY + obj.bounds.height < 0 || screenY > 600) return;
      
      ctx.save();
      switch (obj.type) {
        case ObjectType.Platform:
          ctx.fillStyle = '#D2691E';
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 4;
          ctx.fillRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          ctx.strokeRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          break;
        case ObjectType.Enemy:
          ctx.fillStyle = '#8B0000';
          ctx.fillRect(screenX, screenY, obj.bounds.width, obj.bounds.height);
          break;
        case ObjectType.Coin:
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(screenX + obj.bounds.width / 2, screenY + obj.bounds.height / 2, obj.bounds.width / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      ctx.restore();
    });
  }, []);

  const renderPlayer = useCallback((ctx: CanvasRenderingContext2D, player: Player, camera: { x: number; y: number }) => {
    const screenX = player.position.x - camera.x;
    const screenY = player.position.y - camera.y;
    
    ctx.save();
    if (player.invulnerable > 0) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.05) * 0.5;
    }

    const skin = '#FFDBAC';
    const red = player.state === PlayerState.Hurt ? '#FF6B6B' : '#FF0000';
    const blue = '#0066CC';
    const brown = '#8B4513';
    const white = '#FFFFFF';
    const black = '#000000';

    ctx.fillStyle = skin;
    ctx.fillRect(screenX + 6, screenY, 20, 16);
    ctx.fillStyle = red;
    ctx.fillRect(screenX + 4, screenY, 24, 8);
    ctx.fillStyle = white;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('M', screenX + 16, screenY + 7);
    ctx.fillStyle = black;
    ctx.fillRect(screenX + 10, screenY + 6, 2, 2);
    ctx.fillRect(screenX + 18, screenY + 6, 2, 2);
    ctx.fillStyle = brown;
    ctx.fillRect(screenX + 8, screenY + 10, 16, 3);
    ctx.fillStyle = red;
    ctx.fillRect(screenX + 8, screenY + 16, 16, 16);
    ctx.fillStyle = blue;
    ctx.fillRect(screenX + 4, screenY + 24, 24, 12);
    ctx.fillStyle = brown;
    ctx.fillRect(screenX + 2, screenY + 44, 10, 4);
    ctx.fillRect(screenX + 20, screenY + 44, 10, 4);

    const time = Date.now();
    if (player.state === PlayerState.Running) {
      const runFrame = Math.floor(time / 150) % 4;
      const legOffset = [0, 2, 0, -2][runFrame];
      ctx.fillStyle = blue;
      ctx.fillRect(screenX + 6, screenY + 36, 8, 8 + legOffset);
      ctx.fillRect(screenX + 18, screenY + 36, 8, 8 - legOffset);
      ctx.fillStyle = skin;
      const armOffset = [2, 0, -2, 0][runFrame];
      ctx.fillRect(screenX, screenY + 18, 8, 4 + armOffset);
      ctx.fillRect(screenX + 24, screenY + 18, 8, 4 - armOffset);
    } else {
      ctx.fillStyle = blue;
      ctx.fillRect(screenX + 6, screenY + 36, 8, 8);
      ctx.fillRect(screenX + 18, screenY + 36, 8, 8);
      ctx.fillStyle = skin;
      ctx.fillRect(screenX, screenY + 16, 8, 4);
      ctx.fillRect(screenX + 24, screenY + 16, 8, 4);

      if (player.state === PlayerState.DoubleJumping) {
        ctx.translate(screenX + 16, screenY + 24);
        ctx.rotate((time * 0.02) % (Math.PI * 2));
        ctx.translate(-(screenX + 16), -(screenY + 24));
      }
    }
    
    ctx.restore();
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const player = engine.getPlayer();
    const objects = engine.getActiveObjects();
    const camera = engine.getCamera();
    
    renderGameObjects(ctx, objects, camera);
    renderPlayer(ctx, player, camera);
    
    setGameState(prev => ({
      ...prev,
      score: player.score,
      health: player.health,
      state: player.state,
      gameOver: !engine.isGameRunning(),
      debugInfo: engine.getDebugInfo(),
    }));
    
  }, [renderGameObjects, renderPlayer]);

  const gameLoop = useCallback((currentTime: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    
    engine.update(currentTime);
    render();
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [render]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (gameState.showInstructions) startGame();
        else engineRef.current?.pressJump();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        engineRef.current?.releaseJump();
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        if (gameState.showInstructions) startGame();
        else engineRef.current?.pressJump();
    };
    const handleMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        engineRef.current?.releaseJump();
    };
    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        if (gameState.showInstructions) startGame();
        else engineRef.current?.pressJump();
    };
    const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        engineRef.current?.releaseJump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState.showInstructions]);

  const startGame = () => {
    if (!engineRef.current) return;
    
    setGameState(prev => ({ ...prev, showInstructions: false, gameOver: false, score: 0, health: 3 }));
    engineRef.current.resetGame();
    engineRef.current.startGame();
    
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const resetGame = () => {
    if (!engineRef.current) return;
    
    engineRef.current.resetGame();
    setGameState(prev => ({
      ...prev,
      score: 0,
      health: 3,
      state: PlayerState.Running,
      showInstructions: true,
      gameOver: false,
    }));
    
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-red-400 mb-2">MARIO RUNNER</h1>
        <p className="text-sm text-yellow-400">A RETRO RUNNING ADVENTURE</p>
      </header>
      
      <div className="mb-6">
        <AdPlaceholder />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-red-400 shadow-[8px_8px_0px_#8B0000]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-red-400">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={resetGame} className="bg-red-600 text-white hover:bg-red-700">
                    <RotateCcw className="w-4 h-4 mr-2" /> RESTART
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border-4 border-red-300 bg-gray-900"
                  style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
                />
                
                {gameState.showInstructions && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-4 font-bold text-red-400">MARIO RUNNER</h3>
                    <p className="text-sm mb-2 text-gray-300">PRESS & HOLD SPACE/TAP TO JUMP HIGHER</p>
                    <p className="text-xs text-gray-400 mb-4">TAP AGAIN IN AIR FOR A DOUBLE JUMP!</p>
                    <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      START GAME
                    </Button>
                  </div>
                )}
                
                {gameState.gameOver && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-2xl mb-2 font-bold text-red-500">GAME OVER</h3>
                    <p className="text-lg mb-2 text-gray-200">FINAL SCORE: {gameState.score}</p>
                    <p className="text-sm mb-4 text-yellow-400">
                      {gameState.score > 0 && gameState.score === gameState.bestScore ? 'NEW HIGH SCORE!' : `BEST: ${gameState.bestScore}`}
                    </p>
                    <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      PLAY AGAIN
                    </Button>
                  </div>
                )}

                {/* Debug Overlay */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded-md font-mono">
                  <p>State: {gameState.debugInfo?.playerState}</p>
                  <p>Grounded: {gameState.debugInfo?.grounded ? 'True' : 'False'}</p>
                  <p>Velocity Y: {gameState.debugInfo?.velocity?.y?.toFixed(2)}</p>
                  <p>Jump Count: {gameState.debugInfo?.jumpCount}</p>
                  <p>Last Jump Press: {gameState.debugInfo?.lastJumpPressedTime}</p>
                  <p>Last Grounded: {gameState.debugInfo?.lastGroundedTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="bg-gray-800 border-2 border-red-300 shadow-[4px_4px_0px_#8B0000]">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-300 text-sm">SCORE BOARD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-white">{gameState.score}</div>
                <div className="text-xs text-red-400/80">SCORE</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-yellow-300">{gameState.bestScore}</div>
                <div className="text-xs text-yellow-400/80">BEST</div>
              </div>
              <div className="text-center pt-2 border-t border-red-300/20">
                <div className="text-lg text-red-500">{'❤️'.repeat(Math.max(0, gameState.health))}</div>
                <div className="text-xs text-gray-400">LIVES</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-yellow-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-yellow-300 text-sm">CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">HOLD SPACE/TAP</div>
                <div className="text-xs text-yellow-400/80">FOR HIGHER JUMP</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-lg font-bold text-white">TAP AGAIN</div>
                <div className="text-xs text-yellow-400/80">FOR DOUBLE JUMP</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-2 border-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">GAME INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">Stomp on enemies!</div>
                <div className="text-xs text-green-400">+200 points</div>
              </div>
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-sm text-gray-300 mb-1">Collect coins!</div>
                <div className="text-xs text-blue-400">+100 points</div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      
      <footer className="mt-6">
        <AdPlaceholder />
      </footer>
    </div>
  );
};

export default MarioRunner;