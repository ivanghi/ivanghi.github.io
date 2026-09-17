import { StrictMode, type ReactNode } from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGame } from '../../hooks/useGame'
import { DIFFICULTIES } from '../../game/constants'

function StrictWrapper({ children }: { children: ReactNode }) {
  return <StrictMode>{children}</StrictMode>
}

describe('StrictMode reducer-purity regressions', () => {
  it('flag persists after a flag dispatch (reducer must be pure)', () => {
    const { result } = renderHook(() => useGame(DIFFICULTIES[0]), {
      wrapper: StrictWrapper,
    })
    act(() => {
      result.current.flag(5)
    })
    expect(result.current.board[5].flagged).toBe(true)
  })

  it('places exactly totalMines on first reveal', () => {
    const { result } = renderHook(() => useGame(DIFFICULTIES[0]), {
      wrapper: StrictWrapper,
    })
    act(() => {
      result.current.reveal(0)
    })
    const mineCount = result.current.board.filter((c) => c.mine).length
    expect(mineCount).toBe(DIFFICULTIES[0].mines)
  })

  it('transitions to lost when a mine is revealed', () => {
    const { result } = renderHook(() => useGame(DIFFICULTIES[0]), {
      wrapper: StrictWrapper,
    })
    act(() => {
      result.current.reveal(0)
    })
    const mineIndex = result.current.board.findIndex((c) => c.mine)
    act(() => {
      result.current.reveal(mineIndex)
    })
    expect(result.current.status).toBe('lost')
  })
})
