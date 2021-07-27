declare module "*.vue" {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import Vue from "vue";

  export default Vue;
}

declare module "@dhdbstjr98/gif.js" {
  export default class {
    constructor(options: { transparent: number | null, width: number, height: number });

    addFrame(ctx: CanvasRenderingContext2D, options: { delay: number }): void;

    on(event: "finished", cb: (res: Blob) => void): void;

    abort(): void;

    render(): void;
  }
}

declare module "*.woff" {
  export default string;
}

declare module "*.svg" {
  export default string;
}

declare module "*.png" {
  export default string;
}

declare module "*.glsl" {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { GlslShader, GlslVariableMap } from "webpack-glsl-minify";

  export default {
    sourceCode: GlslShader,
    uniforms: GlslVariableMap,
    consts: GlslVariableMap,
  };
}
