import effectBlink from "../effects/blink";
import effectShadowBlur from "../effects/shadowBlur";
import effectShadowNeon from "../effects/shadowNeon";
import effectShadowRotate from "../effects/shadowRotate";
import effectPatapata from "../effects/patapata";
import effectRoulette from "../effects/roulette";
import effectNeruneru from "../effects/neruneru";
import effectGatagata from "../effects/gatagata";
import effectYatta from "../effects/yatta";
import effectPoyon from "../effects/poyon";
import effectMotimoti from "../effects/motimoti";
import effectYurayura from "../effects/yurayura";
import effectZoom from "../effects/zoom";
import effectStraight from "../effects/straight";

export default [
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
