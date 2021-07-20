import postEffectGlitch from "../posteffects/glitch";
import postEffectMosaic from "../posteffects/mosaic";

export default [
  {
    label: "エフェクト",
    effects: [
      { label: "グリッチ", value: postEffectGlitch },
      { label: "モザイク", value: postEffectMosaic },
    ],
  },
];
