export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  requirement: number;
  current: number;
  category: 'gameplay' | 'score' | 'persistence' | 'special';
}

export const createAchievements = (gameData: any): Achievement[] => [
  {
    id: 'first_food',
    name: 'First Bite',
    description: 'Eat your first collectible',
    iconName: 'Target',
    unlocked: gameData.totalScore > 0,
    requirement: 1,
    current: Math.min(gameData.totalScore > 0 ? 1 : 0, 1),
    category: 'gameplay',
  },
  {
    id: 'score_50',
    name: 'Getting Started',
    description: 'Score 50 points in a single game',
    iconName: 'Star',
    unlocked: gameData.highScore >= 50,
    requirement: 50,
    current: Math.min(gameData.highScore, 50),
    category: 'score',
  },
  {
    id: 'score_100',
    name: 'Century Club',
    description: 'Score 100 points in a single game',
    iconName: 'Award',
    unlocked: gameData.highScore >= 100,
    requirement: 100,
    current: Math.min(gameData.highScore, 100),
    category: 'score',
  },
  {
    id: 'score_250',
    name: 'Quarter Master',
    description: 'Score 250 points in a single game',
    iconName: 'Medal',
    unlocked: gameData.highScore >= 250,
    requirement: 250,
    current: Math.min(gameData.highScore, 250),
    category: 'score',
  },
  {
    id: 'score_500',
    name: 'High Roller',
    description: 'Score 500 points in a single game',
    iconName: 'Crown',
    unlocked: gameData.highScore >= 500,
    requirement: 500,
    current: Math.min(gameData.highScore, 500),
    category: 'score',
  },
  {
    id: 'score_1000',
    name: 'Legendary Slitherer',
    description: 'Score 1000 points in a single game',
    iconName: 'Trophy',
    unlocked: gameData.highScore >= 1000,
    requirement: 1000,
    current: Math.min(gameData.highScore, 1000),
    category: 'score',
  },
  {
    id: 'games_5',
    name: 'Getting the Hang',
    description: 'Play 5 games',
    iconName: 'Flame',
    unlocked: gameData.totalGames >= 5,
    requirement: 5,
    current: Math.min(gameData.totalGames, 5),
    category: 'persistence',
  },
  {
    id: 'games_10',
    name: 'Persistent Player',
    description: 'Play 10 games',
    iconName: 'Zap',
    unlocked: gameData.totalGames >= 10,
    requirement: 10,
    current: Math.min(gameData.totalGames, 10),
    category: 'persistence',
  },
];

export const getUnlockedAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter(achievement => achievement.unlocked);
};

export const getAchievementProgress = (achievements: Achievement[]): number => {
  const unlocked = getUnlockedAchievements(achievements).length;
  return Math.round((unlocked / achievements.length) * 100);
};

export const saveGameData = (data: any) => {
  try {
    localStorage.setItem('pixelSlither', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save game data:', error);
  }
};

export const loadGameData = () => {
  try {
    const saved = localStorage.getItem('pixelSlither');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load game data:', error);
  }
  return {
    highScore: 0,
    achievements: [],
    leaderboard: [],
    totalGames: 0,
    totalScore: 0,
  };
};
