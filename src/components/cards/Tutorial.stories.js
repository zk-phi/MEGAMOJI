import Tutorial from "./Tutorial.vue";

export default {
  title: "cards/organisms/Tutorial",
  component: Tutorial,
};

export const Base = (args) => ({
  components: { Tutorial },
  data: () => args,
  template: "<Tutorial />",
});
Base.args = { };
