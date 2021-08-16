import ColorPopover from "./ColorPopover.vue";

export default {
  title: "molecules/inputs/ColorPopover",
  component: ColorPopover,
};

export const Base = () => ({
  components: { ColorPopover },
  data: () => ({
    showPopover: false,
    value: "#ff0000",
  }),
  methods: {
    onHide() {
      this.showPopover = false;
    },
  },
  template: `
    <button ref="btn" @click="showPopover = true">
      show
    </button>
    <ColorPopover :el="$refs.btn" :show="showPopover" :onHide="onHide" v-model="value" />
  `,
});
