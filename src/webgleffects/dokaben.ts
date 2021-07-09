import { WebGLEffect } from "../types";
import { webglSetMat3 } from "../webgleffects";
import shaderWarp from "../shaders/warp";
import { matrixPerspective, matrixFlatten } from "../utils/matrix";

const webglDokaben: WebGLEffect = (keyframe, w, h) => {
  const program = shaderWarp();

  const pos = 0.5 + 0.5 * Math.cos(2 * Math.PI * keyframe); /* 0 ~ 1 */
  const diffH = 0.3 * pos / 2;
  const diffV = 1.0 * pos / 2;
  const m = matrixPerspective(
    [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75],
    [0.25 + diffH, 0.25 + diffV, 0.75 - diffH, 0.25 + diffV, 0.25, 0.75, 0.75, 0.75],
  );
  webglSetMat3(program, "matrix", matrixFlatten(m));

  return program;
};

export default webglDokaben;
