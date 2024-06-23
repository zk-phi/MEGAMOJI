// Binarize transparency for GIF frames before quantization.
//
// This reduces number of colors before quantization, and also
// offers better result by dithering quantization errors.

const THRESHOLD = 80;

export const binarizeTransparency = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const err: number[] = new Array(width * height);
  for (let y = 0; y < height; y++) {
    if (y % 2 === 0) { // iterate from left to right
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const value = data[index * 4 + 3] + (err[index] ?? 0);
        let newErr = 0;
        if (value < THRESHOLD) {
          data[index * 4 + 0] = 0;
          data[index * 4 + 1] = 0;
          data[index * 4 + 2] = 0;
          data[index * 4 + 3] = 0;
          newErr = value;
        } else {
          data[index * 4 + 3] = 255;
          newErr = value - 255;
        }
        // Floyd-steinberg dithering
        if (x + 1 < width) err[y * width + (x + 1)] = newErr * 7/16;
        if (y + 1 < height) {
          if (x - 1 >= 0) err[(y + 1) * width + (x - 1)] = newErr * 3/16;
          err[(y + 1) * width + x] = newErr * 5/16;
          if (x + 1 < width) err[(y + 1) * width + (x + 1)] = newErr * 1/16;
        }
      }
    } else { // iterate from right to left
      for (let x = width - 1; x >= 0; x--) {
        const index = y * width + x;
        const value = data[index * 4 + 3] + (err[index] ?? 0);
        let newErr = 0;
        if (value < THRESHOLD) {
          data[index * 4 + 0] = 0;
          data[index * 4 + 1] = 0;
          data[index * 4 + 2] = 0;
          data[index * 4 + 3] = 0;
          newErr = value;
        } else {
          data[index * 4 + 3] = 255;
          newErr = value - 255;
        }
        // Floyd-steinberg dithering
        if (x - 1 >= 0) err[y * width + (x - 1)] = newErr * 7/16;
        if (y + 1 < height) {
          if (x + 1 < width) err[(y + 1) * width + (x + 1)] = newErr * 3/16;
          err[(y + 1) * width + x] = newErr * 5/16;
          if (x - 1 >= 0) err[(y + 1) * width + (x - 1)] = newErr * 1/16;
        }
      }
    }
  }
};
