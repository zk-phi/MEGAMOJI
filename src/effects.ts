import { HSV2RGB } from './utils/color';
import { scaleCentered } from './utils/canvas';
import effectFlip from './effects/flip';
import effectFlipVertical from './effects/flipVertical';
import effectBlink from './effects/blink';
import effectShadowBlur from './effects/shadowBlur';
import effectShadowNeon from './effects/shadowNeon';
import effectShadowRotate from './effects/shadowRotate';
import effectPatapata from './effects/patapata';
import effectRoulette from './effects/roulette';
import effectNeruneru from './effects/neruneru';
import effectGatagata from './effects/gatagata';
import effectYatta from './effects/yatta';
import effectPoyon from './effects/poyon';
import effectMotimoti from './effects/motimoti';
import effectYurayura from './effects/yurayura';
import effectZoom from './effects/zoom';
import effectStraight from './effects/straight';
import effectBGTiritiri from './effects/bgTiritiri';
import effectBGPsych from './effects/bgPsych';
import effectBGDizzy from './effects/bgDizzy';

/*
 * An effect takes a 2d rendering context and makes modifications to it.
 * These functions are called just before rendering an animation frame.
 * Note that users can enable multiple effects at the same time.
 *
 * [arguments]
 * - keyframe   ... a 0.0 - 1.0 progress of the animation
 * - ctx        ... the rendering context to be modified
 * - cellWidth  ... width of the image to be rendered
 * - cellHeight ... height of the image to be rendered
 */

export type Effect = (
  keyrame: number, ctx: CanvasRenderingContext2D, width: number, height: number,
) => void;

export const EFFECTS = [
  {
    label: "変形",
    effects: [
      { label: "ガタガタ", fn: effectGatagata },
      { label: "びょいんびょいん", fn: effectZoom },
      { label: "ルーレット", fn: effectRoulette },
      { label: "ねるねる", fn: effectNeruneru },
      { label: "ゆらゆら", fn: effectYurayura },
      { label: "ぱたぱた", fn: effectPatapata },
      { label: "ヤッタ", fn: effectYatta },
      { label: "ぽよーん", fn: effectPoyon },
      { label: "もちもち", fn: effectMotimoti },
      { label: "BLINK", fn: effectBlink },
      { label: "直球", fn: effectStraight },
    ],
  }, {
    label: "シャドウ",
    effects: [
      { label: "ぐるぐる", fn: effectShadowRotate },
      { label: "ブラー", fn: effectShadowBlur },
      { label: "ネオン", fn: effectShadowNeon },
    ],
  },
];

export const STATIC_EFFECTS = [
  { label: "左右を反転", fn: effectFlip },
  { label: "上下を反転", fn: effectFlipVertical },
];

export const PRO_EFFECTS = [
  {
    label: "背景エフェクト",
    effects: [
      { label: "チリチリ", fn: effectBGTiritiri },
      { label: "ディスコ", fn: effectBGPsych },
      { label: "サイケ", fn: effectBGDizzy },
    ],
  },
];
