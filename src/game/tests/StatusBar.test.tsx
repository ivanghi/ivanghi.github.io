import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StatusBar from '../../components/StatusBar'

describe('StatusBar', () => {
  const defaultProps = {
    mineDisplay: 10,
    elapsed: 42,
    moves: 5,
    status: 'playing' as const,
    flagMode: false,
    onReset: vi.fn(),
    onToggleFlagMode: vi.fn(),
  }

  it('renders mine counter', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.getByText('010')).toBeInTheDocument()
  })

  it('renders elapsed timer padded', () => {
    render(<StatusBar {...defaultProps} />)
    expect(screen.getByText('042')).toBeInTheDocument()
  })

  it('renders move counter', () => {
    render(<StatusBar {...defaultProps} moves={7} />)
    expect(screen.getByText('007')).toBeInTheDocument()
  })

  it('renders reset button with correct emoji for playing', () => {
    render(<StatusBar {...defaultProps} />)
    const resetBtn = screen.getByRole('button', { name: 'Reset game' })
    expect(resetBtn.textContent).toBe('🙂')
  })

  it('shows won emoji', () => {
    render(<StatusBar {...defaultProps} status="won" />)
    expect(screen.getByRole('button', { name: 'Reset game' }).textContent).toBe('😎')
  })

  it('shows lost emoji', () => {
    render(<StatusBar {...defaultProps} status="lost" />)
    expect(screen.getByRole('button', { name: 'Reset game' }).textContent).toBe('😵')
  })

  it('shows ready emoji', () => {
    render(<StatusBar {...defaultProps} status="ready" />)
    expect(screen.getByRole('button', { name: 'Reset game' }).textContent).toBe('🙂')
  })

  it('calls onReset when reset button clicked', () => {
    const onReset = vi.fn()
    render(<StatusBar {...defaultProps} onReset={onReset} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reset game' }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('renders flag toggle button', () => {
    render(<StatusBar {...defaultProps} />)
    const flagBtn = screen.getByRole('button', { name: 'Toggle flag mode' })
    expect(flagBtn).toBeInTheDocument()
    expect(flagBtn.textContent).toBe('🚩')
  })

  it('calls onToggleFlagMode when flag button clicked', () => {
    const onToggleFlagMode = vi.fn()
    render(<StatusBar {...defaultProps} onToggleFlagMode={onToggleFlagMode} />)
    fireEvent.click(screen.getByRole('button', { name: 'Toggle flag mode' }))
    expect(onToggleFlagMode).toHaveBeenCalledTimes(1)
  })

  it('adds active class when flagMode is on', () => {
    render(<StatusBar {...defaultProps} flagMode={true} />)
    expect(screen.getByRole('button', { name: 'Toggle flag mode' })).toHaveClass('active')
  })

  it('pads single-digit values correctly', () => {
    render(<StatusBar {...defaultProps} elapsed={5} mineDisplay={3} moves={0} />)
    const counterTexts = screen.getAllByText(/^\d{3}$/)
    const textValues = counterTexts.map((el) => el.textContent).sort()
    expect(textValues).toContain('000')
    expect(textValues).toContain('003')
    expect(textValues).toContain('005')
  })

  it('clamps values at 999', () => {
    render(<StatusBar {...defaultProps} mineDisplay={1500} elapsed={2000} moves={5000} />)
    const nineElements = screen.getAllByText('999')
    expect(nineElements).toHaveLength(3)
  })

  it('clamps negative values to 0', () => {
    render(<StatusBar {...defaultProps} mineDisplay={-5} />)
    const counterTexts = screen.getAllByText(/^\d{3}$/)
    const textValues = counterTexts.map((el) => el.textContent)
    expect(textValues).toContain('000')
  })
})