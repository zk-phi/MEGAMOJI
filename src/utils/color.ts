import * as ColorConvert from "color-convert";

export type HSV = { h: number, s: number, v: number };
export type HSL = { h: number, s: number, l: number };
export type RGB = { r: number, g: number, b: number };
export type HWB = { h: number, w: number, b: number };

export const HSV2RGB = (hsv: HSV): RGB => {
  const ret = ColorConvert.hsv.rgb([hsv.h, hsv.s * 100, hsv.v * 100]);
  return { r: ret[0], g: ret[1], b: ret[2] };
};

export const HEX2HSV = (hexColor: string): HSV => {
  const hsv = ColorConvert.hex.hsv(hexColor);
  return { h: hsv[0], s: hsv[1], v: hsv[2] };
};

export const HSV2HEX = (hsv: HSV): string => {
  const hex = ColorConvert.hsv.hex([hsv.h, hsv.s, hsv.v]);
  return `#${hex}`;
};

export const HEX2HSL = (hexColor: string): HSL => {
  const hsl = ColorConvert.hex.hsl(hexColor);
  return { h: hsl[0], s: hsl[1], l: hsl[2] };
};

export const HSL2HEX = (hsl: HSL): string => {
  const hex = ColorConvert.hsl.hex([hsl.h, hsl.s, hsl.l]);
  return `#${hex}`;
};

const lighterColor = (hexColor: string): string => {
  const hsl = ColorConvert.hex.hsl(hexColor);
  const newColor = ColorConvert.hsl.hex([hsl[0], hsl[1], Math.min(100, hsl[2] + 20)]);
  return `#${newColor}`;
};

const darkerColor = (hexColor: string): string => {
  const hsl = ColorConvert.hex.hsl(hexColor);
  const newColor = ColorConvert.hsl.hex([hsl[0], hsl[1], Math.max(0, hsl[2] - 15)]);
  return `#${newColor}`;
};

export const absColor = (relColor: string, baseColor: string): string => {
  if (relColor === "darker") {
    return darkerColor(baseColor);
  } else if (relColor === "lighter") {
    return lighterColor(baseColor);
  } else if (relColor === "identical") {
    return baseColor;
  } else {
    return relColor;
  }
};
