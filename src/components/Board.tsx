import { useMemo } from 'react'
import type { CellModel, GameStatus } from '../game/types'
import Cell from './Cell'

interface BoardProps {
  board: CellModel[]
  rows: number
  cols: number
  status: GameStatus
  minesPlaced: boolean
  onReveal: (index: number) => void
  onFlag: (index: number) => void
}

export default function Board({
  board,
  rows,
  cols,
  status,
  minesPlaced,
  onReveal,
  onFlag,
}: BoardProps) {
  const gameOver = status === 'won' || status === 'lost'

  const wrongFlags = useMemo(() => {
    if (status !== 'lost') return new Set<number>()
    const set = new Set<number>()
    for (let i = 0; i < board.length; i++) {
      if (board[i].flagged && !board[i].mine) {
        set.add(i)
      }
    }
    return set
  }, [board, status])

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {board.map((cell, i) => (
        <Cell
          key={`${i}-${minesPlaced ? 'p' : 'e'}`}
          cell={cell}
          gameOver={gameOver}
          wrongFlag={wrongFlags.has(i)}
          onReveal={() => onReveal(i)}
          onFlag={() => onFlag(i)}
        />
      ))}
    </div>
  )
}