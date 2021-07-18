import EffectOption from "./EffectOption.vue";
import { NCheckbox } from "naive-ui";

export default {
  title: "inputs/molecules/EffectOption",
  component: EffectOption,
};

const Template = (args) => ({
  components: { EffectOption },
  data: () => args,
  template: "<EffectOption :model-value='modelValue' :effect='effect' />",
});

export const Base = Template.bind({});
Base.args = {
  modelValue: [{ label: "エフェクト２", value: null }],
  effect: { label: "エフェクト１", value: null },
};

export const Selected = Template.bind({});
Selected.args = {
  modelValue: [{ label: "エフェクト２", value: null }],
  effect: { label: "エフェクト２", value: null },
};
