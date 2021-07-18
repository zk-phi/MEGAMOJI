import postEffectFocusLine from "../posteffects/focusLine";
import postEffectGlitch from "../posteffects/glitch";
import postEffectMosaic from "../posteffects/mosaic";

export default [
  {
    label: "エフェクト",
    effects: [
      { label: "集中線", value: postEffectFocusLine },
      { label: "グリッチ", value: postEffectGlitch },
      { label: "モザイク", value: postEffectMosaic },
    ],
  },
];
