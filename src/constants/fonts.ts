import Mplus1Bold from "../fonts/Mplus1-Bold.woff";
import Mplus1Black from "../fonts/Mplus1-Black.woff";
import RoundedMPlusBold from "../fonts/m-plus-rounded-1c-v10-latin_japanese-700.woff";
import RoundedMPlusBlack from "../fonts/m-plus-rounded-1c-v10-latin_japanese-900.woff";
import NotoSerifBlack from "../fonts/noto-serif-jp-v7-latin_japanese-900.woff";
import DelaGothic from "../fonts/DelaGothicOne-Regular.woff";
import AkazukinPOP from "../fonts/AkazukiPOP.woff";
import ZeroGothic from "../fonts/ZeroGothic.woff";
import KurobaraCinderella from "../fonts/kurobara-cinderella.woff";
import PixelMplus from "../fonts/PixelMplus12-Bold.woff";
import Reggae from "../fonts/ReggaeOne-Regular.woff";
import Rampart from "../fonts/RampartOne-Regular.woff";
import HachiMaruPop from "../fonts/HachiMaruPop-Regular.woff";
import ChikaraYowaku from "../fonts/ChikaraYowaku.woff";
import TamanegiKaishoGeki from "../fonts/TamanegiKaishoGekiV6.woff";

const loadFont = (font: Record<string, string>) => {
  const family = Object.keys(font)[0];
  const url = font[family];
  const fontFace = new FontFace(family, `url('${url}')`);
  fontFace.load().then(() => {
    document.fonts.add(fontFace);
  });
  return `normal 1em '${family}'`;
};

export default [
  {
    label: "定番フォント",
    fonts: [
      { label: "ゴシック", value: loadFont({ Mplus1Bold }) },
      { label: "ゴシック/極太", value: loadFont({ Mplus1Black }) },
      { label: "丸ゴ", value: loadFont({ RoundedMPlusBold }) },
      { label: "丸ゴ/極太", value: loadFont({ RoundedMPlusBlack }) },
      { label: "明朝", value: loadFont({ NotoSerifBlack }) },
    ],
  }, {
    label: "デザインフォント",
    fonts: [
      { label: "デラゴシック", value: loadFont({ DelaGothic }) },
      { label: "あかずきんポップ", value: loadFont({ AkazukinPOP }) },
      { label: "零ゴシック", value: loadFont({ ZeroGothic }) },
      { label: "黒薔薇シンデレラ", value: loadFont({ KurobaraCinderella }) },
      { label: "はちまるポップ", value: loadFont({ HachiMaruPop }) },
      { label: "851チカラヨワク", value: loadFont({ ChikaraYowaku }) },
      { label: "玉ねぎ楷書「激」", value: loadFont({ TamanegiKaishoGeki }) },
      { label: "PixelMplus", value: loadFont({ PixelMplus }) },
      { label: "レゲエ", value: loadFont({ Reggae }) },
      { label: "ランパート", value: loadFont({ Rampart }) },
    ],
  },
];
