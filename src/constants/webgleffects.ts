import webglKira from "../webgleffects/kira";
import webglFoil from "../webgleffects/foil";
import webglBlur from "../webgleffects/blur";
import webglBlurVertical from "../webgleffects/blurVertical";
import webglZoom from "../webgleffects/zoom";
import webglDokaben from "../webgleffects/dokaben";
import webglWave from "../webgleffects/wave";
import webglStrobo from "../webgleffects/strobo";

export default [
  {
    label: "WebGL 対応ブラウザのみ",
    effects: [
      { label: "キラ", fn: webglKira },
      { label: "横もや", fn: webglBlur },
      { label: "縦もや", fn: webglBlurVertical },
      { label: "Foil", fn: webglFoil },
      { label: "カベドン", fn: webglDokaben },
      { label: "残像", fn: webglZoom },
      { label: "ウェイヴ", fn: webglWave },
      { label: "ストロボ", fn: webglStrobo },
    ],
  },
];
