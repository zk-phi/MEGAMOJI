import effectBGTiritiri from "../effects/bgTiritiri";
import effectBGPsych from "../effects/bgPsych";
import effectBGDizzy from "../effects/bgDizzy";

export default [
  {
    label: "背景エフェクト",
    effects: [
      { label: "チリチリ", fn: effectBGTiritiri },
      { label: "ディスコ", fn: effectBGPsych },
      { label: "サイケ", fn: effectBGDizzy },
    ],
  },
];
