<script lang="ts">
import { defineComponent } from "vue";

const gradient = "linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)";

export default defineComponent({
  props: {
    h: { type: Number, required: true },
  },
  emits: [
    "update:h",
  ],
  data: () => ({
    gradient,
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as ((e?: PointerEvent) => void) | null,
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
        this.$emit("update:h", 360 * Math.min(1, Math.max(0, left)));
        e.preventDefault();
      };
      this.upHandler = (e?: PointerEvent) => {
        if (this.moveHandler) {
          document.removeEventListener("pointermove", this.moveHandler);
          this.moveHandler = null;
        }
        if (this.upHandler) {
          document.removeEventListener("pointerup", this.upHandler);
          document.removeEventListener("pointerleave", this.upHandler);
          this.upHandler = null;
        }
        if (e) {
          e.preventDefault();
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
  <div class="slider" :style="{ '--jsValue': h / 360 }">
    <div ref="container" class="container" @pointerdown="startDrag($event)">
      <div class="rail" :style="{ background: gradient }" />
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

.rail {
  position: absolute;
  top: calc((var(--sliderKnobSize) - var(--colorSliderRailHeight)) / 2);
  left: 0;
  width: 100%;
  height: var(--colorSliderRailHeight);
  box-sizing: border-box;
  background-color: var(--bg);
  border: 1px solid var(--border);
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
