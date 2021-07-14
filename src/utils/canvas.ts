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

/* Merge images into one image and return as a BlobURL. */
export const mergeImages = (
  w: number, h: number, srcs: string[], callback: (bloburl: string) => void,
): void => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = w;
  canvas.height = h;

  let ix = 0;
  const img = document.createElement("img");

  img.onload = () => {
    ctx.drawImage(img, 0, 0, w, h);
    ix += 1;
    if (ix === srcs.length) {
      callback(canvas.toDataURL());
    } else {
      img.src = srcs[ix];
    }
  };

  img.src = srcs[0];
};

/* Load a local image via specified path and call-back with the BlobURL of the loaded image. */
export const loadFileAsBlobURL = (path: File): Promise<string> => (
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      } else {
        throw new Error("Failed to load file");
      }
    };
    reader.readAsDataURL(path);
  })
);

/* Create an img object, set src attr to the specified url, and return it. */
export const urlToImg = (url: string, cb: (img: HTMLImageElement) => void): void => {
  const img = document.createElement("img");
  img.src = url;
  img.onload = () => cb(img);
};
