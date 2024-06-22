import { GIFEncoder, quantize, applyPalette } from "gifenc";

// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const encoder = GIFEncoder();

ctx.addEventListener("message", (msg) => {
  if (msg.data.addFrame) {
    const { data, transparent, width, height, delay } = msg.data.addFrame;
    const format = transparent ? "rgba4444" : "rgb565";
    const palette = quantize(data, 256, { format, oneBitAlpha: transparent });
    const index = applyPalette(data, palette, format);
    encoder.writeFrame(index, width, height, { palette, delay, transparent });
  } else if (msg.data.finish) {
    encoder.finish();
    ctx.postMessage(new Blob([encoder.bytes()], { type: "image/gif" }));
  }
});
