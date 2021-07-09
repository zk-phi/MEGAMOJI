export type Filter = (image: HTMLImageElement) => string;

export type Animation = (
  // a 0.0 - 1.0 progress of the animation
  keyframe: number,
  // a (possively) effected 2d rendering context
  ctx: CanvasRenderingContext2D,
// the source image to be rendered
  image: HTMLImageElement,
// range of the source image to be rendered
  offsetH: number, offsetV: number, width: number, height: number,
// size of the image to be rendered
  cellWidth: number, cellHeight: number,
) => void;
