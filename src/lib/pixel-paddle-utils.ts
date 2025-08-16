export interface PaddleAchievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  requirement: number;
  current: number;
  category: 'gameplay' | 'score' | 'persistence' | 'special';
}

export interface PaddleGameData {
  highScore: number;
  achievements: PaddleAchievement[];
  leaderboard: any[];
  totalGames: number;
  totalScore: number;
  highestLevel: number;
  totalBricksDestroyed: number;
}

export const createPaddleAchievements = (gameData: PaddleGameData): PaddleAchievement[] => [
  {
    id: 'first_brick',
    name: 'Brick Breaker',
    description: 'Destroy your first brick',
    iconName: 'Target',
    unlocked: gameData.totalBricksDestroyed > 0,
    requirement: 1,
    current: Math.min(gameData.totalBricksDestroyed, 1),
    category: 'gameplay',
  },
  {
    id: 'score_100',
    name: 'Getting Started',
    description: 'Score 100 points in a single game',
    iconName: 'Star',
    unlocked: gameData.highScore >= 100,
    requirement: 100,
    current: Math.min(gameData.highScore, 100),
    category: 'score',
  },
  {
    id: 'score_500',
    name: 'Point Collector',
    description: 'Score 500 points in a single game',
    iconName: 'Award',
    unlocked: gameData.highScore >= 500,
    requirement: 500,
    current: Math.min(gameData.highScore, 500),
    category: 'score',
  },
  {
    id: 'score_1000',
    name: 'High Scorer',
    description: 'Score 1000 points in a single game',
    iconName: 'Medal',
    unlocked: gameData.highScore >= 1000,
    requirement: 1000,
    current: Math.min(gameData.highScore, 1000),
    category: 'score',
  },
  {
    id: 'level_2',
    name: 'Level Up',
    description: 'Complete level 1',
    iconName: 'Crown',
    unlocked: gameData.highestLevel >= 2,
    requirement: 2,
    current: Math.min(gameData.highestLevel, 2),
    category: 'gameplay',
  },
  {
    id: 'level_3',
    name: 'Paddle Master',
    description: 'Complete level 2',
    iconName: 'Trophy',
    unlocked: gameData.highestLevel >= 3,
    requirement: 3,
    current: Math.min(gameData.highestLevel, 3),
    category: 'gameplay',
  },
  {
    id: 'games_10',
    name: 'Dedicated Player',
    description: 'Play 10 games',
    iconName: 'Flame',
    unlocked: gameData.totalGames >= 10,
    requirement: 10,
    current: Math.min(gameData.totalGames, 10),
    category: 'persistence',
  },
  {
    id: 'bricks_100',
    name: 'Demolition Expert',
    description: 'Destroy 100 bricks total',
    iconName: 'Zap',
    unlocked: gameData.totalBricksDestroyed >= 100,
    requirement: 100,
    current: Math.min(gameData.totalBricksDestroyed, 100),
    category: 'special',
  },
];

export const loadPaddleGameData = (): PaddleGameData => {
  if (typeof window === 'undefined') {
    return {
      highScore: 0,
      achievements: [],
      leaderboard: [],
      totalGames: 0,
      totalScore: 0,
      highestLevel: 0,
      totalBricksDestroyed: 0,
    };
  }

  try {
    const saved = localStorage.getItem('pixelPaddleGameData');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load Pixel Paddle game data:', error);
  }

  return {
    highScore: 0,
    achievements: [],
    leaderboard: [],
    totalGames: 0,
    totalScore: 0,
    highestLevel: 0,
    totalBricksDestroyed: 0,
  };
};

export const savePaddleGameData = (gameData: PaddleGameData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('pixelPaddleGameData', JSON.stringify(gameData));
  } catch (error) {
    console.warn('Failed to save Pixel Paddle game data:', error);
  }
};
