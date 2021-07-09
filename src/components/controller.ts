import GIF from "@dhdbstjr98/gif.js";
import { ANIMATIONS } from "../animations";
import { EFFECTS, STATIC_EFFECTS, PRO_EFFECTS } from "../effects";
import { webglApplyEffects, webglInitialize, WEBGL_EFFECTS } from "../webgleffects";
import { POST_EFFECTS } from "../posteffects";
import { FILTERS } from "../filters";
import {
  FUKUMOJI_BASES, FUKUMOJI_EYES, FUKUMOJI_MOUTHS, FUKUMOJI_TEXTURES, FUKUMOJI_OTHERS,
} from "../parts";
import { lighterColor, darkerColor } from "../utils/color";
import {
  cropCanvas, cutoutCanvasIntoCells, mergeImages, loadFileAsBlobURL, urlToImg,
} from "../utils/canvas";
import { makeTextImage } from "../utils/textimage";

const EMOJI_SIZE = 128;
const ANIMATED_EMOJI_SIZE = 96;
const BINARY_SIZE_LIMIT = 128000;

const webglEnabled = webglInitialize();

/* ---- CORE */

function renderFrameUncut(
  keyframe,
  image, offsetH, offsetV, width, height, targetWidth, targetHeight, noCrop,
  animation, animationInvert, effects, webglEffects, postEffects,
  framerate, framecount,
  fillStyle,
) {
  let canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

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
  image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, targetSize, noCrop,
  animated, animation, animationInvert, effects, webglEffects, postEffects,
  framerate, framecount,
  backgroundColor, transparent,
) {
  let cells = [];
  if (!animated) {
    const img = renderFrameUncut(
      0, image,
      offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
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
        offsetH, offsetV, cellWidth * hCells, cellHeight * vCells,
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
          cells[y][x].addFrame(imgCells[y][x].getContext("2d"), { delay: delayPerFrame });
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
function renderAllCells(
  image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, maxSize, noCrop,
  animated, animation, animationInvert, effects, webglEffects, postEffects,
  framerate, framecount,
  backgroundColor, transparent,
  binarySizeLimit,
) {
  return new Promise((resolve) => {
    renderAllCellsFixedSize(
      image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, maxSize, noCrop,
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
          image, offsetH, offsetV, hCells, vCells, cellWidth, cellHeight, maxSize * 0.9, noCrop,
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

const constants = {
  MODES: [
    { value: "text", label: "テキストから作る" },
    { value: "file", label: "画像から作る" },
    { value: "fukumoji", label: "パーツを選んで作る" },
  ],
  ANIMATIONS,
  EFFECTS,
  STATIC_EFFECTS,
  PRO_EFFECTS,
  WEBGL_EFFECTS,
  POST_EFFECTS,
  FILTERS,
  FUKUMOJI_BASES,
  FUKUMOJI_EYES,
  FUKUMOJI_MOUTHS,
  FUKUMOJI_TEXTURES,
  FUKUMOJI_OTHERS,
};

const data = (): Record<string, unknown> => ({
  ...constants,
  baseImage: null,
  resultImages: [["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAB0UlEQVR4Xu3UAQ0AAAyDsM+/6QspcwAh2zXawGj64K8A8AgKoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7gALADeD4PUAB4AZw/B6gAHADOH4PUAC4ARy/BygA3ACO3wMUAG4Ax+8BCgA3gOP3AAWAG8Dxe4ACwA3g+D1AAeAGcPweoABwAzh+D1AAuAEcvwcoANwAjt8DFABuAMfvAQoAN4Dj9wAFgBvA8XuAAsAN4Pg9QAHgBnD8HqAAcAM4fg9QALgBHL8HKADcAI7fAxQAbgDH7wEKADeA4/cABYAbwPF7ADyAB6SPAIFm19U7AAAAAElFTkSuQmCC"]],
  previewMode: false,
  /* ui */
  ui: {
    mode: "text",
    showTargetPanel: false,
    fukumojiTab: "base",
    showTextDetails: false,
    showTargetDetails: false,
  },
  /* form inputs */
  source: {
    file: {
      file: null,
      filter: "",
    },
    text: {
      /* basic */
      content: "",
      align: "stretch",
      color: "#ffbf00",
      gradient: [],
      outlines: [],
      font: "normal 1em sans-serif",
      /* advanced */
      lineSpacing: 0.05,
    },
    fukumoji: {
      base: "assets/void.svg",
      textures: "assets/void.svg",
      eyes: "assets/void.svg",
      mouths: "assets/void.svg",
      others: "assets/void.svg",
    },
  },
  target: {
    /* basic */
    trimming: "",
    hCells: 1,
    vCells: 1,
    animation: "",
    animationInvert: false,
    staticEffects: [],
    effects: [],
    webglEffects: [],
    postEffects: [],
    /* advanced */
    offsetLeft: 0,
    offsetTop: 0,
    hZoom: "1.0",
    vZoom: "1.0",
    noCrop: false,
    framerate: 18,
    framecount: 12,
    backgroundColor: "#ffffff",
    transparent: false,
  },
});

function mounted(): void {
  const match = /\?([^=]+)(=(.*))?$/.exec(window.location.href);
  if (match) {
    if (match[1] === "test") {
      this.ui.mode = "text";
      this.ui.showTargetPanel = true;
      this.source.text.content = "あ";
    } else if (match[1] === "mode") {
      this.ui.mode = match[3];
    }
  }
}

const watch = {
  baseImage: {
    handler(): void {
      this.refreshDefaultSettings();
      this.render();
    },
  },
  "source.file": {
    handler(): void {
      this.loadFile();
    },
    deep: true,
  },
  "source.text": {
    handler(): void {
      this.renderText();
    },
    deep: true,
  },
  "source.text.color": {
    handler(): void {
      this.source.text.gradient = [];
    },
  },
  "source.fukumoji": {
    handler(): void {
      this.renderFukumoji();
    },
    deep: true,
  },
  target: {
    handler(): void {
      this.render();
    },
    deep: true,
  },
};

const computed = {
  outlineColors(): string {
    const { color } = this.source.text;
    return this.source.text.outlines.map((outline) => (
      outline === "lighter" ? (
        lighterColor(color)
      ) : outline === "darker" ? (
        darkerColor(color)
      ) : outline === "identical" ? (
        color
      ) : (
        outline
      )
    ));
  },
  darkerColor(): string {
    return darkerColor(this.source.text.color);
  },
  lighterColor(): string {
    return lighterColor(this.source.text.color);
  },
};

const methods = {
  loadFile(): void {
    if (this.source.file.file) {
      loadFileAsBlobURL(this.source.file.file, (blobUrl) => {
        urlToImg(blobUrl, (originalImg) => {
          if (this.source.file.filter) {
            urlToImg(this.source.file.filter(originalImg), (filteredImg) => {
              this.baseImage = filteredImg;
            });
          } else {
            this.baseImage = originalImg;
          }
        });
      });
    }
  },
  renderText(): void {
    if (this.source.text.content || this.baseImage) {
      const blobUrl = makeTextImage(
        this.source.text.content,
        this.source.text.color,
        this.source.text.font.replace(/1em/, `${EMOJI_SIZE}px`),
        EMOJI_SIZE,
        this.source.text.align,
        this.source.text.lineSpacing * EMOJI_SIZE,
        this.outlineColors, this.source.text.gradient,
      );
      urlToImg(blobUrl, (img) => { this.baseImage = img; });
    }
  },
  renderFukumoji(): void {
    mergeImages(128, 128, [
      this.source.fukumoji.base,
      this.source.fukumoji.textures,
      this.source.fukumoji.mouths,
      this.source.fukumoji.eyes,
      this.source.fukumoji.others,
    ], (blobUrl) => {
      urlToImg(blobUrl, (img) => {
        this.baseImage = img;
      });
    });
  },
  addOutline(): void {
    this.source.text.outlines.push(this.source.text.color);
  },
  removeOutline(ix: number): void {
    this.source.text.outlines.splice(ix, 1);
  },
  refreshDefaultSettings(): void {
    const image = this.baseImage;
    const v = this.target.vCells;
    const h = this.target.hCells;
    let widthRatio = (EMOJI_SIZE * h) / image.naturalWidth;
    let heightRatio = (EMOJI_SIZE * v) / image.naturalHeight;

    if (this.target.trimming === "cover") {
      widthRatio = Math.max(widthRatio, heightRatio);
      heightRatio = widthRatio;
    } else if (this.target.trimming === "contain") {
      widthRatio = Math.min(widthRatio, heightRatio);
      heightRatio = widthRatio;
    }

    this.target.hZoom = `${widthRatio}`;
    this.target.vZoom = `${heightRatio}`;
    this.target.offsetLeft = `${(image.naturalWidth - EMOJI_SIZE / widthRatio * h) / 2}`;
    this.target.offsetTop = `${Math.min(0, (image.naturalHeight - EMOJI_SIZE / heightRatio * v) / 2)}`;
  },
  onSetShowTarget(value: boolean): void {
    this.ui.showTargetPanel = value;
    ga("send", "pageview", value ? "/target" : (`/${this.ui.mode}`));
  },
  onSelectMode(value: string): void {
    this.ui.mode = value;
    this.ui.showTargetPanel = false;
    ga("send", "pageview", `/${value}`);
  },
  onSelectFukumojiTab(value: string): void {
    this.ui.fukumojiTab = value;
  },
  onSelectFukumojiPart(key: string, value: string): void {
    this.source.fukumoji[key] = value;
  },
  onSelectSpeedPreset(e: { target: { value: string } }): void {
    const speed = e.target.value;
    if (speed === "") {
      this.target.framerate = 18;
      this.target.framecount = 12;
    } else if (speed === "turbo") {
      this.target.framerate = 60;
      this.target.framecount = 12;
    } else if (speed === "super-turbo") {
      this.target.framerate = 60;
      this.target.framecount = 6;
    }
  },
  onToggleTextDetails(): void {
    this.ui.showTextDetails = !this.ui.showTextDetails;
  },
  onToggleTargetDetails(): void {
    this.ui.showTargetDetails = !this.ui.showTargetDetails;
  },
  onChangeFile(e: { target: { files: File[] } }): void {
    this.source.file.file = e.target.files[0];
  },
  render(): void {
    if (!this.baseImage) return;

    const offsetLeft = Math.floor(Number(this.target.offsetLeft));
    const offsetTop = Math.floor(Number(this.target.offsetTop));

    const cellWidth = EMOJI_SIZE / this.target.hZoom;
    const cellHeight = EMOJI_SIZE / this.target.vZoom;

    ga("send", "event", this.ui.mode, "render");

    const animated = (
      this.target.animation
      || this.target.effects.length
      || this.target.webglEffects.length
      || this.target.postEffects.length
    );
    const maxSize = animated ? ANIMATED_EMOJI_SIZE : EMOJI_SIZE;
    renderAllCells(
      this.baseImage,
      offsetLeft, offsetTop,
      this.target.hCells || 1, this.target.vCells || 1, cellWidth, cellHeight,
      maxSize, this.target.noCrop,
      animated, this.target.animation, this.target.animationInvert,
      this.target.effects.concat(this.target.staticEffects),
      this.target.webglEffects,
      this.target.postEffects,
      this.target.framerate, this.target.framecount,
      this.target.backgroundColor, this.target.transparent, BINARY_SIZE_LIMIT,
    ).then((res) => {
      this.resultImages = res;
    });
  },
};

export default {
  data, methods, mounted, watch, computed,
};
