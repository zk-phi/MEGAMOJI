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
import Dohetaji from "../fonts/doheta_j.woff";
import TamanegiKaishoGeki from "../fonts/TamanegiKaishoGekiV6.woff";

export default [
  {
    label: "定番フォント",
    fonts: [
      { label: "ゴシック", uri: Mplus1Bold },
      { label: "ゴシック/極太", uri: Mplus1Black },
      { label: "丸ゴ", uri: RoundedMPlusBold },
      { label: "丸ゴ/極太", uri: RoundedMPlusBlack },
      { label: "明朝", uri: NotoSerifBlack },
    ],
  }, {
    label: "デザインフォント",
    fonts: [
      { label: "デラゴシック", uri: DelaGothic },
      { label: "あかずきんポップ", uri: AkazukinPOP },
      { label: "零ゴシック", uri: ZeroGothic },
      { label: "黒薔薇シンデレラ", uri: KurobaraCinderella },
      { label: "はちまるポップ", uri: HachiMaruPop },
      { label: "ドヘタ字 J", uri: Dohetaji },
      { label: "玉ねぎ楷書「激」", uri: TamanegiKaishoGeki },
      { label: "PixelMplus", uri: PixelMplus },
      { label: "レゲエ", uri: Reggae },
      { label: "ランパート", uri: Rampart },
    ],
  },
];
