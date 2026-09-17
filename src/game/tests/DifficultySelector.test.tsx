import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DifficultySelector from '../../components/DifficultySelector'
import { DIFFICULTIES } from '../constants'

describe('DifficultySelector', () => {
  it('renders all difficulty buttons', () => {
    render(
      <DifficultySelector
        current={DIFFICULTIES[0]}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Easy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hard' })).toBeInTheDocument()
  })

  it('highlights the current difficulty', () => {
    render(
      <DifficultySelector
        current={DIFFICULTIES[1]}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Medium' })).toHaveClass('active')
    expect(screen.getByRole('button', { name: 'Easy' })).not.toHaveClass('active')
    expect(screen.getByRole('button', { name: 'Hard' })).not.toHaveClass('active')
  })

  it('calls onChange with the correct difficulty when clicked', () => {
    const onChange = vi.fn()
    render(
      <DifficultySelector
        current={DIFFICULTIES[0]}
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Hard' }))
    expect(onChange).toHaveBeenCalledWith(DIFFICULTIES[2])
  })

  it('calls onChange with Medium difficulty', () => {
    const onChange = vi.fn()
    render(
      <DifficultySelector
        current={DIFFICULTIES[0]}
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }))
    expect(onChange).toHaveBeenCalledWith(DIFFICULTIES[1])
  })

  it('renders exactly 3 buttons', () => {
    const { container } = render(
      <DifficultySelector
        current={DIFFICULTIES[0]}
        onChange={vi.fn()}
      />,
    )
    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(3)
  })
})