<script lang="ts">
import { defineComponent, PropType } from "vue";

type Pos = { left: string };

const gradient =
  `linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red)`;

export default defineComponent({
  props: {
    h: { type: Number, required: true },
    w: { type: Number, required: true },
    b: { type: Number, required: true },
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
      evt.preventDefault();
    },
  },
});
</script>

<template>
  <div class="slider" :style="{ '--jsValue': h / 360 }">
    <div ref="container" class="container">
      <div class="rail" :style="{ background: gradient }" />
      <div class="knob" @pointerdown="startDrag($event)" />
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
  font-size: var(--fontSizeMedium);
  line-height: 1;
  overflow: hidden;
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
  left: calc(100% * var(--jsValue));
  top: 0;
  display: inline-block;
  width: var(--sliderKnobSize);
  height: var(--sliderKnobSize);
  margin-left: calc(-1 * var(--sliderKnobSize) / 2);
  cursor: pointer;
  background-color: transparent;
  border-radius: calc(var(--sliderKnobSize) / 2);
  box-shadow:
    0 0 0 1px inset var(--border),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.knob:hover {
  box-shadow:
    0 0 0 1px inset var(--primary),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
}

.knob:active {
  box-shadow:
    var(--primaryShadow),
    0 0 0 1px inset var(--primaryActive),
    0 0 0 2px inset white,
    0 0 0 3px inset black;
}
</style>
