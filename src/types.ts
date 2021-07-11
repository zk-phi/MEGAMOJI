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

// An effect takes a 2d rendering context and makes modifications to it.
// Note that users can enable multiple effects at the same time.
export type Effect = (
  // a 0.0 - 1.0 progress of the animation
  keyrame: number,
  // the rendering context to be modified
  ctx: CanvasRenderingContext2D,
  // size of the image to be rendered
  width: number, height: number,
) => void;

export type PostEffect = (
  keyframe: number, ctx: CanvasRenderingContext2D, width: number, height: number,
) => void;

export type WebGLEffect = (keyframe: number, width: number, height: number) => WebGLProgram;
