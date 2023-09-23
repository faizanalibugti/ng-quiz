interface Coordinates {
  x: number;
  y: number;
}

export type Colors =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'turquoise';

export interface Confetti {
  color: Colors;
  dimensions: Coordinates;
  position: Coordinates;
  rotation: number;
  scale: Coordinates;
  velocity: Coordinates;
}
