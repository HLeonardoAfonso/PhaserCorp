import type { Direction, Position } from "./types";

export const DIRECTIONS: Direction[] = ['right', 'down', 'left', 'up'];

export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const DIR_OFFSET: Record<Direction, Position> = {
  up:    { x:  0, y: -1 },
  down:  { x:  0, y:  1 },
  left:  { x: -1, y:  0 },
  right: { x:  1, y:  0 },
};

export function turnLeft(d: Direction): Direction {
  return ({ up: 'left', left: 'down', down: 'right', right: 'up' } as const)[d];
}

export function turnRight(d: Direction): Direction {
  return ({ up: 'right', right: 'down', down: 'left', left: 'up' } as const)[d];
}