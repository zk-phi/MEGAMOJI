import { shrinkCanvas } from "./canvas";

type GradientColorStop = { color: string, pos: number };

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
const makeTextImageSingleLine = (
  line: string,
  color: string,
  font: string,
  fontHeight: number,
  outlineColors: string[],
  outlineThickness: number,
  outlineX: number,
  outlineY: number,
  gradient: GradientColorStop[],
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = fontHeight * (line.length || 1) * 2;
  canvas.height = fontHeight * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }

  ctx.font = font.replace(/([0-9.]+)em/, (_, emHeight) => `${fontHeight * emHeight}px`);
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";

  const margin = fontHeight * 0.1;

  const outlineTotalThickness = outlineThickness * (outlineColors.length - 1);
  for (let i = outlineColors.length - 1; i >= 0; i -= 1) {
    ctx.strokeStyle = outlineColors[i];
    ctx.lineWidth = (i + 1) * outlineThickness;
    ctx.strokeText(
      line,
      margin + outlineX * (outlineTotalThickness - ctx.lineWidth) * 0.5,
      margin + outlineY * (outlineTotalThickness - ctx.lineWidth) * 0.5,
    );
  }

  if (gradient.length) {
    const gradientObj = ctx.createLinearGradient(0, 0, 0, fontHeight + margin * 2);
    gradient.forEach((colorStop) => {
      gradientObj.addColorStop(colorStop.pos / 100, colorStop.color);
    });
    ctx.fillStyle = gradientObj;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fillText(
    line,
    margin + outlineX * outlineTotalThickness * 0.5,
    margin + outlineY * outlineTotalThickness * 0.5,
  );

  return shrinkCanvas(canvas);
};

/* Create an image from a (possibly) multi-line text and return as a BlobURL. */
export const makeTextImage = (
  text: string,
  color: string,
  font: string,
  fontHeight: number,
  align: string,
  lineSpacing: number,
  outlineColors: string[],
  outlineThickness: number,
  outlineX: number,
  outlineY: number,
  gradient: GradientColorStop[],
  padding: number,
): HTMLCanvasElement => {
  const lineSpacingPixels = Math.round(lineSpacing * fontHeight);
  const paddingPixels = Math.round(padding * fontHeight);

  const images = text.split("\n").map((line) => (
    makeTextImageSingleLine(
      line,
      color,
      font,
      fontHeight,
      outlineColors,
      outlineThickness,
      outlineX,
      outlineY,
      gradient,
    )
  ));
  const lineWidths = images.map((canvas) => canvas.width);
  const maxWidth = Math.max.apply(null, lineWidths);
  const totalHeight = lineSpacingPixels * (images.length - 1) + images.reduce((l, r) => (
    l + r.height
  ), 0);

  const canvas = document.createElement("canvas");
  canvas.width = maxWidth + (paddingPixels * 2);
  canvas.height = totalHeight + (paddingPixels * 2);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }

  let currentHeight = paddingPixels;
  images.forEach((image, ix) => {
    ctx.save();

    if (align === "right") {
      ctx.translate(maxWidth - lineWidths[ix], 0);
    } else if (align === "center") {
      ctx.translate((maxWidth - lineWidths[ix]) / 2, 0);
    } else if (align === "stretch") {
      ctx.transform(maxWidth / lineWidths[ix], 0, 0, 1, 0, 0);
    }

    ctx.drawImage(image, paddingPixels, currentHeight);
    currentHeight += image.height + lineSpacingPixels;

    ctx.restore();
  });

  return canvas;
};
