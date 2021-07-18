import effectBGTiritiri from "../effects/bgTiritiri";
import effectBGPsych from "../effects/bgPsych";
import effectBGDizzy from "../effects/bgDizzy";

export default [
  {
    label: "背景エフェクト",
    effects: [
      { label: "チリチリ", value: effectBGTiritiri },
      { label: "ディスコ", value: effectBGPsych },
      { label: "サイケ", value: effectBGDizzy },
    ],
  },
];
