import { WebGLEffect } from "../types";

type RawShader = () => WebGLShader;
export type EffectShader = () => WebGLProgram;

let webglCanvas;
let gl;

// initialize webgl rendering context and return true iff succeeded.
export function webglInitialize(): boolean {
  webglCanvas = document.createElement("canvas");

  try {
    gl = webglCanvas.getContext("experimental-webgl", { premultipliedAlpha: false });
  } catch (e) {
    /* do nothing */
  }

  if (!gl) {
    webglCanvas.remove();
    return null;
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
function webglRawShader(source, isVertex?): RawShader {
  let shader;
  return () => {
    if (!shader) {
      shader = gl.createShader(isVertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("compile error");
      }
    }
    return shader;
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
  let program;
  return () => {
    if (!program) {
      program = gl.createProgram();
      gl.attachShader(program, webglLoadRawShader(identityVertexShader));
      gl.attachShader(program, webglLoadRawShader(shader));
      gl.linkProgram(program);
      gl.useProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("link error");
      }
      const u = Float32Array.BYTES_PER_ELEMENT;
      const pos = gl.getAttribLocation(program, "pos");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * u, 0 * u);
      const uv = gl.getAttribLocation(program, "uv");
      gl.enableVertexAttribArray(uv);
      gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 4 * u, 2 * u);
    } else {
      gl.useProgram(program);
    }
    return program;
  };
}

export function webglLoadEffectShader(effectShader: EffectShader): WebGLProgram {
  return effectShader();
}

// set uniform
export function webglSetFloat(program: WebGLProgram, varName: string, value: number): void {
  gl.uniform1f(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec2(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniform2fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec3(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniform3fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetVec4(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniform4fv(gl.getUniformLocation(program, varName), value);
}
export function webglSetMat2(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniformMatrix2fv(gl.getUniformLocation(program, varName), false, value);
}
export function webglSetMat3(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniformMatrix3fv(gl.getUniformLocation(program, varName), false, value);
}
export function webglSetMat4(program: WebGLProgram, varName: string, value: number[]): void {
  gl.uniformMatrix4fv(gl.getUniformLocation(program, varName), false, value);
}

// create, initialize and bind a texture
function webglTexture() {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

// create, initialize and bind a frame buffer (with texture)
function webglFrameBuffer(w, h) {
  const frame = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  const texture = webglTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return { frame, texture };
}

// delete framebuffer created with webglFrameBuffer
function webglDeleteFrameBuffer(buf) {
  gl.deleteTexture(buf.texture);
  gl.deleteFramebuffer(buf.frame);
}

// render texture in framebuffer (or webglCanvas if frame=null)
function draw(texture, frame) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/* ---- CORE */

// apply effects on image and render in webglCanvas
export function webglApplyEffects(
  image: HTMLCanvasElement, keyframe: number, effects: WebGLEffect[],
): HTMLCanvasElement {
  const w = image.width;
  const h = image.height;
  webglCanvas.height = h;
  webglCanvas.width = w;
  gl.viewport(0, 0, w, h);

  let ring = { car: webglFrameBuffer(w, h), cdr: { car: webglFrameBuffer(w, h), cdr: null } };
  ring.cdr.cdr = ring;

  const texture = webglTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  effects.forEach((effect, ix) => {
    const initialp = ix === 0;
    const lastp = ix === effects.length - 1;
    const program = effect(keyframe, w, h);
    webglSetFloat(program, "flipY", lastp ? -1 : 1); // set vertex shader arg
    draw(initialp ? texture : ring.car.texture, lastp ? null : ring.cdr.car.frame);
    ring = ring.cdr;
  });

  gl.deleteTexture(texture);
  webglDeleteFrameBuffer(ring.car);
  webglDeleteFrameBuffer(ring.cdr.car);

  return webglCanvas;
}
