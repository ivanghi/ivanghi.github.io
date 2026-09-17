import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Cell from '../../components/Cell'
import type { CellModel } from '../types'

function makeCell(overrides: Partial<CellModel> = {}): CellModel {
  return {
    mine: false,
    adjacentCount: 0,
    revealed: false,
    flagged: false,
    ...overrides,
  }
}

describe('Cell', () => {
  describe('hidden state', () => {
    it('renders empty hidden cell', () => {
      render(
        <Cell
          cell={makeCell()}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('cell')
      expect(btn).toHaveClass('hidden')
      expect(btn).toBeEnabled()
      expect(btn).toHaveAttribute('aria-label', 'cell-hidden')
      expect(btn).toBeEmptyDOMElement()
    })

    it('renders flagged cell', () => {
      render(
        <Cell
          cell={makeCell({ flagged: true })}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('flagged')
      expect(btn).toHaveAttribute('aria-label', 'cell-flagged')
      expect(btn.textContent).toBe('🚩')
    })

    it('renders wrong flag indicator after game over', () => {
      render(
        <Cell
          cell={makeCell({ flagged: true })}
          gameOver={true}
          wrongFlag={true}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      expect(screen.getByRole('button').textContent).toBe('❌')
    })
  })

  describe('revealed state', () => {
    it('renders revealed empty cell', () => {
      render(
        <Cell
          cell={makeCell({ revealed: true })}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('revealed')
      expect(btn).toHaveAttribute('aria-label', 'cell-revealed')
      expect(btn).toBeDisabled()
    })

    it('renders mine cell', () => {
      render(
        <Cell
          cell={makeCell({ revealed: true, mine: true })}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('mine')
      expect(btn).toHaveAttribute('aria-label', 'cell-mine')
      expect(btn.textContent).toBe('💣')
    })

    it('renders numbered cell with correct color', () => {
      render(
        <Cell
          cell={makeCell({ revealed: true, adjacentCount: 3 })}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveClass('numbered')
      expect(btn).toHaveStyle({ color: '#ff0000' })
      expect(btn.textContent).toBe('3')
    })
  })

  describe('interactions', () => {
    it('calls onReveal on left-click', () => {
      const onReveal = vi.fn()
      render(
        <Cell
          cell={makeCell()}
          gameOver={false}
          wrongFlag={false}
          onReveal={onReveal}
          onFlag={vi.fn()}
        />,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(onReveal).toHaveBeenCalledTimes(1)
    })

    it('calls onFlag on right-click', () => {
      const onFlag = vi.fn()
      render(
        <Cell
          cell={makeCell()}
          gameOver={false}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={onFlag}
        />,
      )
      fireEvent.contextMenu(screen.getByRole('button'))
      expect(onFlag).toHaveBeenCalledTimes(1)
    })

    it('disables button when game is over', () => {
      render(
        <Cell
          cell={makeCell()}
          gameOver={true}
          wrongFlag={false}
          onReveal={vi.fn()}
          onFlag={vi.fn()}
        />,
      )
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not call onReveal for revealed cell', () => {
      const onReveal = vi.fn()
      render(
        <Cell
          cell={makeCell({ revealed: true })}
          gameOver={false}
          wrongFlag={false}
          onReveal={onReveal}
          onFlag={vi.fn()}
        />,
      )
      fireEvent.click(screen.getByRole('button'))
      expect(onReveal).not.toHaveBeenCalled()
    })
  })
})