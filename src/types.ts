type DataURL = string;

// A filter takes an image, and returns filtered image as an DataURL.
export type Filter = (
  image: HTMLImageElement,
) => DataURL;

// An animation takes a CanvasRenderingContext2D and an image, and render
// image to the canvas.
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

// Effects are called with CanvasRenderingContext2D before rendering, and
// expected to configure the canvas. Note that users may enable multiple
// effects at the same time.
export type Effect = (
  // a 0.0 - 1.0 progress of the animation
  keyrame: number,
  // the rendering context to be modified
  ctx: CanvasRenderingContext2D,
  // size of the image to be rendered
  width: number, height: number,
) => void;

// WebGLEffect loads and configures a WebGLProgram, which is then used to effect
// rendered images.
export type WebGLEffect = (
  keyframe: number,
  width: number,
  height: number,
) => WebGLProgram;

// Gradient is a list of colorstops
export type ColorStop = { color: string, pos: number };

export type Easing = (x: number) => number;
