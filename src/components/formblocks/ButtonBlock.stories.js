import ButtonBlock from "./ButtonBlock.vue";

export default {
  title: "formblocks/atoms/ButtonBlock",
  component: ButtonBlock,
};

export const Base = (args) => ({
  components: { ButtonBlock },
  data: () => args,
  template: "<ButtonBlock :click='click'>Button</ButtonBlock>",
});
Base.args = { click: () => alert("clicked!") };
