import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { binarizeTransparency } from "./utils/binarize";

type Options = {
  format: "rgb565" | "rgba4444",
  delay: number,
  width: number,
  height: number,
  transparent: boolean,
};

// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const encoder = GIFEncoder();
const frames: Uint8ClampedArray[] = [];
let options: Options;

ctx.addEventListener("message", (msg) => {
  if (msg.data.initialize) {
    options = {
      ...msg.data.initialize,
      format: msg.data.initialize.transparent ? "rgba4444" : "rgb565",
    };
  } else if (msg.data.addFrame) {
    frames.push(msg.data.addFrame);
  } else if (msg.data.finish) {
    const { format, delay, transparent, width, height } = options;
    frames.forEach((frame) => {
      if (transparent) {
        binarizeTransparency(frame, width, height);
      }
      const palette = quantize(frame, 256, { format, oneBitAlpha: transparent });
      const index = applyPalette(frame, palette, format);
      encoder.writeFrame(index, width, height, { palette, delay, transparent });
    });
    encoder.finish();
    ctx.postMessage(new Blob([encoder.bytes()], { type: "image/gif" }));
  }
});
