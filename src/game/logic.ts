import type { CellModel, GameStatus } from './types'

export function createEmptyBoard(rows: number, cols: number): CellModel[] {
  return Array.from({ length: rows * cols }, () => ({
    mine: false,
    adjacentCount: 0,
    revealed: false,
    flagged: false,
  }))
}

export function placeMines(
  board: CellModel[],
  mines: number,
  safeIndex: number,
  rows: number,
  cols: number,
): void {
  const total = board.length

  if (mines > total - 1) {
    for (let i = 0; i < total; i++) {
      if (i !== safeIndex) board[i].mine = true
    }
    computeAdjacentCounts(board, cols, rows)
    return
  }

  const indices = Array.from({ length: total }, (_, i) => i)
  indices.splice(safeIndex, 1)

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  for (let i = 0; i < mines && i < indices.length; i++) {
    board[indices[i]].mine = true
  }

  computeAdjacentCounts(board, cols, rows)
}

function computeAdjacentCounts(board: CellModel[], cols: number, rows: number): void {

  for (let i = 0; i < board.length; i++) {
    if (board[i].mine) continue
    board[i].adjacentCount = getNeighbors(i, rows, cols).filter(
      (n) => board[n].mine,
    ).length
  }
}

export function getNeighbors(
  index: number,
  rows: number,
  cols: number,
): number[] {
  const row = Math.floor(index / cols)
  const col = index % cols
  const neighbors: number[] = []

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(nr * cols + nc)
      }
    }
  }

  return neighbors
}

export function revealCell(
  board: CellModel[],
  index: number,
  rows: number,
  cols: number,
): GameStatus {
  const cell = board[index]
  if (cell.revealed || cell.flagged) return 'playing'

  cell.revealed = true

  if (cell.mine) {
    revealAllMines(board)
    return 'lost'
  }

  if (cell.adjacentCount === 0) {
    const neighbors = getNeighbors(index, rows, cols)
    for (const n of neighbors) {
      if (!board[n].revealed && !board[n].flagged && !board[n].mine) {
        revealCell(board, n, rows, cols)
      }
    }
  }

  return checkWin(board) ? 'won' : 'playing'
}

export function chordReveal(
  board: CellModel[],
  index: number,
  rows: number,
  cols: number,
): GameStatus {
  const cell = board[index]
  if (!cell.revealed || cell.mine || cell.adjacentCount === 0) return 'playing'

  const neighbors = getNeighbors(index, rows, cols)
  const flagCount = neighbors.filter((n) => board[n].flagged).length
  if (flagCount !== cell.adjacentCount) return 'playing'

  for (const n of neighbors) {
    if (!board[n].revealed && !board[n].flagged) {
      if (revealCell(board, n, rows, cols) === 'lost') return 'lost'
    }
  }

  return checkWin(board) ? 'won' : 'playing'
}

export function toggleFlag(board: CellModel[], index: number): void {
  const cell = board[index]
  if (cell.revealed) return
  cell.flagged = !cell.flagged
}

export function checkWin(board: CellModel[]): boolean {
  for (const cell of board) {
    if (!cell.mine && !cell.revealed) return false
  }
  return true
}

export function revealAllMines(board: CellModel[]): void {
  for (const cell of board) {
    if (cell.mine) {
      cell.revealed = true
    }
  }
}

export function countFlags(board: CellModel[]): number {
  return board.filter((c) => c.flagged).length
}

export function countRevealed(board: CellModel[]): number {
  return board.filter((c) => c.revealed).length
}