import Field from "./Field.vue";
import Input from "./Input.vue";

export default {
  title: "molecules/inputs/Field",
  component: Field,
};

export const Base = (args) => ({
  components: { Field, Input },
  data: () => ({
    ...args,
    value: "",
  }),
  template: `
    <Field :label="label">
      <Input v-model="value" />
    </Field>
  `,
});
Base.args = { label: "ほげほげ" };
