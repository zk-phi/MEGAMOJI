import DevTool from "./DevTool.vue";

export default {
  title: "cards/DevTool",
  component: DevTool,
};

export const Base = (args) => ({
  components: { DevTool },
  data: () => args,
  template: "<DevTool :show='show' :no-crop='noCrop' />",
});
Base.args = { show: true, noCrop: false };
