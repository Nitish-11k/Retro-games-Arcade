export interface Position {
  row: number;
  col: number;
}

export interface Tetromino {
  shape: number[][];
  color: string;
  name: string;
}

export interface GameStats {
  score: number;
  level: number;
  lines: number;
  speed: number;
}

export const ROWS = 20;
export const COLS = 10;
export const EMPTY = 0;

export const createGrid = (): number[][] => 
  Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

export const tetrominoes: Tetromino[] = [
  {
    shape: [
      [1, 1, 1, 1],
    ],
    color: '#00ffff',
    name: 'I-Piece',
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffff00',
    name: 'O-Piece',
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#ff00ff',
    name: 'T-Piece',
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#00ff00',
    name: 'S-Piece',
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#ff0000',
    name: 'Z-Piece',
  },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#0000ff',
    name: 'J-Piece',
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#ff8000',
    name: 'L-Piece',
  },
];

export const rotate = (matrix: number[][]): number[][] => {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
};

export const getRandomTetromino = (): Tetromino => {
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
};

export const isValidPosition = (
  shape: number[][], 
  position: Position, 
  grid: number[][]
): boolean => {
  return shape.every((row, y) =>
    row.every((cell, x) => {
      const newY = position.row + y;
      const newX = position.col + x;
      return (
        !cell ||
        (newY >= 0 &&
          newY < ROWS &&
          newX >= 0 &&
          newX < COLS &&
          grid[newY][newX] === EMPTY)
      );
    })
  );
};

export const placePiece = (
  grid: number[][],
  shape: number[][],
  position: Position,
  color: string
): number[][] => {
  const newGrid = grid.map(row => [...row]);
  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const newY = position.row + y;
        const newX = position.col + x;
        if (newGrid[newY] && newGrid[newY][newX] !== undefined) {
          newGrid[newY][newX] = 1;
        }
      }
    });
  });
  return newGrid;
};

export const clearLines = (grid: number[][]): { clearedGrid: number[][]; linesCleared: number } => {
  let linesCleared = 0;
  const clearedRows = grid.filter(row => {
    const isFull = row.every(cell => cell !== EMPTY);
    if (isFull) linesCleared++;
    return !isFull;
  });
  
  const newRows = Array.from({ length: linesCleared }, () => Array(COLS).fill(EMPTY));
  return {
    clearedGrid: [...newRows, ...clearedRows],
    linesCleared
  };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const basePoints = [0, 40, 100, 300, 1200];
  return basePoints[linesCleared] * level;
};

export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / 10) + 1;
};

export const calculateSpeed = (level: number): number => {
  return Math.max(25, 400 - (level - 1) * 40);
};

export const drawGhostPiece = (
  grid: number[][],
  shape: number[][],
  position: Position
): Position => {
  let ghostPosition = { ...position };
  while (isValidPosition(shape, { ...ghostPosition, row: ghostPosition.row + 1 }, grid)) {
    ghostPosition.row++;
  }
  return ghostPosition;
};

// Game state management
export const getHighScore = (): number => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('tetris-high-score') || '0', 10);
  }
  return 0;
};

export const setHighScore = (score: number): void => {
  if (typeof window !== 'undefined') {
    const currentHigh = getHighScore();
    if (score > currentHigh) {
      localStorage.setItem('tetris-high-score', score.toString());
    }
  }
};

export const getGameStats = (): GameStats => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tetris-stats');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return { score: 0, level: 1, lines: 0, speed: 400 };
};

export const saveGameStats = (stats: GameStats): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tetris-stats', JSON.stringify(stats));
  }
};

export const resetGameStats = (): GameStats => {
  const initialStats = { score: 0, level: 1, lines: 0, speed: 400 };
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tetris-stats');
  }
  return initialStats;
};
