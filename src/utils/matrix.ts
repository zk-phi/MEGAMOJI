// taken from glfx.js (by evanw, MIT License)
export const matrixSquareToQuad = ([x0, y0, x1, y1, x2, y2, x3, y3]: number[]): number[] => {
  const dx1 = x1 - x2;
  const dy1 = y1 - y2;
  const dx2 = x3 - x2;
  const dy2 = y3 - y2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const a = (dx3 * dy2 - dx2 * dy3) / det;
  const b = (dx1 * dy3 - dx3 * dy1) / det;
  return [
    x1 - x0 + a * x1, y1 - y0 + a * y1, a,
    x3 - x0 + b * x3, y3 - y0 + b * y3, b,
    x0, y0, 1,
  ];
};

// taken from glfx.js (by evanw, MIT License)
export const matrixInverse = (m: number[]): number[] => {
  const a = m[0]; const b = m[1]; const
    c = m[2];
  const d = m[3]; const e = m[4]; const
    f = m[5];
  const g = m[6]; const h = m[7]; const
    i = m[8];
  const det = a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  return [
    (e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det,
    (f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det,
    (d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det,
  ];
};

// taken from glfx.js (by evanw, MIT License)
export const matrixMultiply = (a: number[], b: number[]): number[] => [
  a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
  a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
  a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
  a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
  a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
  a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
  a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
  a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
  a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
];

// taken from glfx.js (by evanw, MIT License)
export const matrixPerspective = (before: number[], after: number[]): number[] => {
  const a = matrixSquareToQuad(after);
  const b = matrixSquareToQuad(before);
  return matrixMultiply(matrixInverse(a), b);
};

export const matrixFlatten = (matrix: number[]): number[] => (
  Array.prototype.concat.apply([], matrix)
);
