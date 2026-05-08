declare module "*.vue" {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import Vue from "vue";

  export default Vue;
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

declare module "filenamify/browser" {
  export default function (input: string, options?: { replacement: string }): string;
}

declare module "upng-js" {
  export function encode(
    imgs: ArrayBuffer[],
    w: number,
    h: number,
    cnum: number,
    dels: number[],
    opts: { loop?: number },
  ): ArrayBuffer;
}
