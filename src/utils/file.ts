import * as Zip from "jszip";

export const extension = (blob: Blob): string => blob.type.split("/")[1];

export const prepareDownloadFile = (images: Blob[][]): Promise<Blob> => {
  if (images.length === 1 && images[0].length === 1) {
    return Promise.resolve(images[0][0]);
  } else {
    const zip = new Zip();
    images.forEach((row, i) => row.forEach((cell, j) => {
      zip.file(`${i + 1}-${j + 1}.${extension(cell)}`, cell);
    }));
    return zip.generateAsync({ type: "blob" });
  }
};
