// eslint-disable-next-line no-unused-vars
const WEBGL_EFFECTS = [
  { label: "キラ", fn: webglKira },
  { label: "もやもや", fn: webglBlur },
  { label: "Foil", fn: webglFoil },
  { label: "カベドン", fn: webglDokaben },
  { label: "残像", fn: webglZoom },
];

function webglKira(keyframe, fxCanvas) {
  fxCanvas.brightnessContrast(0.1, -0.1).hueSaturation(-1 + 2 * keyframe, 0);
}

function webglFoil(keyframe, fxCanvas) {
  fxCanvas.brightnessContrast(0.1 + 0.05 * Math.sin(2 * Math.PI * keyframe), -0.1);
}

function webglBlur(keyframe, fxCanvas, w) {
  fxCanvas.triangleBlur(w * (0.07 + 0.01 * Math.cos(2 * Math.PI * keyframe)));
}

function webglZoom(keyframe, fxCanvas, w, h) {
  fxCanvas.zoomBlur(
    w / 2, h / 2,
    0.25 + 0.25 * Math.sin(2 * Math.PI * keyframe),
  );
}

function webglDokaben(keyframe, fxCanvas, w, h) {
  const pos = 0.5 + 0.5 * Math.cos(2 * Math.PI * keyframe);
  const l = w / 4;
  const r = w * 3 / 4;
  const t = h / 4;
  const b = h * 3 / 4;
  const diffH = (0.3 * pos) * (w / 2);
  const diffV = (1.0 * pos) * (h / 2);
  fxCanvas.perspective(
    [l, t, r, t, l, b, r, b],
    [l + diffH, t + diffV, r - diffH, t + diffV, l, b, r, b],
  );
}
