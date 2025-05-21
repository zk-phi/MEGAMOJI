import { Animation, Effect, WebGLEffect, Easing } from "../types";
import { webglApplyEffects, webglInitialize } from "./webgl";
import { cropCanvas, cutoutCanvasIntoCells, fixDrawImage } from "./canvas";

const webglEnabled = webglInitialize();

const renderFrameUncut = async (
  keyframe: number,
  image: HTMLImageElement | HTMLCanvasElement,
  offsetH: number,
  offsetV: number,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  noCrop: boolean,
  animation: Animation | null,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  framerate: number,
  framecount: number,
  fillStyle: string,
): Promise<HTMLCanvasElement> => {
  /* use larger canvas, because some effects may translate the canvas */
  let canvas = document.createElement("canvas");
  canvas.width = targetWidth * 2;
  canvas.height = targetHeight * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get rendering context.");
  }
  ctx.imageSmoothingQuality = "high";

  effects.forEach((effect) => {
    effect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
  });

  if (animation) {
    await animation(
      keyframe,
      ctx,
      image,
      offsetH,
      offsetV,
      width,
      height,
      targetWidth * 2,
      targetHeight * 2,
    );
  } else {
    const left = offsetH - width / 2;
    const top = offsetV - height / 2;
    await fixDrawImage(
      ctx,
      image,
      left,
      top,
      width * 2,
      height * 2,
      0,
      0,
      targetWidth * 2,
      targetHeight * 2,
    );
  }

  if (webglEffects.length && webglEnabled) {
    // canvas here is a webgl canvas
    canvas = webglApplyEffects(canvas, keyframe, webglEffects);
  }

  if (noCrop) {
    // copy webgl canvas to a 2d canvas, with background
    const result = cropCanvas(canvas, 0, 0, targetWidth * 2, targetHeight * 2, fillStyle);
    const resultCtx = result.getContext("2d")!;
    resultCtx.rect(targetWidth / 2, targetHeight / 2, targetWidth, targetHeight);
    resultCtx.strokeStyle = "#8888";
    resultCtx.stroke();
    return result;
  } else {
    return cropCanvas(
      canvas,
      targetWidth / 2,
      targetHeight / 2,
      targetWidth,
      targetHeight,
      fillStyle,
    );
  }
};

/**
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 * each images may exceed binarySizeLimit.
 */
const renderAllCellsFixedSize = async (
  image: HTMLImageElement | HTMLCanvasElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number,
  noCrop: boolean,
  animated: boolean,
  animation: Animation | null,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  easing: Easing,
  framerate: number,
  framecount: number,
  backgroundColor: string,
  transparent: boolean,
): Promise<Blob[][]> => {
  const roundedTargetWidth = Math.round(targetWidth);
  const roundedTargetHeight = Math.round(targetHeight);
  const croppedWidth = roundedTargetWidth * (noCrop ? 2 : 1);
  const croppedHeight = roundedTargetHeight * (noCrop ? 2 : 1);
  if (!animated) {
    const img = await renderFrameUncut(
      0,
      image,
      offsetH,
      offsetV,
      srcWidth,
      srcHeight,
      roundedTargetWidth * hCells,
      roundedTargetHeight * vCells,
      noCrop,
      animation,
      animationInvert,
      effects,
      webglEffects,
      framerate,
      framecount,
      transparent ? "rgba(0, 0, 0, 0)" : backgroundColor,
    );
    const cells = cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, croppedWidth, croppedHeight);
    return Promise.all<Blob[]>(cells.map((row) => (
      Promise.all<Blob>(row.map((cell) => (
        new Promise((resolve) => {
          cell.toBlob((blob) => resolve(blob!));
        })
      )))
    )));
  } else {
    /* instantiate GIF encoders for each cells */
    const delayPerFrame = 1000 / framerate;
    const encoders = [];
    const initializeEncoder = () => {
      const encoder = new Worker("./gifworker.js");
      encoder.postMessage({
        initialize: {
          height: croppedHeight,
          width: croppedWidth,
          delay: delayPerFrame,
          transparent,
        },
      });
      return encoder;
    };
    for (let y = 0; y < vCells; y += 1) {
      const row = [];
      for (let x = 0; x < hCells; x += 1) {
        row.push(initializeEncoder());
      }
      encoders.push(row);
    }
    for (let i = 0; i < framecount; i += 1) {
      const keyframe = animationInvert ? 1 - easing(i / framecount) : easing(i / framecount);
      const frame = await renderFrameUncut(
        keyframe,
        image,
        offsetH,
        offsetV,
        srcWidth,
        srcHeight,
        roundedTargetWidth * hCells,
        roundedTargetHeight * vCells,
        noCrop,
        animation,
        animationInvert,
        effects,
        webglEffects,
        framerate,
        framecount,
        transparent ? "rgba(0, 0, 0, 0)" : backgroundColor,
      );
      const imgCells = cutoutCanvasIntoCells(
        frame,
        0,
        0,
        hCells,
        vCells,
        croppedWidth,
        croppedHeight,
      );
      for (let y = 0; y < vCells; y += 1) {
        for (let x = 0; x < hCells; x += 1) {
          const ctx = imgCells[y][x].getContext("2d");
          if (!ctx) {
            throw new Error("Failed to get rendering context.");
          }

          const { data } = ctx.getImageData(
            0,
            0,
            croppedWidth,
            croppedHeight,
          );

          encoders[y][x].postMessage({
            addFrame: data,
          });
        }
      }
    }
    return Promise.all<Blob[]>(
      encoders.map((row) => Promise.all<Blob>(
        row.map((cell) => (
          new Promise((resolve) => {
            cell.addEventListener("message", (res) => {
              cell.terminate();
              resolve(res.data);
            });
            cell.postMessage({
              finish: true,
            });
          })
        )),
      )),
    );
  }
};

/* ASYNC: returns a 2d-array of (possibly animated) images. */
export function renderAllCells(
  image: HTMLImageElement | HTMLCanvasElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
  noCrop: boolean,
  animated: boolean,
  animation: Animation | null,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  easing: Easing,
  framerate: number,
  framecount: number,
  backgroundColor: string,
  transparent: boolean,
  binarySizeLimit: number,
): Promise<Blob[][]> {
  return new Promise((resolve) => {
    renderAllCellsFixedSize(
      image,
      offsetH,
      offsetV,
      hCells,
      vCells,
      srcWidth,
      srcHeight,
      maxWidth,
      maxHeight,
      noCrop,
      animated,
      animation,
      animationInvert,
      effects,
      webglEffects,
      easing,
      framerate,
      framecount,
      backgroundColor,
      transparent,
    ).then((ret) => {
      /**
       * If a cell exceeds the limitation, retry with smaller cell size.
       * This does not happen in most cases.
       */
      const shouldRetry = ret.some((row) => row.some((cell: Blob) => (
        cell.size >= binarySizeLimit
      )));
      if (shouldRetry) {
        renderAllCells(
          image,
          offsetH,
          offsetV,
          hCells,
          vCells,
          srcWidth,
          srcHeight,
          maxWidth * 0.9,
          maxHeight * 0.9,
          noCrop,
          animated,
          animation,
          animationInvert,
          effects,
          webglEffects,
          easing,
          framerate,
          framecount,
          backgroundColor,
          transparent,
          binarySizeLimit,
        ).then(resolve);
      } else {
        resolve(ret);
      }
    });
  });
}
