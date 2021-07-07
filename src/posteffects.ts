import postEffectFocusLine from './posteffects/focusLine';
import postEffectGlitch from './posteffects/glitch';
import postEffectMosaic from './posteffects/mosaic';

export type PostEffect = (
  keyframe: number, ctx: CanvasRenderingContext2D, width: number, height: number,
) => void;

export const POST_EFFECTS = [
  {
    label: "エフェクト",
    effects: [
      { label: "集中線", fn: postEffectFocusLine },
      { label: "グリッチ", fn: postEffectGlitch },
      { label: "モザイク", fn: postEffectMosaic },
    ],
  },
];
