import { WebGLEffect } from "../types";

type RawShader = () => WebGLShader;
export type EffectShader = () => WebGLProgram;

let webglCanvas: HTMLCanvasElement | null;
let gl: WebGLRenderingContext | null;

// initialize webgl rendering context and return true iff succeeded.
export function webglInitialize(): boolean {
  webglCanvas = document.createElement("canvas");

  try {
    gl = webglCanvas.getContext("experimental-webgl", {
      premultipliedAlpha: false,
    }) as (WebGLRenderingContext | null);
  } catch (e) {
    /* do nothing */
  }

  if (!gl) {
    webglCanvas.remove();
    return false;
  }

  const vertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 0, 1,
    1, -1, 1, 1,
    -1, 1, 0, 0,
    -1, 1, 0, 0,
    1, -1, 1, 1,
    1, 1, 1, 0,
  ]), gl.STATIC_DRAW);

  return !!webglCanvas;
}

/* ---- WEBGL UTILS */

// compile and return shader (memoized)
function webglRawShader(source: string, isVertex?: boolean): RawShader {
  let shader: WebGLShader | null;
  return () => {
    if (!gl) throw new Error("WebGL not initialized");
    if (shader) {
      return shader;
    } else {
      shader = gl.createShader(isVertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER) as WebGLShader;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.log(gl.getShaderInfoLog(shader));
        throw new Error("compile error");
      }
      return shader;
    }
  };
}

function webglLoadRawShader(rawShader: RawShader): WebGLShader {
  return rawShader();
}

const identityVertexShader = webglRawShader(`
  precision highp float;
  attribute vec2 pos;
  attribute vec2 uv;
  varying vec2 vUv;
  uniform float flipY;

  void main(void) {
    vUv = uv;
    gl_Position = vec4(pos.x, -pos.y*flipY, 0.0, 1.);
  }
`, true);

// create and initialize program
export function webglEffectShader(fragmentShader: string): EffectShader {
  const shader = webglRawShader(fragmentShader);
  let program: WebGLProgram | null;
  return () => {
    if (!gl) throw new Error("WebGL not initialized");
    if (program) {
      gl.useProgram(program);
      return program;
    } else {
      program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, webglLoadRawShader(identityVertexShader));
      gl.attachShader(program, webglLoadRawShader(shader));
      gl.linkProgram(program);
      gl.useProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // eslint-disable-next-line no-console
        console.log(gl.getProgramInfoLog(program));
        throw new Error("link error");
      }
      const u = Float32Array.BYTES_PER_ELEMENT;
      const pos = gl.getAttribLocation(program, "pos");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * u, 0 * u);
      const uv = gl.getAttribLocation(program, "uv");
      gl.enableVertexAttribArray(uv);
      gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 4 * u, 2 * u);
      const texture = gl.getUniformLocation(program, "texture");
      gl.uniform1i(texture, 0);
      return program;
    }
  };
}

export function webglLoadEffectShader(effectShader: EffectShader): WebGLProgram {
  return effectShader();
}

// set uniform
export function webglSetFloat(program: WebGLProgram, varName: string, value: number): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniform1f(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec2(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniform2fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec3(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniform3fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec4(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniform4fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetMat2(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniformMatrix2fv(gl.getUniformLocation(program, varName), false, value);
}
export function webglSetMat3(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniformMatrix3fv(gl.getUniformLocation(program, varName), false, value);
}
export function webglSetMat4(program: WebGLProgram, varName: string, value: number[]): void {
  if (!gl) throw new Error("WebGL not initialized");
  gl.uniformMatrix4fv(gl.getUniformLocation(program, varName), false, value);
}

// create, initialize and bind a texture
function webglTexture() {
  if (!gl) throw new Error("WebGL not initialized");

  const texture = gl.createTexture() as WebGLTexture;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

type FrameBufferWithTexture = { frame: WebGLFramebuffer, texture: WebGLTexture };

// create, initialize and bind a frame buffer (with texture)
function webglFrameBuffer(w: number, h: number): FrameBufferWithTexture {
  if (!gl) throw new Error("WebGL not initialized");

  const frame = gl.createFramebuffer() as WebGLFramebuffer;
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  const texture = webglTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return { frame, texture };
}

// delete framebuffer created with webglFrameBuffer
function webglDeleteFrameBuffer(buf: FrameBufferWithTexture) {
  if (!gl) throw new Error("WebGL not initialized");
  gl.deleteTexture(buf.texture);
  gl.deleteFramebuffer(buf.frame);
}

// render texture in framebuffer (or webglCanvas if frame=null)
function draw(texture: WebGLTexture, frame: WebGLFramebuffer | null) {
  if (!gl) throw new Error("WebGL not initialized");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/* ---- CORE */

// apply effects on image and render in webglCanvas
export function webglApplyEffects(
  image: HTMLCanvasElement, keyframe: number, effects: WebGLEffect[],
): HTMLCanvasElement {
  if (!webglCanvas || !gl) throw new Error("WebGL not initialized");

  const w = image.width;
  const h = image.height;
  webglCanvas.height = h;
  webglCanvas.width = w;
  gl.viewport(0, 0, w, h);

  let prevBuf = webglFrameBuffer(w, h);
  let nextBuf = webglFrameBuffer(w, h);

  const swapBufs = () => {
    const tmp = nextBuf;
    nextBuf = prevBuf;
    prevBuf = tmp;
  };

  const texture = webglTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  effects.forEach((effect, ix) => {
    const initialp = ix === 0;
    const lastp = ix === effects.length - 1;
    const program = effect(keyframe, w, h);
    webglSetFloat(program, "flipY", lastp ? -1 : 1); // set vertex shader arg
    draw(initialp ? texture : prevBuf.texture, lastp ? null : nextBuf.frame);
    swapBufs();
  });

  gl.deleteTexture(texture);
  webglDeleteFrameBuffer(prevBuf);
  webglDeleteFrameBuffer(nextBuf);

  return webglCanvas;
}
