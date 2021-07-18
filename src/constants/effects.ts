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
      { label: "ガタガタ", value: effectGatagata },
      { label: "びょいんびょいん", value: effectZoom },
      { label: "ルーレット", value: effectRoulette },
      { label: "ねるねる", value: effectNeruneru },
      { label: "ゆらゆら", value: effectYurayura },
      { label: "ぱたぱた", value: effectPatapata },
      { label: "ヤッタ", value: effectYatta },
      { label: "ぽよーん", value: effectPoyon },
      { label: "もちもち", value: effectMotimoti },
      { label: "BLINK", value: effectBlink },
      { label: "直球", value: effectStraight },
    ],
  }, {
    label: "シャドウ",
    effects: [
      { label: "ぐるぐる", value: effectShadowRotate },
      { label: "ブラー", value: effectShadowBlur },
      { label: "ネオン", value: effectShadowNeon },
    ],
  },
];
