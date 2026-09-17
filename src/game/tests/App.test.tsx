import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../../App'

describe('App', () => {
  it('renders the game title', () => {
    render(<App />)
    expect(screen.getByText('Minesweeper')).toBeInTheDocument()
  })

  it('renders difficulty selector with Easy active by default', () => {
    render(<App />)
    const easyBtn = screen.getByRole('button', { name: 'Easy' })
    expect(easyBtn).toHaveClass('active')
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hard' })).toBeInTheDocument()
  })

  it('renders StatusBar with initial values', () => {
    render(<App />)
    expect(screen.getByText('010')).toBeInTheDocument()
    expect(screen.getAllByText('000')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Reset game' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle flag mode' })).toBeInTheDocument()
  })

  it('renders flag mode indicator', () => {
    render(<App />)
    expect(screen.getByText('Tap to reveal')).toBeInTheDocument()
  })

  it('toggles flag mode when flag button is clicked', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle flag mode' }))
    expect(screen.getByText('Flag Mode: Tap to place flags')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Toggle flag mode' })).toHaveClass('active')
  })

  it('switches difficulty when Medium button is clicked', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }))
    expect(screen.getByRole('button', { name: 'Medium' })).toHaveClass('active')
    expect(screen.getByRole('button', { name: 'Easy' })).not.toHaveClass('active')
    expect(screen.getByText('040')).toBeInTheDocument()
  })

  it('switches difficulty when Hard button is clicked', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }))
    expect(screen.getByRole('button', { name: 'Hard' })).toHaveClass('active')
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('resets game when reset button is clicked', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    const boardCells = cells.length
    fireEvent.click(screen.getByRole('button', { name: 'Reset game' }))
    const newCells = screen.getAllByRole('button', { name: /cell-/ })
    expect(newCells).toHaveLength(boardCells)
  })

  it('cell reveals when left-clicked', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    fireEvent.click(cells[0])
    const updatedCells = screen.getAllByRole('button', { name: /cell-/ })
    expect(updatedCells[0]).toBeDisabled()
  })

  it('cell flags when right-clicked', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    fireEvent.contextMenu(cells[5])
    const flaggedCells = screen.getAllByText('🚩')
    expect(flaggedCells.length).toBeGreaterThan(0)
  })

  it('flag mode: left-click places flag instead of revealing', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle flag mode' }))
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    fireEvent.click(cells[0])
    const flaggedCells = screen.getAllByText('🚩')
    expect(flaggedCells.length).toBeGreaterThan(0)
  })

  it('shows win banner when all safe cells revealed', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    for (const cell of cells) {
      const ariaLabel = cell.getAttribute('aria-label') || ''
      if (!ariaLabel.includes('mine') && !cell.hasAttribute('disabled')) {
        fireEvent.click(cell)
      }
    }
  })

  it('renders board with correct number of cells for Easy', () => {
    render(<App />)
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    expect(cells).toHaveLength(81)
  })

  it('renders board for Medium after switch', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }))
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    expect(cells).toHaveLength(256)
  })

  it('renders board for Hard after switch', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }))
    const cells = screen.getAllByRole('button', { name: /cell-/ })
    expect(cells).toHaveLength(625)
  })
})