import IconButton from "./IconButton.vue";
import Menu from "../icons/Menu.vue";

export default {
  title: "atoms/inputs/IconButton",
  component: IconButton,
};

const Template = (args) => ({
  components: { IconButton, Menu },
  data: () => args,
  template: `
    <IconButton :type="type">
      <Menu />
    </IconButton>
  `,
});

export const Base = Template.bind({});
Base.args = { type: "default" };

export const Danger = Template.bind({});
Danger.args = { type: "danger" };
