import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Board from '../../components/Board'
import type { CellModel } from '../types'

function makeBoard(rows: number, cols: number, overrides?: Partial<CellModel>): CellModel[] {
  return Array.from({ length: rows * cols }, () => ({
    mine: false,
    adjacentCount: 0,
    revealed: false,
    flagged: false,
    ...overrides,
  }))
}

describe('Board', () => {
  const defaultProps = {
    board: makeBoard(9, 9),
    rows: 9,
    cols: 9,
    status: 'playing' as const,
    minesPlaced: false,
    onReveal: vi.fn(),
    onFlag: vi.fn(),
  }

  it('renders correct number of cells', () => {
    render(<Board {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(81)
  })

  it('renders smaller board correctly', () => {
    render(
      <Board
        {...defaultProps}
        board={makeBoard(3, 3)}
        rows={3}
        cols={3}
      />,
    )
    expect(screen.getAllByRole('button')).toHaveLength(9)
  })

  it('passes correct index to onReveal', () => {
    const onReveal = vi.fn()
    render(<Board {...defaultProps} onReveal={onReveal} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[42])
    expect(onReveal).toHaveBeenCalledWith(42)
  })

  it('passes correct index to onFlag', () => {
    const onFlag = vi.fn()
    render(<Board {...defaultProps} onFlag={onFlag} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.contextMenu(buttons[10])
    expect(onFlag).toHaveBeenCalledWith(10)
  })

  it('applies correct grid style', () => {
    const { container } = render(<Board {...defaultProps} />)
    const boardEl = container.querySelector('.board')
    expect(boardEl).toHaveStyle({
      gridTemplateColumns: 'repeat(9, 1fr)',
      gridTemplateRows: 'repeat(9, 1fr)',
    })
  })

  it('applies custom grid style for 16x16 board', () => {
    const { container } = render(
      <Board
        {...defaultProps}
        board={makeBoard(16, 16)}
        rows={16}
        cols={16}
      />,
    )
    const boardEl = container.querySelector('.board')
    expect(boardEl).toHaveStyle({
      gridTemplateColumns: 'repeat(16, 1fr)',
      gridTemplateRows: 'repeat(16, 1fr)',
    })
  })

  it('shows wrong flag indicators after loss', () => {
    const board = makeBoard(3, 3)
    board[0].flagged = true
    board[1].mine = true
    board[2].flagged = true
    render(
      <Board
        {...defaultProps}
        board={board}
        rows={3}
        cols={3}
        status="lost"
      />,
    )
    expect(screen.getAllByText('❌')).toHaveLength(2)
    expect(screen.queryAllByText('🚩')).toHaveLength(0)
  })

  it('all cells disabled when game is won', () => {
    render(<Board {...defaultProps} status="won" />)
    const buttons = screen.getAllByRole('button')
    for (const btn of buttons) {
      expect(btn).toBeDisabled()
    }
  })

  it('updates cell keys when mines are placed', () => {
    const { rerender } = render(<Board {...defaultProps} />)
    rerender(<Board {...defaultProps} minesPlaced={true} />)
    expect(screen.getAllByRole('button')).toHaveLength(81)
  })
})