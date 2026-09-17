import type { Difficulty } from '../game/types'
import { DIFFICULTIES } from '../game/constants'

interface DifficultySelectorProps {
  current: Difficulty
  onChange: (difficulty: Difficulty) => void
}

export default function DifficultySelector({ current, onChange }: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector">
      {DIFFICULTIES.map((d) => (
        <button
          key={d.name}
          className={`difficulty-btn ${d.name === current.name ? 'active' : ''}`}
          onClick={() => onChange(d)}
          type="button"
        >
          {d.name}
        </button>
      ))}
    </div>
  )
}