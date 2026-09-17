import { useReducer, useCallback } from 'react'
import type { CellModel, GameStatus, Difficulty } from '../game/types'
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  chordReveal,
  toggleFlag,
  countFlags,
  countRevealed,
} from '../game/logic'

interface GameState {
  board: CellModel[]
  status: GameStatus
  rows: number
  cols: number
  totalMines: number
  minesPlaced: boolean
  moves: number
  flagsUsed: number
}

type Action =
  | { type: 'REVEAL'; index: number }
  | { type: 'CHORD'; index: number }
  | { type: 'FLAG'; index: number }
  | { type: 'RESET'; difficulty: Difficulty }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'REVEAL': {
      if (state.status === 'won' || state.status === 'lost') return state

      const board = state.board.map((cell) => ({ ...cell }))
      let minesPlaced = state.minesPlaced

      if (!minesPlaced) {
        placeMines(board, state.totalMines, action.index, state.rows, state.cols)
        minesPlaced = true
      }

      const newStatus = revealCell(board, action.index, state.rows, state.cols)
      return {
        ...state,
        board,
        minesPlaced,
        status: newStatus,
        moves: state.moves + 1,
      }
    }
    case 'CHORD': {
      if (state.status === 'won' || state.status === 'lost') return state
      if (!state.minesPlaced) return state

      const board = state.board.map((cell) => ({ ...cell }))
      const newStatus = chordReveal(board, action.index, state.rows, state.cols)
      if (newStatus === 'playing' && countRevealed(board) === countRevealed(state.board)) {
        return state
      }
      return {
        ...state,
        board,
        status: newStatus,
        moves: state.moves + 1,
      }
    }
    case 'FLAG': {
      if (state.status === 'won' || state.status === 'lost') return state
      const board = state.board.map((cell) => ({ ...cell }))
      toggleFlag(board, action.index)
      return {
        ...state,
        board,
        flagsUsed: countFlags(board),
      }
    }
    case 'RESET': {
      const { rows, cols, mines } = action.difficulty
      return {
        board: createEmptyBoard(rows, cols),
        status: 'ready',
        rows,
        cols,
        totalMines: mines,
        minesPlaced: false,
        moves: 0,
        flagsUsed: 0,
      }
    }
    default:
      return state
  }
}

export function useGame(initialDifficulty: Difficulty) {
  const { rows, cols, mines } = initialDifficulty
  const [state, dispatch] = useReducer(reducer, {
    board: createEmptyBoard(rows, cols),
    status: 'ready',
    rows,
    cols,
    totalMines: mines,
    minesPlaced: false,
    moves: 0,
    flagsUsed: 0,
  })

  const reveal = useCallback((index: number) => {
    dispatch({ type: 'REVEAL', index })
  }, [])

  const chord = useCallback((index: number) => {
    dispatch({ type: 'CHORD', index })
  }, [])

  const flag = useCallback((index: number) => {
    dispatch({ type: 'FLAG', index })
  }, [])

  const reset = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'RESET', difficulty })
  }, [])

  return {
    ...state,
    reveal,
    chord,
    flag,
    reset,
  }
}