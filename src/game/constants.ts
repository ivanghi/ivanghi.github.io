import type { Difficulty } from './types'

export const DIFFICULTIES: Difficulty[] = [
  { name: 'Easy', rows: 9, cols: 9, mines: 10 },
  { name: 'Medium', rows: 16, cols: 16, mines: 40 },
  { name: 'Hard', rows: 25, cols: 25, mines: 150 },
]