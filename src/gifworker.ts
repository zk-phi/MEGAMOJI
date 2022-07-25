import { GIFEncoder, quantize, applyPalette } from "gifenc";

// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const encoder = GIFEncoder();

ctx.addEventListener("message", (msg) => {
  if (msg.data.addFrame) {
    const { data, transparent, width, height, delay } = msg.data.addFrame;
    const palette = quantize(data, 256, { oneBitAlpha: transparent });
    const index = applyPalette(data, palette);
    encoder.writeFrame(index, width, height, { palette, delay, transparent });
  } else if (msg.data.finish) {
    encoder.finish();
    ctx.postMessage(new Blob([encoder.bytes()]));
  }
});
