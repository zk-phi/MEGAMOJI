import GIF from "@dhdbstjr98/gif.js";
import { Animation, Effect, WebGLEffect, PostEffect } from "../types";
import { webglApplyEffects, webglInitialize } from "./webgl";
import { cropCanvas, cutoutCanvasIntoCells } from "./canvas";

const webglEnabled = webglInitialize();

function renderFrameUncut(
  keyframe: number,
  image: HTMLImageElement,
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
  postEffects: PostEffect[],
  framerate: number,
  framecount: number,
  fillStyle: string,
) {
  let canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  /* use larger canvas, because some effects may translate the canvas */
  canvas.width = targetWidth * 2;
  canvas.height = targetHeight * 2;

  effects.forEach((effect) => {
    effect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
  });

  if (animation) {
    animation(
      keyframe,
      ctx, image, offsetH, offsetV, width, height, targetWidth * 2, targetHeight * 2,
    );
  } else {
    const left = offsetH - width / 2;
    const top = offsetV - height / 2;
    const targetLeft = left >= 0 ? 0 : -left * targetWidth / width;
    const targetTop = top >= 0 ? 0 : -top * targetHeight / height;
    ctx.drawImage(
      image,
      Math.max(0, left), Math.max(0, top), width * 2, height * 2,
      targetLeft, targetTop, targetWidth * 2, targetHeight * 2,
    );
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  postEffects.forEach((postEffect) => {
    postEffect(keyframe, ctx, targetWidth * 2, targetHeight * 2);
  });

  if (webglEffects.length && webglEnabled) {
    canvas = webglApplyEffects(canvas, keyframe, webglEffects);
  }

  if (noCrop) {
    // copy webglCanvas content with background
    return cropCanvas(canvas, 0, 0, targetWidth * 2, targetHeight * 2, fillStyle);
  } else {
    return cropCanvas(
      canvas,
      targetWidth / 2, targetHeight / 2, targetWidth, targetHeight,
      fillStyle,
    );
  }
}

/**
 * ASYNC:
 * returns a 2d-array of (possibly animated) images of specified size (tragetSize).
 * each images may exceed binarySizeLimit.
 */
function renderAllCellsFixedSize(
  image: HTMLImageElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  targetSize: number,
  noCrop: boolean,
  animated: boolean,
  animation: Animation | null,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  postEffects: PostEffect[],
  framerate: number,
  framecount: number,
  backgroundColor: string,
  transparent: boolean,
) {
  let cells = [];
  if (!animated) {
    const img = renderFrameUncut(
      0, image,
      offsetH, offsetV, srcWidth, srcHeight,
      targetSize * hCells, targetSize * vCells, noCrop,
      animation, animationInvert, effects, webglEffects, postEffects,
      framerate, framecount,
      transparent ? "rgba(0, 0, 0, 0)" : backgroundColor,
    );
    cells = noCrop ? (
      cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
    ) : (
      cutoutCanvasIntoCells(img, 0, 0, hCells, vCells, targetSize, targetSize)
    );
    return Promise.all(cells.map((row) => (
      Promise.all(row.map((cell) => new Promise((resolve) => cell.toBlob(resolve))))
    )));
  } else {
    /* instantiate GIF encoders for each cells */
    for (let y = 0; y < vCells; y += 1) {
      const row = [];
      for (let x = 0; x < hCells; x += 1) {
        const encoder = new GIF({
          transparent: transparent ? 0xffffff : null,
          width: targetSize * (noCrop ? 2 : 1),
          height: targetSize * (noCrop ? 2 : 1),
        });
        row.push(encoder);
      }
      cells.push(row);
    }
    const delayPerFrame = 1000 / framerate;
    for (let i = 0; i < framecount; i += 1) {
      const keyframe = animationInvert ? 1 - (i / framecount) : i / framecount;
      const frame = renderFrameUncut(
        keyframe, image,
        offsetH, offsetV, srcWidth, srcHeight,
        targetSize * hCells, targetSize * vCells, noCrop,
        animation, animationInvert, effects, webglEffects, postEffects,
        framerate, framecount,
        transparent ? "#ffffff" : backgroundColor,
      );
      const imgCells = noCrop ? (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize * 2, targetSize * 2)
      ) : (
        cutoutCanvasIntoCells(frame, 0, 0, hCells, vCells, targetSize, targetSize)
      );
      for (let y = 0; y < vCells; y += 1) {
        for (let x = 0; x < hCells; x += 1) {
          cells[y][x].addFrame(imgCells[y][x].getContext("2d")!, { delay: delayPerFrame });
        }
      }
    }
    return Promise.all(cells.map((row) => Promise.all(row.map((cell) => (
      new Promise((resolve) => {
        cell.on("finished", resolve);
        cell.render();
      })
    )))));
  }
}

/* ASYNC: returns a 2d-array of (possibly animated) images. */
export function renderAllCells(
  image: HTMLImageElement,
  offsetH: number,
  offsetV: number,
  hCells: number,
  vCells: number,
  srcWidth: number,
  srcHeight: number,
  maxSize: number,
  noCrop: boolean,
  animated: boolean,
  animation: Animation | null,
  animationInvert: boolean,
  effects: Effect[],
  webglEffects: WebGLEffect[],
  postEffects: PostEffect[],
  framerate: number,
  framecount: number,
  backgroundColor: string,
  transparent: boolean,
  binarySizeLimit: number,
): Promise<string[][]> {
  return new Promise((resolve) => {
    renderAllCellsFixedSize(
      image, offsetH, offsetV, hCells, vCells, srcWidth, srcHeight, maxSize, noCrop,
      animated, animation, animationInvert, effects, webglEffects, postEffects,
      framerate, framecount,
      backgroundColor, transparent,
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
          image, offsetH, offsetV, hCells, vCells, srcWidth, srcHeight, maxSize * 0.9, noCrop,
          animated, animation, animationInvert, effects, webglEffects, postEffects,
          framerate, framecount,
          backgroundColor, transparent,
          binarySizeLimit,
        ).then(resolve);
      } else {
        resolve(ret.map((row) => row.map((cell) => URL.createObjectURL(cell))));
      }
    });
  });
}
