/**
 * Like ctx.drawImage, but accepts arguments like:
 *
 * 1. sLeft < 0
 * 2. sLeft + sWidth > image.width
 */
export const fixDrawImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  sLeft: number,
  sTop: number,
  sWidth: number,
  sHeight: number,
  tLeft: number,
  tTop: number,
  tWidth: number,
  tHeight: number,
): void => {
  const maxWidth = image instanceof HTMLImageElement ? image.naturalWidth : image.width;
  const maxHeight = image instanceof HTMLImageElement ? image.naturalHeight : image.height;
  const xScale = tWidth / sWidth;
  const yScale = tHeight / sHeight;

  let params = { sLeft, sTop, sWidth, sHeight, tLeft, tTop, tWidth, tHeight };

  if (params.sLeft < 0) {
    params = {
      ...params,
      sLeft: params.sLeft + (-params.sLeft), // = 0
      tLeft: params.tLeft + (-params.sLeft) * xScale,
      sWidth: params.sWidth - (-params.sLeft),
      tWidth: params.tWidth - (-params.sLeft) * xScale,
    };
  }

  if (params.sTop < 0) {
    params = {
      ...params,
      sTop: params.sTop + (-params.sTop), // = 0
      tTop: params.tTop + (-params.sTop) * yScale,
      sHeight: params.sHeight - (-params.sTop),
      tHeight: params.tHeight - (-params.sTop) * yScale,
    };
  }

  if (params.sLeft + params.sWidth > maxWidth) {
    params = {
      ...params,
      sWidth: params.sWidth - (params.sLeft + params.sWidth - maxWidth), // = maxWidth - sLeft
      tWidth: params.tWidth - (params.sLeft + params.sWidth - maxWidth) * xScale,
    };
  }

  if (params.sTop + params.sHeight > maxHeight) {
    params = {
      ...params,
      sHeight: params.sHeight - (params.sTop + params.sHeight - maxHeight), // = maxHeight - sTop
      tHeight: params.tHeight - (params.sTop + params.sHeight - maxHeight) * yScale,
    };
  }

  ctx.drawImage(
    image,
    params.sLeft,
    params.sTop,
    params.sWidth,
    params.sHeight,
    params.tLeft,
    params.tTop,
    params.tWidth,
    params.tHeight,
  );
};

export const scaleCentered = (
  ctx: CanvasRenderingContext2D,
  cellWidth: number,
  cellHeight: number,
  hScale: number,
  vScale: number,
): void => {
  ctx.transform(
    hScale,
    0,
    0,
    vScale,
    cellWidth * (1 - hScale) / 2,
    cellHeight * (1 - vScale) / 2,
  );
};

export const flipContext = (ctx: CanvasRenderingContext2D, width: number): void => {
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
};

/* Create a new canvas and render specified region of the source canvas. */
export const cropCanvas = (
  source: HTMLCanvasElement,
  left: number,
  top: number,
  w: number,
  h: number,
  fillStyle?: string,
): HTMLCanvasElement => {
  const target = document.createElement("canvas");

  target.width = w;
  target.height = h;

  const ctx = target.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(source, left, top, w, h, 0, 0, w, h);

  return target;
};

/* drop transparent area from canvas and returns a new cropped canvas */
export const shrinkCanvas = (source: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = source.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }

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
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  cellWidth: number,
  cellHeight: number,
): HTMLCanvasElement[][] => {
  const cells = [];
  for (let y = 0; y < vCells; y += 1) {
    const row = [];
    for (let x = 0; x < hCells; x += 1) {
      row.push(
        cropCanvas(
          source,
          offsetH + x * cellWidth,
          offsetV + y * cellHeight,
          cellWidth,
          cellHeight,
        ),
      );
    }
    cells.push(row);
  }
  return cells;
};

/* Create an img object, set src attr to the specified url, and return it. */
export const urlToImg = (url: string, cb: (img: HTMLImageElement) => void): void => {
  const img = document.createElement("img");
  img.src = url;
  img.onload = () => cb(img);
};

export const mergeImages = (
  w: number,
  h: number,
  srcs: string[],
): Promise<HTMLCanvasElement> => new Promise((resolve) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }

  let ix = 0;
  const img = document.createElement("img");
  img.onload = () => {
    ctx.drawImage(img, 0, 0, w, h);
    ix += 1;
    if (ix === srcs.length) {
      resolve(canvas);
    } else {
      img.src = srcs[ix];
    }
  };
  img.src = srcs[0];
});
