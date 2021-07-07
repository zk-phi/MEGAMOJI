import filterChromakey from "./filters/chromakey";

export type Filter = (image: HTMLImageElement) => string;

export const FILTERS = [
  { fn: filterChromakey, label: "クロマキー透過 (左上から)" },
];
