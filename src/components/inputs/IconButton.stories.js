import IconButton from "./IconButton.vue";
import Delete from "../icons/Delete.vue";

export default {
  title: "atoms/inputs/IconButton",
  component: IconButton,
};

const Template = (args) => ({
  components: { IconButton, Delete },
  data: () => args,
  template: `
    <IconButton :type="type">
      <Delete />
    </IconButton>
  `,
});

export const Base = Template.bind({});
Base.args = { type: "default" };

export const Danger = Template.bind({});
Danger.args = { type: "danger" };
