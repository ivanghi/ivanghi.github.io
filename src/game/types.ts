export interface CellModel {
  mine: boolean
  adjacentCount: number
  revealed: boolean
  flagged: boolean
}

export type GameStatus = 'ready' | 'playing' | 'won' | 'lost'

export interface Difficulty {
  name: string
  rows: number
  cols: number
  mines: number
}