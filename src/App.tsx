import { useState, useEffect, useCallback } from 'react'
import { DIFFICULTIES } from './game/constants'
import { useGame } from './hooks/useGame'
import { useTimer } from './hooks/useTimer'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import DifficultySelector from './components/DifficultySelector'
import type { Difficulty } from './game/types'

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[0])
  const game = useGame(difficulty)
  const timer = useTimer()
  const [flagMode, setFlagMode] = useState(false)

  useEffect(() => {
    if (game.status === 'playing') {
      timer.start()
    } else if (game.status === 'won' || game.status === 'lost') {
      timer.stop()
    } else if (game.status === 'ready') {
      timer.reset()
    }
  }, [game.status, timer])

  const handleReveal = useCallback(
    (index: number) => {
      if (game.status === 'won' || game.status === 'lost') return
      if (flagMode) {
        game.flag(index)
        return
      }
      if (game.board[index].revealed) {
        game.chord(index)
        return
      }
      game.reveal(index)
    },
    [flagMode, game],
  )

  const handleFlag = useCallback(
    (index: number) => {
      if (game.status === 'won' || game.status === 'lost') return
      game.flag(index)
    },
    [game],
  )

  const handleReset = useCallback(() => {
    game.reset(difficulty)
  }, [game, difficulty])

  const handleDifficultyChange = useCallback(
    (d: Difficulty) => {
      setDifficulty(d)
      game.reset(d)
    },
    [game],
  )

  const mineDisplay =
    game.status === 'won' || game.status === 'lost'
      ? game.totalMines
      : Math.max(0, game.totalMines - game.flagsUsed)

  return (
    <div className="app">
      <h1 className="title">Minesweeper</h1>
      <DifficultySelector current={difficulty} onChange={handleDifficultyChange} />
      <StatusBar
        mineDisplay={mineDisplay}
        elapsed={timer.elapsed}
        moves={game.moves}
        status={game.status}
        flagMode={flagMode}
        onReset={handleReset}
        onToggleFlagMode={() => setFlagMode((m) => !m)}
      />
      <div className="board-container">
        <Board
          board={game.board}
          rows={difficulty.rows}
          cols={difficulty.cols}
          status={game.status}
          minesPlaced={game.minesPlaced}
          onReveal={handleReveal}
          onFlag={handleFlag}
        />
      </div>
      {game.status === 'won' && (
        <div className="game-banner win-banner">
          You Win! 🎉
          <button className="play-again-btn" onClick={handleReset} type="button">
            Play Again
          </button>
        </div>
      )}
      {game.status === 'lost' && (
        <div className="game-banner lose-banner">
          Game Over 💥
          <button className="play-again-btn" onClick={handleReset} type="button">
            Play Again
          </button>
        </div>
      )}
      <div className={`flag-indicator ${flagMode ? 'active' : ''}`}>
        {flagMode ? 'Flag Mode: Tap to place flags' : 'Tap to reveal'}
      </div>
    </div>
  )
}