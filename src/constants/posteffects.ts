import postEffectFocusLine from "../posteffects/focusLine";
import postEffectGlitch from "../posteffects/glitch";
import postEffectMosaic from "../posteffects/mosaic";

export default [
  {
    label: "エフェクト",
    effects: [
      { label: "集中線", fn: postEffectFocusLine },
      { label: "グリッチ", fn: postEffectGlitch },
      { label: "モザイク", fn: postEffectMosaic },
    ],
  },
];
