import type { GameStatus } from '../game/types'

interface StatusBarProps {
  mineDisplay: number
  elapsed: number
  moves: number
  status: GameStatus
  flagMode: boolean
  onReset: () => void
  onToggleFlagMode: () => void
}

function pad(n: number): string {
  return String(Math.max(0, Math.min(999, n))).padStart(3, '0')
}

const STATUS_EMOJI: Record<GameStatus, string> = {
  ready: '🙂',
  playing: '🙂',
  won: '😎',
  lost: '😵',
}

export default function StatusBar({
  mineDisplay,
  elapsed,
  moves,
  status,
  flagMode,
  onReset,
  onToggleFlagMode,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="counter mine-counter">{pad(mineDisplay)}</div>
      <button
        className="reset-button"
        onClick={onReset}
        type="button"
        aria-label="Reset game"
      >
        {STATUS_EMOJI[status]}
      </button>
      <div className="counter timer">{pad(elapsed)}</div>
      <div className="counter move-counter" title="Moves">
        {pad(moves)}
      </div>
      <button
        className={`flag-toggle ${flagMode ? 'active' : ''}`}
        onClick={onToggleFlagMode}
        type="button"
        aria-label="Toggle flag mode"
        title="Toggle flag mode"
      >
        🚩
      </button>
    </div>
  )
}