export type HSV = { h: number, s: number, v: number };
export type RGB = { r: number, g: number, b: number };

// taken from https://qiita.com/hachisukansw/items/633d1bf6baf008e82847
// see also: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
export const HSV2RGB = (hsv: HSV): RGB => {
  const C = hsv.v * hsv.s;
  const Hp = (hsv.h % 360) / 60;
  const X = C * (1 - Math.abs(Hp % 2 - 1));

  const RGB = Hp < 1 ? (
    [C, X, 0]
  ) : Hp < 2 ? (
    [X, C, 0]
  ) : Hp < 3 ? (
    [0, C, X]
  ) : Hp < 4 ? (
    [0, X, C]
  ) : Hp < 5 ? (
    [X, 0, C]
  ) : (
    [C, 0, X]
  );

  const m = hsv.v - C;
  return {
    r: Math.floor((RGB[0] + m) * 255),
    g: Math.floor((RGB[1] + m) * 255),
    b: Math.floor((RGB[2] + m) * 255),
  };
};

const HEX2RGB = (hex: string): RGB => {
  return {
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16),
  };
};

const intToByte = (int: number): string => {
  const str = Number(int).toString(16);
  if (str.length < 2) {
    return `0${str}`;
  } else {
    return str;
  }
};

export const lighterColor = (hexColor: string): string => {
  const rgb = HEX2RGB(hexColor);
  const newRgb = {
    r: Math.min(255, rgb.r + 96),
    g: Math.min(255, rgb.g + 96),
    b: Math.min(255, rgb.b + 96),
  };
  return `#${intToByte(newRgb.r)}${intToByte(newRgb.g)}${intToByte(newRgb.b)}`;
};

export const darkerColor = (hexColor: string): string => {
  const rgb = HEX2RGB(hexColor);
  const newRgb = {
    r: Math.max(0, rgb.r - 64),
    g: Math.max(0, rgb.g - 64),
    b: Math.max(0, rgb.b - 64),
  };
  return `#${intToByte(newRgb.r)}${intToByte(newRgb.g)}${intToByte(newRgb.b)}`;
};
