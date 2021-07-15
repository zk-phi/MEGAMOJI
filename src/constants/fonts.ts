import GenEiMGothicBold from "../fonts/GenEiMGothic2-Bold.woff";
import GenEiMGothicBlack from "../fonts/GenEiMGothic2-Black.woff";
import RoundedMPlusBold from "../fonts/m-plus-rounded-1c-v10-latin_japanese-700.woff";
import RoundedMPlusBlack from "../fonts/m-plus-rounded-1c-v10-latin_japanese-900.woff";
import NotoSerifBlack from "../fonts/noto-serif-jp-v7-latin_japanese-900.woff";
import DelaGothic from "../fonts/DelaGothicOne-Regular.woff";
import AkazukinPOP from "../fonts/AkazukiPOP.woff";
import ZeroGothic from "../fonts/ZeroGothic.woff";
import KurobaraCinderella from "../fonts/kurobara-cinderella.woff";
import AoyagiReishoSIMO from "../fonts/aoyagireisyosimo_ttf_2_01.woff";
import PixelMplus from "../fonts/PixelMplus12-Bold.woff";
import Reggae from "../fonts/ReggaeOne-Regular.woff";
import Rampart from "../fonts/RampartOne-Regular.woff";

const font = (font: Record<string, string>) => {
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
    label: "システムフォント",
    fonts: [
      { label: "ゴシック", value: "normal 1em sans-serif" },
      { label: "明朝", value: "normal 1em serif" },
    ],
  }, {
    label: "スタンダード",
    fonts: [
      { label: "ゴシック/太", value: font({ GenEiMGothicBold }) },
      { label: "ゴシック/極太", value: font({ GenEiMGothicBlack }) },
      { label: "丸ゴ/太", value: font({ RoundedMPlusBold }) },
      { label: "丸ゴ/極太", value: font({ RoundedMPlusBlack }) },
      { label: "明朝/太", value: font({ NotoSerifBlack }) },
    ],
  }, {
    label: "デザイン",
    fonts: [
      { label: "Dela Gothic One", value: font({ DelaGothic }) },
      { label: "あかずきんポップ", value: font({ AkazukinPOP }) },
      { label: "零ゴシック", value: font({ ZeroGothic }) },
      { label: "黒薔薇シンデレラ", value: font({ KurobaraCinderella }) },
      { label: "青柳隷書しも", value: font({ AoyagiReishoSIMO }) },
      { label: "PixelMplus", value: font({ PixelMplus }) },
      { label: "レゲエ", value: font({ Reggae }) },
      { label: "ランパート", value: font({ Rampart }) },
    ],
  },
];
