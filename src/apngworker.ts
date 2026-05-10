import { encode } from "upng-js";

type Options = {
  width: number,
  height: number,
  cnum: number,
  loops: number,
};

// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

const frames: ArrayBuffer[] = [];
const delays: number[] = [];
let options: Options;

ctx.addEventListener("message", (msg) => {
  if (msg.data.initialize) {
    const { width, height, cnum, loops } = msg.data.initialize;
    options = { width, height, cnum: cnum ?? Infinity, loops: loops ?? Infinity };
  } else if (msg.data.addFrame) {
    const array = msg.data.addFrame;
    frames.push(array.buffer);
    delays.push(msg.data.delay);
  } else if (msg.data.finish) {
    const png = encode(
      frames,
      options.width,
      options.height,
      options.cnum === Infinity ? 0 : options.cnum,
      delays,
      options.loops === Infinity ? {} : { loop: options.loops },
    );
    ctx.postMessage(new Blob([png], { type: "image/apng" }));
  }
});
