<script lang="ts">
import { defineComponent } from "vue";
import { HSV2HEX } from "../../utils/color";

export default defineComponent({
  props: {
    h: { type: Number, required: true },
    s: { type: Number, required: true },
    v: { type: Number, required: true },
  },
  emits: [
    "update:s", "update:v",
  ],
  data: () => ({
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as ((e?: PointerEvent) => void) | null,
  }),
  computed: {
    baseColor(): string {
      return HSV2HEX({ h: this.h, s: 100, v: 100 });
    },
  },
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
        const white = (e.clientX - rect.left) / rect.width;
        const black = 1 - (e.clientY - rect.top) / rect.height;
        this.$emit("update:s", 100 * Math.min(1, Math.max(0, white)));
        this.$emit("update:v", 100 * Math.min(1, Math.max(0, black)));
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
  <div class="tone-picker" :style="{ '--jsValueH': s / 100, '--jsValueV': 1 - v / 100 }">
    <div ref="container" class="container" @pointerdown="startDrag($event)">
      <div class="layer" :style="{ background: baseColor }" />
      <div class="layer" :style="{ background: `linear-gradient(90deg, white, transparent)` }" />
      <div class="layer" :style="{ background: `linear-gradient(0deg, black, transparent)` }" />
      <div :class="['knob', { active: !!moveHandler }]" />
    </div>
  </div>
</template>

<style scoped>
.tone-picker {
  position: relative;
  display: block;
  width: 100%;
  height: 320px; /* override me */
}

.container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.knob {
  position: absolute;
  top: calc(100% * var(--jsValueV));
  left: calc(100% * var(--jsValueH));
  display: inline-block;
  width: var(--sliderKnobSize);
  height: var(--sliderKnobSize);
  margin-top: calc(-1 * var(--sliderKnobSize) / 2);
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
