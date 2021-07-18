import CheckboxGroup from "./CheckboxGroup.vue";
import { NCheckbox } from "naive-ui";

export default {
  title: "inputs/molecules/CheckboxGroup",
  component: CheckboxGroup,
};

export const Base = (args) => ({
  components: { CheckboxGroup, NCheckbox },
  data: () => args,
  template: `
    <CheckboxGroup>
      <NCheckbox :checked="false">ほげほげ</NCheckbox>
      <NCheckbox :checked="false">ふがふが</NCheckbox>
      <NCheckbox :checked="true">ぴよぴよ</NCheckbox>
    </CheckboxGroup>
  `,
});
Base.args = { };
