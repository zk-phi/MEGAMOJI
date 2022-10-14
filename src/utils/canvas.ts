import { SVG } from "@svgdotjs/svg.js";

export const scaleCentered = (
  ctx: CanvasRenderingContext2D,
  cellWidth: number, cellHeight: number,
  hScale: number, vScale: number,
): void => {
  ctx.transform(
    hScale,
    0, 0,
    vScale,
    cellWidth * (1 - hScale) / 2, cellHeight * (1 - vScale) / 2,
  );
};

export const flipContext = (ctx: CanvasRenderingContext2D, width: number): void => {
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
};

/* Create a new canvas and render specified region of the source canvas. */
export const cropCanvas = (
  source: HTMLCanvasElement,
  left: number, top: number, w: number, h: number,
  fillStyle?: string,
): HTMLCanvasElement => {
  const target = document.createElement("canvas");
  const ctx = target.getContext("2d")!;

  target.width = w;
  target.height = h;

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(source, left, top, w, h, 0, 0, w, h);

  return target;
};

/* drop transparent area from canvas and returns a new cropped canvas */
export const shrinkCanvas = (source: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = source.getContext("2d")!;
  const { data } = ctx.getImageData(0, 0, source.width, source.height);

  let top = 0;
  topLoop: for (; top < source.height; top += 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (data[(top * source.width + x) * 4 + 3]) {
        break topLoop;
      }
    }
  }

  let bottom = source.height - 1;
  bottomLoop: for (; bottom >= top; bottom -= 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (data[(bottom * source.width + x) * 4 + 3]) {
        break bottomLoop;
      }
    }
  }

  let left = 0;
  leftLoop: for (; left < source.width; left += 1) {
    for (let y = top + 1; y < bottom; y += 1) {
      if (data[(y * source.width + left) * 4 + 3]) {
        break leftLoop;
      }
    }
  }

  let right = source.width - 1;
  rightLoop: for (; right >= left; right -= 1) {
    for (let y = top + 1; y < bottom; y += 1) {
      if (data[(y * source.width + right) * 4 + 3]) {
        break rightLoop;
      }
    }
  }

  return cropCanvas(source, left, top, (right - left + 1) || 1, (bottom - top + 1) || 1);
};

/* Split canvas into a 2d-array of canvases */
export const cutoutCanvasIntoCells = (
  source: HTMLCanvasElement,
  offsetH: number, offsetV: number,
  hCells: number, vCells: number, cellWidth: number, cellHeight: number,
): HTMLCanvasElement[][] => {
  const cells = [];
  for (let y = 0; y < vCells; y += 1) {
    const row = [];
    for (let x = 0; x < hCells; x += 1) {
      row.push(
        cropCanvas(
          source,
          offsetH + x * cellWidth, offsetV + y * cellHeight,
          cellWidth, cellHeight,
        ),
      );
    }
    cells.push(row);
  }
  return cells;
};

type Size = { width: number, height: number };

const parseSize = (svgString: string): Size => {
  const rootString = svgString.match("<svg[^>]+>");
  if (!rootString) {
    throw new Error("Failed to get SVG size: the root SVG element is not found.");
  }

  const width = rootString[0].match("width[ \t]*=[ \t]*[\"']([0-9.\\+-]+)(px)?['\"]");
  const height = rootString[0].match("height[ \t]*=[ \t]*[\"']([0-9.\\+-]+)(px)?['\"]");
  if (!width || !height) {
    throw new Error("Failed to get SVG size: both width and height must be specified absolutely.");
  }

  return { width: Number(width[1]), height: Number(height[1]) };
};

/* Create an img object, set src attr to the specified url, and return it. */
export const urlToImg = (url: string, cb: (img: HTMLImageElement) => void): void => {
  const img = document.createElement("img");
  img.src = url;
  img.onload = () => cb(img);
};

export const mergeSVGs = (srcs: string[]): Promise<HTMLImageElement> => new Promise((resolve) => {
  Promise.all(
    srcs.map((src) => fetch(src).then((res) => res.text())),
  ).then((svgStrings) => {
    const draw = SVG();
    const maxSize = { width: 0, height: 0 };
    svgStrings.forEach((svgString) => {
      const svg = draw.svg(svgString);
      svg.flattenNoTransform(svg, 1);
      const size = parseSize(svgString);
      maxSize.width = Math.max(maxSize.width, size.width);
      maxSize.height = Math.max(maxSize.height, size.height);
    });
    draw.size(maxSize.width, maxSize.height);
    urlToImg(`data:image/svg+xml;base64,${btoa(draw.svg())}`, (img) => {
      resolve(img);
    });
  });
});
