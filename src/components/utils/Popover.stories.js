import Popover from "./Popover.vue";

export default {
  title: "utils/Popover",
  component: Popover,
};

export const Base = () => ({
  components: { Popover },
  data: () => ({
    showPopover: false,
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
    <Popover :el="$refs.btn" :show="showPopover" :onHide="onHide">
      ほげほげ
    </Popover>
  `,
});
