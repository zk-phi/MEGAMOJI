import mitt from "mitt";
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

export const fontStatusWatcher = mitt();

const loadFont = (label: string, font: Record<string, string>) => {
  const family = Object.keys(font)[0];
  const url = font[family];
  const obj = { label, value: `normal 1em '${family}'`, loaded: false };
  const fontFace = new FontFace(family, `url('${url}')`);
  fontFace.load().then(() => {
    document.fonts.add(fontFace);
    obj.loaded = true;
    fontStatusWatcher.emit("load");
  });
  return obj;
};

export default [
  {
    label: "定番フォント",
    fonts: [
      loadFont("ゴシック", { Mplus1Bold }),
      loadFont("ゴシック/極太", { Mplus1Black }),
      loadFont("丸ゴ", { RoundedMPlusBold }),
      loadFont("丸ゴ/極太", { RoundedMPlusBlack }),
      loadFont("明朝", { NotoSerifBlack }),
    ],
  }, {
    label: "デザインフォント",
    fonts: [
      loadFont("デラゴシック", { DelaGothic }),
      loadFont("あかずきんポップ", { AkazukinPOP }),
      loadFont("零ゴシック", { ZeroGothic }),
      loadFont("黒薔薇シンデレラ", { KurobaraCinderella }),
      loadFont("はちまるポップ", { HachiMaruPop }),
      loadFont("851チカラヨワク", { ChikaraYowaku }),
      loadFont("玉ねぎ楷書「激」", { TamanegiKaishoGeki }),
      loadFont("PixelMplus", { PixelMplus }),
      loadFont("レゲエ", { Reggae }),
      loadFont("ランパート", { Rampart }),
    ],
  },
];
