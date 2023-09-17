interface Coordinates {
  x: number;
  y: number;
}

interface ColorPlacement {
  front: string;
  back: string;
}

export interface Confetti {
  color: ColorPlacement;
  dimensions: Coordinates;
  position: Coordinates;
  rotation: number;
  scale: Coordinates;
  velocity: Coordinates;
}
