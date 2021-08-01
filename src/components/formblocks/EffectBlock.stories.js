import EffectBlock from "./EffectBlock.vue";

export default {
  title: "organisms/target/EffectBlock",
  component: EffectBlock,
};

const effects = [
  {
    label: "カテゴリ１",
    effects: [
      { label: "エフェクト１", value: null },
      { label: "エフェクト２", value: null },
    ],
  }, {
    label: "カテゴリ２",
    effects: [
      { label: "エフェクト３", value: null },
      { label: "エフェクト４", value: null },
    ],
  },
];

export const Base = (args) => ({
  components: { EffectBlock },
  data: () => args,
  template: "<EffectBlock :model-value='modelValue' :effects='effects' />",
});
Base.args = {
  modelValue: [effects[0].effects[0]],
  effects,
};
