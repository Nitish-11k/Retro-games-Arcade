'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Crown,
  Lock,
  Zap,
  Target,
  Flame,
  Award,
  Medal,
} from 'lucide-react';
import { createAchievements, loadGameData, saveGameData, type Achievement } from '@/lib/pixel-slither-utils';

// --- CONSTANTS ---
const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Position = { x: 0, y: -1 };
const INITIAL_LIVES = 3;
const PRO_FEATURE_FLAG = false; 

const foodTypes = [
    { type: 'apple', color: 'bg-red-500', char: '🍎' },
    { type: 'cherry', color: 'bg-red-700', char: '🍒' },
    { type: 'grape', color: 'bg-purple-500', char: '🍇' },
];

const levels = [
  { id: 1, name: 'Slow Crawl', speed: 200, unlocked: true, pro: false },
  { id: 2, name: 'Steady Slither', speed: 150, unlocked: true, pro: false },
  { id: 3, name: 'Quick Strike', speed: 100, unlocked: true, pro: false },
  { id: 4, name: 'Lightning Fast', speed: 75, unlocked: PRO_FEATURE_FLAG, pro: true },
  { id: 5, name: 'Pixel Blur', speed: 50, unlocked: PRO_FEATURE_FLAG, pro: true },
  { id: 6, name: 'Impossible', speed: 25, unlocked: PRO_FEATURE_FLAG, pro: true },
];

// --- INTERFACES ---
interface Position {
  x: number;
  y: number;
}

interface Food extends Position {
  type: string;
  color: string;
  char: string;
}

type WallBehavior = 'solid' | 'wrap';

interface GameState {
  snake: Position[];
  food: Food;
  direction: Position;
  speed: number;
  score: number;
  lives: number;
  level: number;
  gameStarted: boolean;
  gameRunning: boolean;
  gameOver: boolean;
  isPaused: boolean;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  date: string;
}

// --- HELPER FUNCTIONS ---
const generateFood = (snake: Position[]): Food => {
  let newFoodPosition: Position;
  const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

  return { ...newFoodPosition, ...foodType };
};


// --- REACT COMPONENT ---
const PixelSlither: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState(2);
  const [wallBehavior, setWallBehavior] = useState<WallBehavior>('wrap');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getInitialState = useCallback((): GameState => {
    const levelConfig = levels.find(l => l.id === selectedLevel) || levels[1];
    return {
      snake: INITIAL_SNAKE,
      food: isClient ? generateFood(INITIAL_SNAKE) : { x: 15, y: 10, ...foodTypes[0] },
      direction: INITIAL_DIRECTION,
      speed: levelConfig.speed,
      score: 0,
      lives: INITIAL_LIVES,
      level: levelConfig.id,
      gameStarted: false,
      gameRunning: false,
      gameOver: false,
      isPaused: false,
    };
  }, [selectedLevel, isClient]);

  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [touchStart, setTouchStart] = useState<Position | null>(null);
  const [gameData, setGameData] = useState<{
    highScore: number;
    achievements: Achievement[];
    leaderboard: LeaderboardEntry[];
    totalGames: number;
    totalScore: number;
  }>(() => ({
    highScore: 0,
    achievements: [],
    leaderboard: [],
    totalGames: 0,
    totalScore: 0,
  }));

  const latestGameState = useRef<GameState>(gameState);
  latestGameState.current = gameState;

  useEffect(() => {
    if (isClient) {
      const clientGameData = loadGameData();
      setGameData(clientGameData);
    }
  }, [isClient]);

  useEffect(() => {
    if (!gameState.gameStarted && isClient) {
      setGameState(getInitialState());
    }
  }, [getInitialState, gameState.gameStarted, isClient]);

  const achievements = createAchievements(gameData);
  const iconMap = { Target, Star, Award, Medal, Crown, Trophy, Flame, Zap };
  type IconName = keyof typeof iconMap;

  const handleGameOver = useCallback(() => {
    setGameData(prevData => {
      const currentScore = latestGameState.current.score;
      const currentLevel = latestGameState.current.level;
      const newGameData = {
        ...prevData,
        totalGames: prevData.totalGames + 1,
        totalScore: prevData.totalScore + currentScore,
        highScore: Math.max(prevData.highScore, currentScore),
        leaderboard: [...prevData.leaderboard, {
          name: 'Player',
          score: currentScore,
          level: currentLevel,
          date: new Date().toLocaleDateString(),
        }].sort((a, b) => b.score - a.score).slice(0, 10),
      };
      saveGameData(newGameData);
      return newGameData;
    });
  }, []);

  useEffect(() => {
    const gameTick = () => {
      const { gameRunning, isPaused, gameOver } = latestGameState.current;
      if (!gameRunning || isPaused || gameOver) {
        return;
      }
      setGameState(prev => {
        const newSnake = [...prev.snake];
        const head = { ...newSnake[0] };
        head.x += prev.direction.x;
        head.y += prev.direction.y;
        let isWallCollision = false;
        if (wallBehavior === 'wrap') {
            if (head.x < 0) head.x = GRID_SIZE - 1;
            if (head.x >= GRID_SIZE) head.x = 0;
            if (head.y < 0) head.y = GRID_SIZE - 1;
            if (head.y >= GRID_SIZE) head.y = 0;
        } else {
            isWallCollision = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
        }
        const isSelfCollision = newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        if (isWallCollision || isSelfCollision) {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            handleGameOver();
            return { ...prev, lives: 0, gameRunning: false, gameOver: true };
          }
          return { ...prev, lives: newLives, snake: INITIAL_SNAKE, food: generateFood(INITIAL_SNAKE), direction: INITIAL_DIRECTION, gameRunning: false };
        }
        newSnake.unshift(head);
        if (head.x === prev.food.x && head.y === prev.food.y) {
          return { ...prev, snake: newSnake, food: generateFood(newSnake), score: prev.score + 10 };
        }
        newSnake.pop();
        return { ...prev, snake: newSnake };
      });
    };
    const timerId = setInterval(gameTick, gameState.speed);
    return () => clearInterval(timerId);
  }, [gameState.speed, wallBehavior, handleGameOver]);

  const togglePause = () => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameOver) return prev;
      const isNowPaused = !prev.isPaused;
      return { ...prev, isPaused: isNowPaused, gameRunning: !isNowPaused };
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      let newDirection: Position | null = null;
      switch (e.key.toLowerCase()) {
        case 'arrowup': case 'w': newDirection = { x: 0, y: -1 }; break;
        case 'arrowdown': case 's': newDirection = { x: 0, y: 1 }; break;
        case 'arrowleft': case 'a': newDirection = { x: -1, y: 0 }; break;
        case 'arrowright': case 'd': newDirection = { x: 1, y: 0 }; break;
        case ' ': case 'p': e.preventDefault(); togglePause(); return;
      }
      if (newDirection) {
        setGameState(prev => {
          if (prev.gameRunning && (prev.direction.x + newDirection!.x !== 0 || prev.direction.y + newDirection!.y !== 0)) {
            return { ...prev, direction: newDirection };
          }
          return prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 30;
    let newDirection: Position | null = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        newDirection = deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        newDirection = deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }
    }
    if (newDirection) {
        setGameState(prev => {
          if (prev.gameRunning && (prev.direction.x + newDirection!.x !== 0 || prev.direction.y + newDirection!.y !== 0)) {
            return { ...prev, direction: newDirection };
          }
          return prev;
      });
    }
    setTouchStart(null);
  };
  
  const startGame = () => {
    setGameState(prev => ({
      ...getInitialState(),
      gameStarted: true,
      gameRunning: true,
    }));
  };
  
  const resetGame = () => setGameState(getInitialState());
  const continueGame = () => setGameState(prev => ({ ...prev, gameRunning: true, isPaused: false }));

  const renderGame = () => {
    const cellSize = 20;
    const canvasSize = GRID_SIZE * cellSize;
    const getHeadRotation = () => {
        if (gameState.direction.y === -1) return 'rotate-0';
        if (gameState.direction.y === 1) return 'rotate-180';
        if (gameState.direction.x === -1) return 'rotate-[-90deg]';
        if (gameState.direction.x === 1) return 'rotate-90';
        return 'rotate-0';
    };
    return (
      <div className={`inline-block ${wallBehavior === 'wrap' ? 'border-dashed border-green-400' : 'border-solid border-gray-700'} border-4 transition-all`}>
        <div className="bg-gray-800 relative overflow-hidden" style={{ width: canvasSize, height: canvasSize }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="absolute bg-gray-600" style={{ left: (i) * cellSize, top: 0, width: 1, height: '100%' }}/>
                <div className="absolute bg-gray-600" style={{ left: 0, top: (i) * cellSize, width: '100%', height: 1 }}/>
              </React.Fragment>
            ))}
          </div>
          {gameState.snake.map((segment, index) => (
            <div key={index} className={`absolute rounded-sm ${index === 0 ? 'bg-green-400' : 'bg-green-600'}`} style={{ left: segment.x * cellSize, top: segment.y * cellSize, width: cellSize, height: cellSize, boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)', transform: 'scale(0.95)' }}>
              {index === 0 && (
                <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-100 ${getHeadRotation()}`}>
                    <div className="flex justify-between w-2/3">
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <div className="w-1 h-1 bg-black rounded-full" />
                    </div>
                </div>
              )}
            </div>
          ))}
          <div className={`absolute flex items-center justify-center text-lg ${gameState.food.color}`} style={{ left: gameState.food.x * cellSize, top: gameState.food.y * cellSize, width: cellSize, height: cellSize, borderRadius: '50%', boxShadow: 'inset 2px -2px 2px rgba(0,0,0,0.3)' }}>
           {gameState.food.char}
          </div>
          {!gameState.gameStarted && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
              <h3 className="text-xl mb-4 font-bold text-yellow-300">PIXEL SLITHER</h3>
              <p className="text-sm mb-2 text-gray-300">USE WASD OR ARROW KEYS</p>
              <p className="text-xs text-gray-400">SWIPE ON MOBILE</p>
            </div>
          )}
          {gameState.isPaused && !gameState.gameOver && (
             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold text-yellow-300">PAUSED</h3>
            </div>
          )}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center">
              <h3 className="text-2xl mb-2 font-bold text-red-500">GAME OVER</h3>
              <p className="text-lg mb-2 text-gray-200">SCORE: {gameState.score}</p>
              <p className="text-sm mb-4 text-yellow-400">
                {gameState.score > 0 && gameState.score === gameData.highScore ? 'NEW HIGH SCORE!' : `BEST: ${gameData.highScore}`}
              </p>
              <Button onClick={resetGame} className="bg-yellow-400 text-black hover:bg-yellow-300">
                PLAY AGAIN
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-4 flex items-center justify-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">PIXEL SLITHER</h1>
          <p className="text-sm text-green-400 animate-pulse">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl text-yellow-300 mb-2">PIXEL SLITHER</h1>
        <p className="text-sm text-green-400">A RETRO SNAKE ADVENTURE</p>
      </header>
      
      <div className="mb-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">ADVERTISEMENT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800 border-2 border-green-400 shadow-[8px_8px_0px_#2E7D32]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-yellow-300">GAME ARENA</CardTitle>
                <div className="flex gap-2">
                  {!gameState.gameStarted || gameState.gameOver ? (
                    <Button onClick={startGame} className="bg-yellow-400 text-black hover:bg-yellow-300" disabled={!levels.find(l => l.id === selectedLevel)?.unlocked}>
                      <Play className="w-4 h-4 mr-2" />START
                    </Button>
                  ) : (
                    <>
                      <Button onClick={togglePause} className="bg-orange-500 text-white hover:bg-orange-600" disabled={gameState.gameOver}>
                        {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </Button>
                      <Button onClick={resetGame} className="bg-red-600 text-white hover:bg-red-700">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-2">
              {renderGame()}
            </CardContent>
          </Card>

          {(!gameState.gameStarted || gameState.gameOver) && (
            <Card className="mt-6 bg-gray-800 border-2 border-green-400">
              <CardHeader><CardTitle className="text-yellow-300">SETTINGS</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">DIFFICULTY</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {levels.map((level) => (
                        <Button
                          key={level.id}
                          onClick={() => setSelectedLevel(level.id)}
                          disabled={!level.unlocked}
                          className={`h-auto p-3 flex flex-col items-center justify-center text-center transition-all duration-200 ${selectedLevel === level.id ? 'bg-yellow-400 text-black ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-400' : level.unlocked ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                        >
                          <span className="text-xs">{level.name}</span>
                          {level.pro && <Badge variant="destructive" className="mt-1 bg-red-500 text-white text-[10px]">PRO</Badge>}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Separator className="bg-green-400/20" />
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">WALLS</Label>
                    <div className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded-md">
                      <Label htmlFor="wall-behavior" className={`text-sm ${wallBehavior === 'solid' ? 'text-yellow-300' : 'text-gray-400'}`}>Solid</Label>
                      <Switch
                        id="wall-behavior"
                        checked={wallBehavior === 'wrap'}
                        onCheckedChange={(checked) => setWallBehavior(checked ? 'wrap' : 'solid')}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                      />
                      <Label htmlFor="wall-behavior" className={`text-sm ${wallBehavior === 'wrap' ? 'text-yellow-300' : 'text-gray-400'}`}>Wrap Around</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="bg-gray-800 border-2 border-yellow-300 shadow-[4px_4px_0px_#FBC02D]">
            <CardHeader className="pb-2"><CardTitle className="text-yellow-300 text-sm">SCORE BOARD</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-2 bg-gray-900 border border-gray-700 rounded-md">
                <div className="text-3xl font-bold text-white">{gameState.score}</div>
                <div className="text-xs text-yellow-400/80">SCORE</div>
              </div>
              <Separator className="bg-yellow-300/20" />
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-lg text-red-500">{'♥ '.repeat(gameState.lives)}</div>
                  <div className="text-xs text-gray-400">LIVES</div>
                </div>
                <div>
                  <div className="text-lg text-green-400">{gameData.highScore}</div>
                  <div className="text-xs text-gray-400">BEST</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-yellow-300/20">
                <Badge variant="outline" className="text-yellow-300 border-yellow-300/50">LEVEL {gameState.level}</Badge>
              </div>
            </CardContent>
          </Card>
          
          {!gameState.gameRunning && gameState.lives > 0 && gameState.gameStarted && !gameState.gameOver && (
            <Button onClick={continueGame} className="w-full bg-yellow-400 text-black hover:bg-yellow-300 animate-pulse">
              <Zap className="w-4 h-4 mr-2" />
              CONTINUE ({gameState.lives} lives)
            </Button>
          )}

          <Card className="bg-gray-800 border-2 border-green-400">
             <CardHeader className="pb-2"><CardTitle className="text-green-400 text-sm">RECORDS</CardTitle></CardHeader>
             <CardContent className="grid grid-cols-2 gap-2">
                 <Dialog><DialogTrigger asChild>
                    <Button className="w-full bg-green-600 text-white hover:bg-green-500"><Trophy className="w-4 h-4 mr-2" />LEADERBOARD</Button>
                  </DialogTrigger><DialogContent className="bg-gray-900 border-green-400 text-gray-200"><DialogHeader><DialogTitle className="text-green-400">LEADERBOARD</DialogTitle></DialogHeader>
                  <Tabs defaultValue="global" className="w-full"><TabsList className="grid w-full grid-cols-2 bg-gray-800 border-green-400/50"><TabsTrigger value="global">GLOBAL</TabsTrigger><TabsTrigger value="friends" disabled>FRIENDS</TabsTrigger></TabsList>
                  <TabsContent value="global"><ScrollArea className="h-72 pr-3">{gameData.leaderboard.length > 0 ? gameData.leaderboard.map((entry: LeaderboardEntry, i: number) => (<div key={i} className="flex items-center justify-between p-2 my-1 bg-green-500/10 border-l-2 border-green-500"><div className="flex items-center gap-3"><Badge variant="secondary" className="bg-green-500/50">#{i+1}</Badge><span>{entry.name}</span></div><span className="font-bold">{entry.score}</span></div>)) : <p className="text-center py-8">NO SCORES YET!</p>}</ScrollArea></TabsContent></Tabs></DialogContent>
                 </Dialog>
                 <Dialog><DialogTrigger asChild>
                    <Button className="w-full bg-yellow-600 text-white hover:bg-yellow-500"><Star className="w-4 h-4 mr-2" />ACHIEVEMENTS</Button>
                  </DialogTrigger><DialogContent className="bg-gray-900 border-yellow-400 text-gray-200"><DialogHeader><DialogTitle className="text-yellow-400">ACHIEVEMENTS</DialogTitle></DialogHeader>
                  <ScrollArea className="h-80 pr-3"><div className="space-y-3">{achievements.map((a) => { const Icon = iconMap[a.iconName as IconName]; return (<div key={a.id} className={`p-3 border ${a.unlocked ? 'bg-yellow-400/10 border-yellow-400' : 'bg-gray-800 border-gray-700 opacity-60'}`}><div className="flex items-center gap-3 mb-2"><div className={`p-2 ${a.unlocked ? 'bg-yellow-400' : 'bg-gray-700'}`}><Icon className={`w-4 h-4 ${a.unlocked ? 'text-black' : 'text-gray-200'}`} /></div><div className="flex-1"><h4 className="font-bold text-sm">{a.name}</h4><p className="text-xs text-gray-400">{a.description}</p></div>{a.unlocked && (<Badge className="bg-yellow-400 text-black">✓</Badge>)}</div><Progress value={(a.current/a.requirement)*100} className="h-1 [&>div]:bg-yellow-400" /><p className="text-xs text-gray-500 mt-1 text-right">{a.current} / {a.requirement}</p></div>);})}</div></ScrollArea></DialogContent>
                 </Dialog>
             </CardContent>
          </Card>
        </aside>
      </div>
      
      <footer className="mt-6 p-4 border-2 border-dashed border-gray-700 text-center bg-gray-800">
        <p className="text-xs text-gray-500">FOOTER ADVERTISEMENT</p>
      </footer>
    </div>
  );
};

export default PixelSlither;