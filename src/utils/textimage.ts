import { Font } from "opentype.js";
import { SVG } from "@svgdotjs/svg.js";

type GradientColorStop = { color: string, pos: number };

const OUTLINE_THICKNESS = 1;
const FONT_SIZE = 32;

export const makeTextImage = (
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
      const gradObj = group.gradient("linear", (add) => {
        gradient.forEach((item) => add.stop(item.pos / 100, item.color));
      }).to(0, 1);
      group.path(pathData).fill(gradObj);
    } else {
      group.path(pathData).fill(color);
    }

    return group;
  };

  const lines = text.split("\n").map((line) => {
    if (line === "") return null;
    const obj = drawString(line);
    return { obj, box: obj.bbox() };
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
  return `data:image/svg+xml;base64,${btoa(draw.svg())}`;
};
