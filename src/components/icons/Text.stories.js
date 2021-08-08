import Text from "./Text.vue";

export default {
  title: "icons/Text",
  component: Text,
};

export const Base = () => ({
  components: { Text },
  template: "<Text />",
});
