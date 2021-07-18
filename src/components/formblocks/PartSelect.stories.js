import PartSelect from "./PartSelect.vue";
import empty from "../../parts/void.svg";
import part1 from "../../parts/base/common.svg";
import part2 from "../../parts/base/common_cat.svg";

export default {
  title: "formblocks/molecules/PartSelect",
  component: PartSelect,
};

export const Base = (args) => ({
  components: { PartSelect },
  data: () => args,
  template: "<PartSelect :model-value='modelValue' :parts='parts' />",
});
Base.args = { modelValue: empty, parts: [empty, part1, part2] };
