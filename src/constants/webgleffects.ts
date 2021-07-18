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
      { label: "キラ", value: webglKira },
      { label: "横もや", value: webglBlur },
      { label: "縦もや", value: webglBlurVertical },
      { label: "Foil", value: webglFoil },
      { label: "カベドン", value: webglDokaben },
      { label: "残像", value: webglZoom },
      { label: "ウェイヴ", value: webglWave },
      { label: "ストロボ", value: webglStrobo },
    ],
  },
];
