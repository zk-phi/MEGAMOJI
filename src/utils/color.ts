import * as ColorConvert from "color-convert";

export type HSV = { h: number, s: number, v: number };
export type RGB = { r: number, g: number, b: number };
export type HWB = { h: number, w: number, b: number };

export const HSV2RGB = (hsv: HSV): RGB => {
  const ret = ColorConvert.hsv.rgb([hsv.h, hsv.s * 100, hsv.v * 100]);
  return { r: ret[0], g: ret[1], b: ret[2] };
};

export const HWB2HEX = (hwb: HWB): string => {
  const hex = ColorConvert.hwb.hex([hwb.h, hwb.w, hwb.b]);
  return `#${hex}`;
};

export const HEX2HWB = (hexColor: string): HWB => {
  const hwb = ColorConvert.hex.hwb(hexColor);
  return { h: hwb[0], w: hwb[1], b: hwb[2] };
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
