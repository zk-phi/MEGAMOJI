import { Font } from "opentype.js";
import { SVG } from "@svgdotjs/svg.js";
import { shrinkCanvas } from "./canvas";

type GradientColorStop = { color: string, pos: number };

/* Create a new canvas and render a single-line text. Returns the cropped canvas object. */
const makeTextImageSingleLine = (
  line: string, color: string, font: string,
  fontHeight: number, outlineColors: string[], gradient: GradientColorStop[],
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = fontHeight * (line.length || 1) * 2;
  canvas.height = fontHeight * 2;

  const ctx = canvas.getContext("2d")!;
  ctx.font = font.replace(/([0-9.]+)em/, (_, emHeight) => `${fontHeight * emHeight}px`);
  ctx.textBaseline = "top";
  ctx.miterLimit = 6.0;

  const margin = fontHeight * 0.025;

  for (let i = outlineColors.length - 1; i >= 0; i -= 1) {
    ctx.strokeStyle = outlineColors[i];
    ctx.lineWidth = (i + 1) * 8;
    ctx.strokeText(line, margin, margin);
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
  ctx.fillText(line, margin, margin);

  return shrinkCanvas(canvas);
};

/* Create an image from a (possibly) multi-line text and return as a BlobURL. */
export const makeTextImage = (
  text: string, color: string, font: string, fontHeight: number,
  align: string, lineSpacing: number, outlineColors: string[], gradient: GradientColorStop[],
): string => {
  const images = text.split("\n").map((line) => (
    makeTextImageSingleLine(line, color, font, fontHeight, outlineColors, gradient)
  ));
  const lineWidths = images.map((canvas) => canvas.width);
  const maxWidth = Math.max.apply(null, lineWidths);
  const totalHeight = lineSpacing * (images.length - 1) + images.reduce((l, r) => (
    l + r.height
  ), 0);

  const canvas = document.createElement("canvas");
  canvas.width = maxWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext("2d")!;

  let currentHeight = 0;
  images.forEach((image, ix) => {
    ctx.save();

    if (align === "right") {
      ctx.translate(maxWidth - lineWidths[ix], 0);
    } else if (align === "center") {
      ctx.translate((maxWidth - lineWidths[ix]) / 2, 0);
    } else if (align === "stretch") {
      ctx.transform(maxWidth / lineWidths[ix], 0, 0, 1, 0, 0);
    }

    ctx.drawImage(image, 0, currentHeight);
    currentHeight += image.height + lineSpacing;

    ctx.restore();
  });

  return canvas.toDataURL();
};

const OUTLINE_THICKNESS = 1;
const FONT_SIZE = 32;
export const makeTextImageSVG = (
  text: string, color: string, font: Font, align: string,
  lineSpacing: number, outlineColors: string[], gradient: GradientColorStop[],
): string => {
  const draw = SVG();

  const outlineTotal = outlineColors.length * OUTLINE_THICKNESS;

  const drawString = (string: string) => {
    const group = draw.group();
    const pathData = font.getPath(string, 0, 0, FONT_SIZE).toPathData(2);
    [...outlineColors].reverse().forEach((outline, ix) => group.path(pathData).stroke({
      color: outline,
      width: (outlineTotal - ix * OUTLINE_THICKNESS) * 2,
      linejoin: "round",
    }));
    if (gradient.length) {
      const gradObj = group.gradient("linear", add => {
        gradient.forEach(item => add.stop(item.pos / 100, item.color));
      }).to(0, 1);
      group.path(pathData).fill(gradObj);
    } else {
      group.path(pathData).fill(color);
    }

    return group;
  };

  const lines = text.split("\n").map(line => {
    if (line !== "") {
      const obj = drawString(line);
      return { obj, box: obj.bbox() };
    }
  });
  const maxWidth = lines.reduce((l, r) => Math.max(l, r ? r.box.width + outlineTotal * 2 : 0), 0);
  let yposn = 0;
  lines.forEach((line, ix) => {
    if (line) {
      const spacing = line.box.height * (ix > 0 ? lineSpacing : 0);
      line.obj.move(outlineTotal, yposn + spacing + outlineTotal);
      if (align === "right") {
        line.obj.dx(maxWidth - line.box.width - outlineTotal * 2);
      } else if (align === "stretch") {
        line.obj.scale(maxWidth / (line.box.width + outlineTotal * 2), 1, 0, 0);
      } else if (align === "center") {
        line.obj.dx((maxWidth - line.box.width - outlineTotal * 2) / 2);
      }
      yposn += spacing + line.box.height + outlineTotal * 2;
    } else {
      yposn += FONT_SIZE * (1 + lineSpacing) + outlineTotal * 2;
    }
  });

  draw.size(maxWidth, yposn);
  return "data:image/svg+xml;base64," + btoa(draw.svg());
};
