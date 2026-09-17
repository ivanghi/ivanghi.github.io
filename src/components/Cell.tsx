import type { CellModel } from '../game/types'

interface CellProps {
  cell: CellModel
  gameOver: boolean
  wrongFlag: boolean
  onReveal: () => void
  onFlag: () => void
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#00008b',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
}

export default function Cell({ cell, gameOver, wrongFlag, onReveal, onFlag }: CellProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onFlag()
  }

  const chordable = cell.revealed && !cell.mine && cell.adjacentCount > 0

  let content: React.ReactNode = null
  let className = 'cell'

  if (cell.revealed) {
    className += ' revealed'
    if (cell.mine) {
      content = '💣'
      className += ' mine'
    } else if (cell.adjacentCount > 0) {
      content = cell.adjacentCount
      className += ' numbered'
    }
  } else {
    className += ' hidden'
    if (cell.flagged) {
      content = wrongFlag ? '❌' : '🚩'
      className += ' flagged'
    }
  }

  return (
    <button
      className={className}
      onClick={onReveal}
      onContextMenu={handleContextMenu}
      disabled={gameOver || (cell.revealed && !chordable)}
      style={
        cell.revealed && !cell.mine && cell.adjacentCount > 0
          ? { color: NUMBER_COLORS[cell.adjacentCount] ?? '#000' }
          : undefined
      }
      type="button"
      aria-label={`cell-${cell.revealed ? (cell.mine ? 'mine' : 'revealed') : cell.flagged ? 'flagged' : 'hidden'}`}
    >
      {content}
    </button>
  )
}