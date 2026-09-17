# Minesweeper

Classic Minesweeper built with React, TypeScript, and Vite. Purely client-side.

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Gameplay

- **Easy**: 9×9, 10 mines
- **Medium**: 16×16, 40 mines
- **Hard**: 25×25, 150 mines

Left-click to reveal, right-click to flag. On touch devices, toggle Flag Mode with the 🚩 button.

## Project Structure

```
src/
  game/           Pure game logic + types + constants
    tests/          Gameplay & UI tests
  hooks/          useGame (state reducer), useTimer
  components/     Board, Cell, StatusBar, DifficultySelector
  styles/         Single CSS stylesheet
  test-setup.ts   Vitest + Testing Library setup
```

## Testing

Tests use [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/) for component tests and `jsdom` for DOM simulation.
