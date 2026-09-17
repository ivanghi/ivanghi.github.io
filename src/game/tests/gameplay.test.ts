import { describe, it, expect } from 'vitest'
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkWin,
  countRevealed,
  getNeighbors,
  revealAllMines,
} from '../logic'

describe('getNeighbors', () => {
  it('returns 8 neighbors for a center cell in 3x3', () => {
    const neighbors = getNeighbors(4, 3, 3)
    expect(neighbors).toEqual(expect.arrayContaining([0, 1, 2, 3, 5, 6, 7, 8]))
    expect(neighbors).toHaveLength(8)
  })

  it('returns 3 neighbors for a corner cell in 3x3', () => {
    const neighbors = getNeighbors(0, 3, 3)
    expect(neighbors).toEqual(expect.arrayContaining([1, 3, 4]))
    expect(neighbors).toHaveLength(3)
  })

  it('returns 5 neighbors for an edge cell in 3x3', () => {
    const neighbors = getNeighbors(1, 3, 3)
    expect(neighbors).toEqual(expect.arrayContaining([0, 2, 3, 4, 5]))
    expect(neighbors).toHaveLength(5)
  })

  it('returns correct neighbors for 9x9 board', () => {
    const neighbors = getNeighbors(40, 9, 9)
    expect(neighbors).toHaveLength(8)
    expect(neighbors).toContain(30)
    expect(neighbors).toContain(31)
    expect(neighbors).toContain(32)
    expect(neighbors).toContain(39)
    expect(neighbors).toContain(41)
    expect(neighbors).toContain(48)
    expect(neighbors).toContain(49)
    expect(neighbors).toContain(50)
  })

  it('handles 1x1 board (no neighbors)', () => {
    const neighbors = getNeighbors(0, 1, 1)
    expect(neighbors).toHaveLength(0)
  })

  it('handles 2x2 board', () => {
    const n0 = getNeighbors(0, 2, 2)
    expect(n0.sort()).toEqual([1, 2, 3])
    const n3 = getNeighbors(3, 2, 2)
    expect(n3.sort()).toEqual([0, 1, 2])
  })
})

describe('placeMines edge cases', () => {
  it('handles mines >= total cells by mining all except safe', () => {
    const board = createEmptyBoard(2, 2)
    placeMines(board, 10, 0, 2, 2)
    const mineCount = board.filter((c) => c.mine).length
    expect(mineCount).toBe(3)
    expect(board[0].mine).toBe(false)
    expect(board[1].mine).toBe(true)
    expect(board[2].mine).toBe(true)
    expect(board[3].mine).toBe(true)
  })

  it('handles 0 mines', () => {
    const board = createEmptyBoard(9, 9)
    placeMines(board, 0, 0, 9, 9)
    const mineCount = board.filter((c) => c.mine).length
    expect(mineCount).toBe(0)
  })

  it('safe index is respected for large boards', () => {
    const board = createEmptyBoard(16, 16)
    const safeIndex = 128
    placeMines(board, 40, safeIndex, 16, 16)
    expect(board[safeIndex].mine).toBe(false)
    const mineCount = board.filter((c) => c.mine).length
    expect(mineCount).toBe(40)
  })
})

describe('revealAllMines', () => {
  it('reveals all mines but not non-mines', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    board[4].mine = true
    revealAllMines(board)
    expect(board[0].revealed).toBe(true)
    expect(board[4].revealed).toBe(true)
    expect(board[1].revealed).toBe(false)
    expect(board[2].revealed).toBe(false)
  })
})

describe('revealCell advanced', () => {
  it('returns won when last safe cell revealed', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    for (let i = 1; i < 8; i++) {
      board[i].revealed = true
    }
    const status = revealCell(board, 8, 3, 3)
    expect(status).toBe('won')
  })

  it('returns lost immediately on mine click', () => {
    const board = createEmptyBoard(3, 3)
    board[4].mine = true
    const status = revealCell(board, 4, 3, 3)
    expect(status).toBe('lost')
    const totalRevealedMines = board.filter((c) => c.mine && c.revealed).length
    expect(totalRevealedMines).toBe(1)
  })

  it('does not reveal flagged cells even during flood-fill', () => {
    const board = createEmptyBoard(9, 9)
    placeMines(board, 10, 0, 9, 9)
    board[1].flagged = true
    revealCell(board, 0, 9, 9)
    expect(board[1].revealed).toBe(false)
    expect(board[1].flagged).toBe(true)
  })

  it('stops flood-fill at numbered cells', () => {
    const b = createEmptyBoard(3, 3)
    b[0].mine = true
    b[8].mine = true
    for (let i = 0; i < 9; i++) {
      if (b[i].mine) continue
      b[i].adjacentCount = getNeighbors(i, 3, 3).filter((n) => b[n].mine).length
    }
    const status = revealCell(b, 6, 3, 3)
    expect(b[6].revealed).toBe(true)
    expect(b[3].revealed).toBe(true)
    expect(b[4].revealed).toBe(true)
    expect(b[7].revealed).toBe(true)
    expect(b[1].revealed).toBe(false)
    expect(b[2].revealed).toBe(false)
    expect(b[5].revealed).toBe(false)
    expect(status).not.toBe('lost')
  })
})

describe('toggleFlag advanced', () => {
  it('toggle is idempotent after two calls', () => {
    const board = createEmptyBoard(9, 9)
    toggleFlag(board, 3)
    toggleFlag(board, 3)
    expect(board[3].flagged).toBe(false)
  })

  it('does not affect other cells', () => {
    const board = createEmptyBoard(9, 9)
    toggleFlag(board, 5)
    expect(board[5].flagged).toBe(true)
    expect(board[0].flagged).toBe(false)
    expect(board[10].flagged).toBe(false)
  })
})

describe('countRevealed', () => {
  it('counts all revealed cells', () => {
    const board = createEmptyBoard(9, 9)
    board[0].revealed = true
    board[5].revealed = true
    board[80].revealed = true
    expect(countRevealed(board)).toBe(3)
  })

  it('returns 0 for unrevealed board', () => {
    const board = createEmptyBoard(9, 9)
    expect(countRevealed(board)).toBe(0)
  })
})

describe('checkWin edge cases', () => {
  it('returns true for board with no mines and all revealed', () => {
    const board = createEmptyBoard(3, 3)
    for (const cell of board) {
      cell.revealed = true
    }
    expect(checkWin(board)).toBe(true)
  })

  it('returns false for empty board with nothing revealed', () => {
    const board = createEmptyBoard(3, 3)
    expect(checkWin(board)).toBe(false)
  })

  it('mines can be hidden for win', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    for (let i = 1; i < 9; i++) {
      board[i].revealed = true
    }
    expect(checkWin(board)).toBe(true)
  })
})

describe('full game simulation', () => {
  it('can win a small board by revealing all safe cells', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    for (let i = 0; i < 9; i++) {
      if (board[i].mine) continue
      board[i].adjacentCount = getNeighbors(i, 3, 3).filter((n) => board[n].mine).length
    }
    let status = 'playing'
    for (let i = 0; i < 9; i++) {
      if (board[i].mine || board[i].revealed) continue
      status = revealCell(board, i, 3, 3)
      if (status === 'lost' || status === 'won') break
    }
    expect(status).toBe('won')
  })

  it('flags can be toggled before mines are placed', () => {
    const board = createEmptyBoard(9, 9)
    toggleFlag(board, 10)
    expect(board[10].flagged).toBe(true)
    placeMines(board, 10, 0, 9, 9)
    expect(board[0].mine).toBe(false)
    const status = revealCell(board, 10, 9, 9)
    expect(status).not.toBe('lost')
  })
})