'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  ROWS, 
  COLS, 
  createGrid, 
  getRandomTetromino, 
  rotate, 
  isValidPosition, 
  placePiece, 
  clearLines, 
  calculateScore, 
  calculateLevel, 
  calculateSpeed,
  drawGhostPiece,
  getHighScore,
  setHighScore,
  tetrominoes,
  type Position,
  type Tetromino,
  type GameStats
} from '@/lib/pixel-box-utils'

export default function PixelBoxGame() {
  const [grid, setGrid] = useState<number[][]>(createGrid())
  const [position, setPosition] = useState<Position>({ row: 0, col: 4 })
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(getRandomTetromino())
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino())
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [speed, setSpeed] = useState(400)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScoreState] = useState(0)
  const [showGhost, setShowGhost] = useState(true)
  const isMobile = useIsMobile()

  const gameLoopRef = useRef<NodeJS.Timeout>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize high score
  useEffect(() => {
    setHighScoreState(getHighScore())
  }, [])

  const resetGame = useCallback(() => {
    setGrid(createGrid())
    setPosition({ row: 0, col: 4 })
    setCurrentPiece(getRandomTetromino())
    setNextPiece(getRandomTetromino())
    setScore(0)
    setLevel(1)
    setLines(0)
    setSpeed(400)
    setGameOver(false)
    setIsPaused(false)
    setGameStarted(true)
  }, [])

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (gameOver || isPaused || !gameStarted) return

    let newPosition = { ...position }
    
    switch (direction) {
      case 'left':
        newPosition.col -= 1
        break
      case 'right':
        newPosition.col += 1
        break
      case 'down':
        newPosition.row += 1
        break
    }

    if (isValidPosition(currentPiece.shape, newPosition, grid)) {
      setPosition(newPosition)
      return true
    }
    
    return false
  }, [position, currentPiece, grid, gameOver, isPaused, gameStarted])

  const rotatePiece = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    const rotatedShape = rotate(currentPiece.shape)
    
    // Try rotation at current position
    if (isValidPosition(rotatedShape, position, grid)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape })
      return
    }

    // Try wall kicks (move left/right if rotation doesn't fit)
    const kicks = [-1, 1, -2, 2]
    for (const kick of kicks) {
      const kickPosition = { ...position, col: position.col + kick }
      if (isValidPosition(rotatedShape, kickPosition, grid)) {
        setCurrentPiece({ ...currentPiece, shape: rotatedShape })
        setPosition(kickPosition)
        return
      }
    }
  }, [currentPiece, position, grid, gameOver, isPaused, gameStarted])

  const hardDrop = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    let dropPosition = { ...position }
    while (isValidPosition(currentPiece.shape, { ...dropPosition, row: dropPosition.row + 1 }, grid)) {
      dropPosition.row += 1
    }
    
    setPosition(dropPosition)
    // Force piece placement on next tick
    setTimeout(() => {
      if (!movePiece('down')) {
        // Piece placement logic will be handled by the game loop
      }
    }, 50)
  }, [position, currentPiece, grid, gameOver, isPaused, gameStarted, movePiece])

  const placePieceAndSpawnNext = useCallback(() => {
    const newGrid = placePiece(grid, currentPiece.shape, position, currentPiece.color)
    const { clearedGrid, linesCleared } = clearLines(newGrid)
    
    // Update score and stats
    const newLines = lines + linesCleared
    const newLevel = calculateLevel(newLines)
    const newScore = score + calculateScore(linesCleared, level)
    const newSpeed = calculateSpeed(newLevel)

    setGrid(clearedGrid)
    setLines(newLines)
    setLevel(newLevel)
    setScore(newScore)
    setSpeed(newSpeed)

    // Update high score
    if (newScore > highScore) {
      setHighScoreState(newScore)
      setHighScore(newScore)
    }

    // Spawn next piece
    const spawnPosition = { row: 0, col: 4 }
    const nextTetromino = getRandomTetromino()
    
    if (!isValidPosition(nextPiece.shape, spawnPosition, clearedGrid)) {
      setGameOver(true)
      setGameStarted(false)
      return
    }

    setCurrentPiece(nextPiece)
    setNextPiece(nextTetromino)
    setPosition(spawnPosition)
  }, [grid, currentPiece, position, nextPiece, score, level, lines, highScore])

  const gameLoop = useCallback(() => {
    if (!movePiece('down')) {
      placePieceAndSpawnNext()
    }
  }, [movePiece, placePieceAndSpawnNext])

  // Game loop effect
  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
      return
    }

    gameLoopRef.current = setInterval(gameLoop, speed)
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameLoop, speed, gameOver, isPaused, gameStarted])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver && e.key === ' ') {
        resetGame()
        return
      }

      if (!gameStarted && e.key === ' ') {
        setGameStarted(true)
        return
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          e.preventDefault()
          movePiece('left')
          break
        case 'arrowright':
        case 'd':
          e.preventDefault()
          movePiece('right')
          break
        case 'arrowdown':
        case 's':
          e.preventDefault()
          movePiece('down')
          break
        case 'arrowup':
        case 'w':
          e.preventDefault()
          rotatePiece()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
        case 'p':
          if (gameStarted && !gameOver) {
            setIsPaused(!isPaused)
          }
          break
        case 'g':
          setShowGhost(!showGhost)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver, gameStarted, isPaused, movePiece, rotatePiece, hardDrop, resetGame, showGhost])

  // Create display grid with current piece
  const createDisplayGrid = () => {
    const displayGrid = grid.map(row => [...row])
    
    // Draw ghost piece
    if (showGhost && gameStarted && !gameOver && !isPaused) {
      const ghostPos = drawGhostPiece(grid, currentPiece.shape, position)
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const newY = ghostPos.row + y
            const newX = ghostPos.col + x
            if (displayGrid[newY] && displayGrid[newY][newX] === 0) {
              displayGrid[newY][newX] = 2 // Ghost piece marker
            }
          }
        })
      })
    }
    
    // Draw current piece
    if (gameStarted && !gameOver) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const newY = position.row + y
            const newX = position.col + x
            if (displayGrid[newY] && displayGrid[newY][newX] !== undefined) {
              displayGrid[newY][newX] = 1
            }
          }
        })
      })
    }
    
    return displayGrid
  }

  const getCellColor = (cell: number | string, rowIndex: number, colIndex: number) => {
    if (cell === 0) return '#0a0a0a' // Empty cell
    if (cell === 2) return 'rgba(255, 255, 255, 0.2)' // Ghost piece
    
    // Check if this cell is part of the current piece
    const isCurrentPiece = currentPiece.shape.some((row, y) =>
      row.some((pieceCell, x) => {
        if (!pieceCell) return false
        const cellY = position.row + y
        const cellX = position.col + x
        return cellY === rowIndex && cellX === colIndex
      })
    )
    
    // If it's the current piece, use its color
    if (isCurrentPiece) {
      return currentPiece.color
    }
    
    // If it's a placed piece, the cell contains the color directly
    if (typeof cell === 'string' && cell.startsWith('#')) {
      return cell // Return the color directly
    }
    
    // Fallback for any other cases
    return '#4ade80'
  }

  const displayGrid = createDisplayGrid()

  // Calculate responsive cell sizes
  const getCellSize = () => {
    if (isMobile) {
      // For mobile, calculate size based on screen width
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375
      const availableWidth = Math.min(screenWidth - 32, 300) // Account for padding and margins
      return Math.floor(availableWidth / COLS)
    }
    return 32 // Desktop default
  }

  const cellSize = getCellSize()

  return (
    <div className="min-h-screen bg-black text-green-400 p-2 sm:p-4 md:p-6" style={{ fontFamily: '"Press Start 2P", monospace' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-3 flex justify-center">
            <Card className="bg-gray-900 border-green-400 border-2 w-full max-w-2xl xl:max-w-3xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-green-400 text-base sm:text-lg md:text-xl lg:text-2xl break-words">PIXEL BOX</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="relative flex justify-center overflow-hidden">
                  <div 
                    className="inline-block border-4 border-green-400 bg-black p-1 sm:p-2 lg:p-3"
                    style={{ 
                      boxShadow: '0 0 30px #4ade80',
                      filter: 'drop-shadow(0 0 15px #4ade80)',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    {displayGrid.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex">
                        {row.map((cell, colIndex) => (
                          <div
                            key={colIndex}
                            className="border border-gray-700"
                            style={{
                              width: cellSize,
                              height: cellSize,
                              backgroundColor: getCellColor(cell, rowIndex, colIndex),
                              boxShadow: cell === 1 ? 'inset 0 0 5px rgba(255,255,255,0.3)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {(gameOver || isPaused || !gameStarted) && (
                    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                      <div className="text-center p-2">
                        {gameOver && (
                          <>
                            <div className="text-red-400 text-base sm:text-lg mb-2 break-words">GAME OVER</div>
                            <div className="text-green-400 text-xs sm:text-sm mb-4 break-words">PRESS SPACE TO RESTART</div>
                          </>
                        )}
                        {isPaused && !gameOver && (
                          <>
                            <div className="text-yellow-400 text-base sm:text-lg mb-2 break-words">PAUSED</div>
                            <div className="text-green-400 text-xs sm:text-sm mb-4 break-words">PRESS P TO CONTINUE</div>
                          </>
                        )}
                        {!gameStarted && !gameOver && (
                          <>
                            <div className="text-green-400 text-base sm:text-lg mb-2 break-words">PIXEL BOX</div>
                            <div className="text-green-400 text-xs sm:text-sm mb-4 break-words">PRESS SPACE TO START</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile and Tablet Controls */}
                <div className="mt-4 sm:mt-6 space-y-3 lg:hidden">
                  {/* Movement and Rotation Row */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    <Button 
                      onClick={() => movePiece('left')}
                      className="bg-green-700 hover:bg-green-600 text-green-100 border border-green-400 text-xs sm:text-sm py-2 sm:py-3 h-10 sm:h-12 md:h-14 min-w-0 px-1 sm:px-2"
                      disabled={gameOver || !gameStarted}
                    >
                      <span className="truncate">← LEFT</span>
                    </Button>
                    <Button 
                      onClick={() => movePiece('right')}
                      className="bg-green-700 hover:bg-green-600 text-green-100 border border-green-400 text-xs sm:text-sm py-2 sm:py-3 h-10 sm:h-12 md:h-14 min-w-0 px-1 sm:px-2"
                      disabled={gameOver || !gameStarted}
                    >
                      <span className="truncate">RIGHT →</span>
                    </Button>
                    <Button 
                      onClick={() => rotatePiece()}
                      className="bg-blue-700 hover:bg-blue-600 text-blue-100 border border-blue-400 text-xs sm:text-sm py-2 sm:py-3 h-10 sm:h-12 md:h-14 min-w-0 px-1 sm:px-2"
                      disabled={gameOver || !gameStarted}
                    >
                      <span className="truncate">↻ <span className="hidden sm:inline">ROT</span><span className="sm:hidden">R</span></span>
                    </Button>
                    <Button 
                      onClick={() => hardDrop()}
                      className="bg-red-700 hover:bg-red-600 text-red-100 border border-red-400 text-xs sm:text-sm py-2 sm:py-3 h-10 sm:h-12 md:h-14 min-w-0 px-1 sm:px-2"
                      disabled={gameOver || !gameStarted}
                    >
                      <span className="truncate">↓ DROP</span>
                    </Button>
                  </div>
                  
                  {/* Start/Restart Button */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => {
                        if (gameOver) {
                          resetGame()
                        } else if (!gameStarted) {
                          setGameStarted(true)
                        } else {
                          hardDrop()
                        }
                      }}
                      className="bg-yellow-700 hover:bg-yellow-600 text-yellow-100 border border-yellow-400 text-xs sm:text-sm py-3 sm:py-4 px-6 sm:px-8 w-full max-w-xs h-10 sm:h-12 md:h-14"
                      disabled={isPaused}
                    >
                      <span className="truncate">
                        {gameOver ? 'RESTART' : !gameStarted ? 'START' : 'SPACE'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Desktop Controls */}
                <div className="mt-6 grid grid-cols-4 gap-3 xl:gap-4 hidden lg:grid">
                  <Button 
                    onClick={() => movePiece('left')}
                    className="bg-green-700 hover:bg-green-600 text-green-100 border border-green-400 text-sm xl:text-base py-3 xl:py-4 min-w-0 px-2 xl:px-3"
                    disabled={gameOver || !gameStarted}
                  >
                    <span className="truncate">← LEFT</span>
                  </Button>
                  <Button 
                    onClick={() => movePiece('right')}
                    className="bg-green-700 hover:bg-green-600 text-green-100 border border-green-400 text-sm xl:text-base py-3 xl:py-4 min-w-0 px-2 xl:px-3"
                    disabled={gameOver || !gameStarted}
                  >
                    <span className="truncate">RIGHT →</span>
                  </Button>
                  <Button 
                    onClick={() => rotatePiece()}
                    className="bg-blue-700 hover:bg-blue-600 text-blue-100 border border-blue-400 text-sm xl:text-base py-3 xl:py-4 min-w-0 px-2 xl:px-3"
                    disabled={gameOver || !gameStarted}
                  >
                    <span className="truncate">↻ ROTATE</span>
                  </Button>
                  <Button 
                    onClick={() => hardDrop()}
                    className="bg-red-700 hover:bg-red-600 text-red-100 border border-red-400 text-sm xl:text-base py-3 xl:py-4 min-w-0 px-2 xl:px-3"
                    disabled={gameOver || !gameStarted}
                  >
                    <span className="truncate">↓ DROP</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-1 space-y-3 sm:space-y-4">
            <Card className="bg-gray-900 border-green-400 border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-xs sm:text-sm break-words">SCORE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="break-words">CURRENT:</span>
                  <span className="text-yellow-400 break-words">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="break-words">HIGH:</span>
                  <span className="text-red-400 break-words">{highScore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="break-words">LEVEL:</span>
                  <span className="text-blue-400 break-words">{level}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="break-words">LINES:</span>
                  <span className="text-purple-400 break-words">{lines}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-400 border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-xs sm:text-sm break-words">NEXT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="grid gap-px">
                    {nextPiece.shape.map((row, y) => (
                      <div key={y} className="flex gap-px">
                        {row.map((cell, x) => (
                          <div
                            key={x}
                            className="border border-gray-700"
                            style={{
                              width: isMobile ? 16 : 20,
                              height: isMobile ? 16 : 20,
                              backgroundColor: cell ? nextPiece.color : 'transparent'
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-400 border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 text-xs sm:text-sm break-words">CONTROLS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="break-words">A/D or ←/→: MOVE</div>
                <div className="break-words">W or ↑: ROTATE</div>
                <div className="break-words">S or ↓: SOFT DROP</div>
                <div className="break-words">SPACE: HARD DROP</div>
                <div className="break-words">P: PAUSE</div>
                <div className="break-words">G: TOGGLE GHOST</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-green-400 border-2">
              <CardContent className="p-3 sm:p-4 space-y-2">
                <Button 
                  onClick={resetGame}
                  className="w-full bg-red-700 hover:bg-red-600 text-red-100 border border-red-400 text-xs sm:text-sm py-2"
                >
                  NEW GAME
                </Button>
                <Button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-full bg-yellow-700 hover:bg-yellow-600 text-yellow-100 border border-yellow-400 text-xs sm:text-sm py-2"
                  disabled={gameOver || !gameStarted}
                >
                  {isPaused ? 'RESUME' : 'PAUSE'}
                </Button>
                <div className="flex items-center justify-between text-xs">
                  <span className="break-words">GHOST:</span>
                  <Badge 
                    variant={showGhost ? "default" : "secondary"}
                    className={showGhost ? "bg-green-700 text-green-100" : "bg-gray-700 text-gray-300"}
                  >
                    {showGhost ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        
        {/* Game Description */}
        <div className="w-full mt-6">
          <Card className="bg-gray-900 border-green-400 border-2">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-300 text-center leading-relaxed break-words hyphens-auto">
                Stack, rotate, and clear your way to victory in this electrifying block-dropping puzzle! 
                Seven unique tetromino shapes fall from above, and it's your job to fit them perfectly into 
                horizontal lines. Rotate pieces with precision, slide them left and right, and use the hard drop 
                for lightning-fast placement. Complete lines disappear and boost your score, but let the blocks 
                reach the top and it's game over! As your level increases, pieces fall faster, testing your 
                reflexes and spatial reasoning. The ghost piece shows you exactly where your block will land. 
                Master the art of perfect placement and see how high you can score!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
