import shaderAdjust from './shaders/adjust';
import shaderBlur from './shaders/blur';
import shaderWarp from './shaders/warp';
import shaderZoomBlur from './shaders/zoomBlur';

export type VertexShaderArgs = boolean;
export type Shader = () => WebGLShader;
export type EffectShader = (args: VertexShaderArgs) => WebGLProgram;

export type WebGLEffect = (
  keyframe: number, width: number, height: number, args: VertexShaderArgs,
) => void;

let webglCanvas;
let gl;

// initialize webgl rendering context and returns a canvas which result image will be rendered in.
// if the browser does not support webgl, just return null.
export function webglInitialize () {
  webglCanvas = document.createElement('canvas');

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
    1,  -1, 1, 1,
  -1, 1,  0, 0,
  -1, 1,  0, 0,
    1, -1,  1, 1,
    1,  1,  1, 0
  ]), gl.STATIC_DRAW);

  return webglCanvas;
}

/* ---- MATH UTILS */

// taken from glfx.js (by evanw, MIT License)
function matrixSquareToQuad (x0, y0, x1, y1, x2, y2, x3, y3) {
  const dx1 = x1 - x2;
  const dy1 = y1 - y2;
  const dx2 = x3 - x2;
  const dy2 = y3 - y2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy3 = y0 - y1 + y2 - y3;
  const det = dx1*dy2 - dx2*dy1;
  const a = (dx3*dy2 - dx2*dy3) / det;
  const b = (dx1*dy3 - dx3*dy1) / det;
  return [
    x1 - x0 + a*x1, y1 - y0 + a*y1, a,
    x3 - x0 + b*x3, y3 - y0 + b*y3, b,
    x0, y0, 1
  ];
}

// taken from glfx.js (by evanw, MIT License)
function matrixInverse (m) {
  const a = m[0], b = m[1], c = m[2];
  const d = m[3], e = m[4], f = m[5];
  const g = m[6], h = m[7], i = m[8];
  const det = a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g;
  return [
    (e*i - f*h) / det, (c*h - b*i) / det, (b*f - c*e) / det,
    (f*g - d*i) / det, (a*i - c*g) / det, (c*d - a*f) / det,
    (d*h - e*g) / det, (b*g - a*h) / det, (a*e - b*d) / det
  ];
}

// taken from glfx.js (by evanw, MIT License)
function matrixMultiply (a, b) {
  return [
    a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
    a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
    a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
    a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
    a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
    a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
    a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
    a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
    a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
  ];
}

// taken from glfx.js (by evanw, MIT License)
function matrixPerspective (before, after) {
  const a = matrixSquareToQuad.apply(null, after);
  const b = matrixSquareToQuad.apply(null, before);
  return matrixMultiply(matrixInverse(a), b);
}

function matrixFlatten (matrix) {
  return Array.prototype.concat.apply([], matrix);
}

/* ---- WEBGL UTILS */

// compile and return shader (memoized)
function webglShader (source, isVertex?) {
  let shader;
  return () => {
    if (!shader) {
      shader = gl.createShader(isVertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        throw "compile error";
      }
    }
    return shader;
  };
}

const identityVertexShader = webglShader(`
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
export function webglEffectShader (fragmentShader) {
  const shader = webglShader(fragmentShader);
  let program;
  return (flipY) => {
    if (!program) {
      program = gl.createProgram();
      gl.attachShader(program, identityVertexShader());
      gl.attachShader(program, shader());
      gl.linkProgram(program);
      gl.useProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.getProgramInfoLog(program);
        throw "link error";
      }
      const u = Float32Array.BYTES_PER_ELEMENT;
      const pos = gl.getAttribLocation(program, 'pos');
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * u , 0 * u);
      const uv = gl.getAttribLocation(program, 'uv');
      gl.enableVertexAttribArray(uv);
      gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 4 * u, 2 * u);
    } else {
      gl.useProgram(program);
    }
    gl.uniform1f(gl.getUniformLocation(program, 'flipY'), flipY ? -1 : 1);
    return program;
  };
}

// create, initialize and bind a texture
function webglTexture () {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}

// create, initialize and bind a frame buffer (with texture)
function webglFrameBuffer (w, h) {
  const frame = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  const texture = webglTexture();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  return { frame: frame, texture: texture };
}

// delete framebuffer created with webglFrameBuffer
function webglDeleteFrameBuffer (buf) {
  gl.deleteTexture(buf.texture);
  gl.deleteFramebuffer(buf.frame);
}

// render texture in framebuffer (or webglCanvas if frame=null)
function draw (texture, frame) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

/* ---- CORE */

// apply effects on image and render in webglCanvas
export function webglApplyEffects (image, keyframe, effects) {
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
    const initialp = ix == 0;
    const lastp = ix == effects.length - 1;
    effect(keyframe, w, h, lastp);
    draw(initialp ? texture : ring.car.texture, lastp ? null : ring.cdr.car.frame);
    ring = ring.cdr;
  });

  gl.deleteTexture(texture);
  webglDeleteFrameBuffer(ring.car);
  webglDeleteFrameBuffer(ring.cdr.car);

  return webglCanvas;
}

/* ---- EFFECTS */

const webglKira: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderAdjust(flipY);
  gl.uniform1f(gl.getUniformLocation(program, 'brightness'), 0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'contrast'), -0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'hue'), -1 + 2 * keyframe);
};

const webglFoil: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderAdjust(flipY);
  const brightness = 0.1 + 0.05 * Math.sin(2 * Math.PI * keyframe);
  gl.uniform1f(gl.getUniformLocation(program, 'brightness'), brightness);
  gl.uniform1f(gl.getUniformLocation(program, 'contrast'), -0.1);
  gl.uniform1f(gl.getUniformLocation(program, 'hue'), 0);
};

const webglBlurH: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderBlur(flipY);
  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  gl.uniform2f(gl.getUniformLocation(program, 'delta'), radius, 0);
};

const webglBlurV: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderBlur(flipY);
  const radius = 0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe);
  gl.uniform2f(gl.getUniformLocation(program, 'delta'), 0, radius);
};

const webglZoom: WebGLEffect = (keyframe, _w, _h, flipY) => {
  const program = shaderZoomBlur(flipY);
  const strength = 0.25 + 0.25 * Math.sin(2 * Math.PI * keyframe);
  gl.uniform2f(gl.getUniformLocation(program, 'center'), 0.5, 0.5);
  gl.uniform1f(gl.getUniformLocation(program, 'strength'), strength);
};

const webglDokaben: WebGLEffect = (keyframe, w, h, flipY) => {
  const program = shaderWarp(flipY);
  const pos = 0.5 + 0.5 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 1 */
  const diffH = 0.3 * pos / 2;
  const diffV = 1.0 * pos / 2;
  const m = matrixPerspective(
    [0.25,         0.25,         0.75,         0.25,         0.25, 0.75, 0.75, 0.75],
    [0.25 + diffH, 0.25 + diffV, 0.75 - diffH, 0.25 + diffV, 0.25, 0.75, 0.75, 0.75],
  );
  gl.uniformMatrix3fv(gl.getUniformLocation(program, 'matrix'), false, matrixFlatten(m));
};

export const WEBGL_EFFECTS = [
  { label: "キラ", fn: webglKira },
  { label: "横もや", fn: webglBlurH },
  { label: "縦もや", fn: webglBlurV },
  { label: "Foil", fn: webglFoil },
  { label: "カベドン", fn: webglDokaben },
  { label: "残像", fn: webglZoom },
];
