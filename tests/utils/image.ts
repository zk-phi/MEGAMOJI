import { readFile } from "node:fs/promises";
import { createCanvas, loadImage, Image } from "canvas";

const decodeImage = (buf: Buffer): Promise<ImageData> => new Promise((resolve) => {
  loadImage(buf).then((img: Image) => {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    resolve(ctx.getImageData(0, 0, img.width, img.height));
  });
});

export const loadFromPath = async (path: string): Promise<ImageData> => (
  await decodeImage(await readFile(path))
);
