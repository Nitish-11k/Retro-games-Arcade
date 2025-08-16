export interface Position {
  row: number;
  col: number;
}

export interface Tetromino {
  shape: number[][];
  color: string;
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
  const rows = matrix.length;
  const cols = matrix[0].length;
  const newMatrix = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      newMatrix[col][rows - 1 - row] = matrix[row][col];
    }
  }
  return newMatrix;
};

export const getRandomTetromino = (): Tetromino => {
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
};

export const isValidPosition = (
  shape: number[][],
  position: Position,
  grid: number[][]
): boolean => {
  return shape.every((row, y) => {
    return row.every((cell, x) => {
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
    });
  });
};

export const placePiece = (
  grid: number[][],
  shape: number[][],
  position: Position,
  color: string
): number[][] => {
  const newGrid = grid.map(row => [...row]);
  const colorIndex = tetrominoes.findIndex(t => t.color === color);
  const pieceIdentifier = colorIndex !== -1 ? colorIndex + 1 : 1;

  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const newY = position.row + y;
        const newX = position.col + x;
        if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
          newGrid[newY][newX] = pieceIdentifier;
        }
      }
    });
  });

  return newGrid;
};

export const clearLines = (grid: number[][]): { clearedGrid: number[][], linesCleared: number } => {
  let linesCleared = 0;
  const clearedRows = grid.filter(row => {
    const isFull = row.every(cell => cell !== EMPTY);
    if (isFull) linesCleared++;
    return !isFull;
  });
  
  const newRows = Array.from({ length: linesCleared }, () => Array(COLS).fill(EMPTY));
  return {
    clearedGrid: [...newRows, ...clearedRows],
    linesCleared: linesCleared
  };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const linePoints = [0, 100, 300, 500, 800];
  return (linePoints[linesCleared] || 0) * level;
};

export const calculateLevel = (lines: number): number => {
  return Math.floor(lines / 10) + 1;
};

export const calculateSpeed = (level: number): number => {
  return Math.max(100, 400 - (level - 1) * 20);
};


export const drawGhostPiece = (grid: number[][], shape: number[][], position: Position): Position => {
  let ghostPos = { ...position };
  while (isValidPosition(shape, { ...ghostPos, row: ghostPos.row + 1 }, grid)) {
    ghostPos.row++;
  }
  return ghostPos;
}

export const getHighScore = (): number => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('pixel-box-highscore') || '0', 10);
  }
  return 0;
};

export const setHighScore = (score: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pixel-box-highscore', score.toString());
  }
};
