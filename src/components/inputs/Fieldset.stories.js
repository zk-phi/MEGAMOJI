import Fieldset from "./Fieldset.vue";
import Input from "./Input.vue";

export default {
  title: "molecules/inputs/Fieldset",
  component: Fieldset,
};

export const Base = (args) => ({
  components: { Fieldset, Input },
  data: () => ({
    ...args,
    value: "",
  }),
  template: `
    <Fieldset :label="label">
      <Input v-model="value" />
    </Fieldset>
  `,
});
Base.args = { label: "ほげほげ" };
