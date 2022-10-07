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

/* Load a local file via specified path and call-back with the BlobURL. */
export const loadFileAsBlobURL = (file: File): Promise<string> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as string);
      } else {
        throw new Error("Failed to load file");
      }
    };
    reader.readAsDataURL(file);
  })
);

export const loadFileAsBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error("Failed to load file"));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};
