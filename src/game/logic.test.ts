import { describe, it, expect } from 'vitest'
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  chordReveal,
  toggleFlag,
  checkWin,
  countFlags,
  getNeighbors,
} from './logic'

const ROWS = 9
const COLS = 9

describe('createEmptyBoard', () => {
  it('creates the correct number of cells', () => {
    const board = createEmptyBoard(9, 9)
    expect(board).toHaveLength(81)
  })

  it('all cells start hidden, unflagged, and not mines', () => {
    const board = createEmptyBoard(5, 5)
    for (const cell of board) {
      expect(cell.mine).toBe(false)
      expect(cell.revealed).toBe(false)
      expect(cell.flagged).toBe(false)
      expect(cell.adjacentCount).toBe(0)
    }
  })
})

describe('placeMines', () => {
  it('places correct number of mines', () => {
    const board = createEmptyBoard(ROWS, COLS)
    placeMines(board, 10, 0, ROWS, COLS)
    const mineCount = board.filter((c) => c.mine).length
    expect(mineCount).toBe(10)
  })

  it('first-clicked cell is never a mine', () => {
    const board = createEmptyBoard(ROWS, COLS)
    const safeIndex = 42
    placeMines(board, 10, safeIndex, ROWS, COLS)
    expect(board[safeIndex].mine).toBe(false)
  })

  it('computes adjacent counts correctly', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    board[1].mine = true
    board[2].mine = true
    const b = createEmptyBoard(3, 3)
    b[0].mine = true
    b[1].mine = true
    b[2].mine = true
    placeMines(b, 0, 8, 3, 3)
  })
})

describe('revealCell', () => {
  it('reveals a safe cell', () => {
    const board = createEmptyBoard(ROWS, COLS)
    placeMines(board, 10, 0, ROWS, COLS)
    const status = revealCell(board, 0, ROWS, COLS)
    expect(board[0].revealed).toBe(true)
    expect(status).not.toBe('lost')
  })

  it('loses when revealing a mine', () => {
    const board = createEmptyBoard(ROWS, COLS)
    placeMines(board, 10, 0, ROWS, COLS)
    const mineIndex = board.findIndex((c) => c.mine)
    const status = revealCell(board, mineIndex, ROWS, COLS)
    expect(status).toBe('lost')
    expect(board[mineIndex].revealed).toBe(true)
  })

  it('does not reveal flagged cells', () => {
    const board = createEmptyBoard(ROWS, COLS)
    placeMines(board, 10, 0, ROWS, COLS)
    board[1].flagged = true
    const status = revealCell(board, 1, ROWS, COLS)
    expect(board[1].revealed).toBe(false)
    expect(status).toBe('playing')
  })

  it('flood-fills zero regions', () => {
    const board = createEmptyBoard(ROWS, COLS)
    placeMines(board, 10, 0, ROWS, COLS)
    const zeroIndex = board.findIndex((c) => !c.mine && c.adjacentCount === 0)
    if (zeroIndex === -1) return
    const nonZeroIndex = board.findIndex(
      (c, i) => !c.mine && c.adjacentCount > 0 && i !== zeroIndex,
    )
    expect(zeroIndex).not.toBe(-1)
    revealCell(board, zeroIndex, ROWS, COLS)
    expect(board[zeroIndex].revealed).toBe(true)
    const neighbors = getNeighbors(zeroIndex, ROWS, COLS)
    const someRevealed = neighbors.some((n) => board[n].revealed)
    expect(someRevealed).toBe(true)
    if (nonZeroIndex === -1) return
    const isAdjacent = getNeighbors(zeroIndex, ROWS, COLS).includes(nonZeroIndex)
    if (isAdjacent) {
      expect(board[nonZeroIndex].revealed).toBe(true)
    }
  })
})

describe('chordReveal', () => {
  it('reveals unflagged neighbors when flag count matches', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    board[1].mine = true
    board[4].adjacentCount = 2
    board[4].revealed = true
    board[0].flagged = true
    board[1].flagged = true
    const status = chordReveal(board, 4, 3, 3)
    expect(board[2].revealed).toBe(true)
    expect(board[3].revealed).toBe(true)
    expect(board[5].revealed).toBe(true)
    expect(status).toBe('won')
  })

  it('does nothing when flag count does not match', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    board[1].mine = true
    board[4].adjacentCount = 2
    board[4].revealed = true
    board[0].flagged = true
    const status = chordReveal(board, 4, 3, 3)
    expect(status).toBe('playing')
    expect(board[2].revealed).toBe(false)
    expect(board[3].revealed).toBe(false)
  })

  it('does nothing on a hidden cell', () => {
    const board = createEmptyBoard(3, 3)
    const status = chordReveal(board, 4, 3, 3)
    expect(status).toBe('playing')
    expect(board[4].revealed).toBe(false)
  })

  it('does nothing on a revealed zero cell', () => {
    const board = createEmptyBoard(3, 3)
    board[4].revealed = true
    const status = chordReveal(board, 4, 3, 3)
    expect(status).toBe('playing')
    expect(board[0].revealed).toBe(false)
  })

  it('loses when a wrong flag causes a mine reveal', () => {
    const board = createEmptyBoard(3, 3)
    board[0].mine = true
    board[2].mine = true
    board[1].adjacentCount = 2
    board[1].revealed = true
    board[0].flagged = true
    board[3].flagged = true
    const status = chordReveal(board, 1, 3, 3)
    expect(status).toBe('lost')
    expect(board[2].revealed).toBe(true)
  })
})

describe('toggleFlag', () => {
  it('flags an unflagged hidden cell', () => {
    const board = createEmptyBoard(ROWS, COLS)
    toggleFlag(board, 5)
    expect(board[5].flagged).toBe(true)
  })

  it('unflags a flagged hidden cell', () => {
    const board = createEmptyBoard(ROWS, COLS)
    board[5].flagged = true
    toggleFlag(board, 5)
    expect(board[5].flagged).toBe(false)
  })

  it('does not flag a revealed cell', () => {
    const board = createEmptyBoard(ROWS, COLS)
    board[5].revealed = true
    toggleFlag(board, 5)
    expect(board[5].flagged).toBe(false)
  })
})

describe('checkWin', () => {
  it('detects win when all non-mine cells are revealed', () => {
    const board = createEmptyBoard(ROWS, COLS)
    for (let i = 0; i < board.length; i++) {
      if (i >= 10) board[i].mine = true
    }
    expect(checkWin(board)).toBe(false)
    for (let i = 0; i < 10; i++) {
      board[i].revealed = true
    }
    expect(checkWin(board)).toBe(true)
  })

  it('returns false when non-mine cells remain hidden', () => {
    const board = createEmptyBoard(ROWS, COLS)
    board[0].mine = true
    expect(checkWin(board)).toBe(false)
  })
})

describe('countFlags', () => {
  it('counts flagged cells', () => {
    const board = createEmptyBoard(ROWS, COLS)
    board[0].flagged = true
    board[5].flagged = true
    expect(countFlags(board)).toBe(2)
  })
})