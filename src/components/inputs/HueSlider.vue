<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HSV } from "../../utils/color";

const gradient = "linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)";

export default defineComponent({
  props: {
    modelValue: { type: Object as PropType<HSV>, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: () => ({
    gradient,
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as (() => void) | null,
  }),
  beforeUnmount() {
    if (this.upHandler) {
      this.upHandler();
    }
  },
  methods: {
    startDrag(evt: PointerEvent): void {
      if (this.moveHandler) return;
      const rect = (this.$refs.container as HTMLDivElement).getBoundingClientRect();
      this.moveHandler = (e: PointerEvent) => {
        const left = (e.clientX - rect.left) / rect.width;
        this.$emit("update:modelValue", {
          h: 359.7 * Math.min(1, Math.max(0, left)), // #FF0001 max
          s: this.modelValue.s,
          v: this.modelValue.v,
        });
      };
      this.upHandler = () => {
        if (this.moveHandler) {
          document.removeEventListener("pointermove", this.moveHandler);
          this.moveHandler = null;
        }
        if (this.upHandler) {
          document.removeEventListener("pointerup", this.upHandler);
          document.removeEventListener("pointerleave", this.upHandler);
          this.upHandler = null;
        }
      };
      document.addEventListener("pointermove", this.moveHandler);
      document.addEventListener("pointerup", this.upHandler);
      document.addEventListener("pointerleave", this.upHandler);
      this.moveHandler(evt);
    },
  },
});
</script>

<template>
  <div class="slider" :style="{ '--jsValue': modelValue.h / 360, background: gradient }">
    <div ref="container" class="container" @pointerdown="startDrag($event)">
      <div :class="['knob', { active: !!moveHandler }]" />
    </div>
  </div>
</template>

<style scoped>
.slider {
  display: block;
  width: 100%;
}

.container {
  position: relative;
  left: 0;
  width: calc(100%);
  height: var(--sliderKnobSize);
  overflow: hidden;
  font-size: var(--fontSizeMedium);
  line-height: 1;
  cursor: pointer;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.knob {
  position: absolute;
  top: 0;
  left: calc(100% * var(--jsValue));
  display: inline-block;
  width: var(--sliderKnobSize);
  height: var(--sliderKnobSize);
  margin-left: calc(-1 * var(--sliderKnobSize) / 2);
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  cursor: grab;
  background-color: transparent;
  border-radius: calc(var(--sliderKnobSize) / 2);
  box-shadow:
    0 0 0 1px inset var(--border),
    0 0 0 2px inset #fff;
}

.knob:hover {
  box-shadow:
    0 0 0 1px inset var(--primary),
    0 0 0 2px inset #fff;
}

.knob.active {
  box-shadow:
    var(--primaryShadow),
    0 0 0 1px inset var(--primaryActive),
    0 0 0 2px inset #fff;
}
</style>
