import webglKira from "../webgleffects/kira";
import webglFoil from "../webgleffects/foil";
import webglBlur from "../webgleffects/blur";
import webglBlurVertical from "../webgleffects/blurVertical";
import webglZoom from "../webgleffects/zoom";
import webglDokaben from "../webgleffects/dokaben";
import webglWave from "../webgleffects/wave";
import webglStrobo from "../webgleffects/strobo";
import webglFocusLine from "../webgleffects/focusLine";
import webglGlitch from "../webgleffects/glitch";
import webglMosaic from "../webgleffects/mosaic";
import webglExplode from "../webgleffects/explode";

export default [
  {
    label: "特殊効果",
    effects: [
      { label: "キラ", value: webglKira },
      { label: "横もや", value: webglBlur },
      { label: "縦もや", value: webglBlurVertical },
      { label: "Foil", value: webglFoil },
      { label: "カベドン", value: webglDokaben },
      { label: "残像", value: webglZoom },
      { label: "ウェイヴ", value: webglWave },
      { label: "ストロボ", value: webglStrobo },
      { label: "集中線", value: webglFocusLine },
      { label: "グリッチ", value: webglGlitch },
      { label: "モザイク", value: webglMosaic },
      { label: "爆散", value: webglExplode },
    ],
  },
];
