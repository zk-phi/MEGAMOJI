<script lang="ts">
import { defineComponent, PropType } from "vue";

type Pos = { left: string, width?: string };

export default defineComponent({
  props: {
    modelValue: { type: [Number, Array] as PropType<number | [number, number]>, required: true },
    marks: { type: Array as PropType<number[]>, default: () => [] },
    step: { type: Number, default: 1 },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: () => ({
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as ((e?: PointerEvent) => void) | null,
  }),
  computed: {
    knobPos(): Pos[] {
      const values = Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue];
      return values.map((value) => {
        const pos = (value - this.min) / (this.max - this.min);
        return { left: `${pos * 100}%` };
      });
    },
    markPos(): Pos[] {
      return this.marks.map((mark) => {
        const pos = (mark - this.min) / (this.max - this.min);
        return { left: `${pos * 100}%` };
      });
    },
    range(): Pos {
      if (Array.isArray(this.modelValue)) {
        const left = (this.modelValue[0] - this.min) / (this.max - this.min);
        const right = (this.modelValue[1] - this.min) / (this.max - this.min);
        return { left: `${left * 100}%`, width: `${(right - left) * 100}%` };
      } else {
        const width = (this.modelValue - this.min) / (this.max - this.min);
        return { left: "0", width: `${width * 100}%` };
      }
    },
  },
  beforeUnmount() {
    if (this.upHandler) {
      this.upHandler();
    }
  },
  methods: {
    update(targetId: number, newValue: number): void {
      if (Array.isArray(this.modelValue)) {
        this.$emit("update:modelValue", [
          targetId === 0 ? newValue : this.modelValue[0],
          targetId === 1 ? newValue : this.modelValue[1],
        ]);
      } else {
        this.$emit("update:modelValue", newValue);
      }
    },
    startDrag(targetId: number, evt: PointerEvent): void {
      if (this.moveHandler) return;
      const rect = (this.$refs.container as HTMLDivElement).getBoundingClientRect();
      this.moveHandler = (e: PointerEvent) => {
        const pos = (e.clientX - rect.left) / rect.width;
        const value = pos * (this.max - this.min) + this.min;
        const rounded = Math.round(value / this.step) * this.step;
        const clamped = Math.min(
          Array.isArray(this.modelValue) && targetId === 0 ? this.modelValue[1] : this.max,
          Math.max(
            Array.isArray(this.modelValue) && targetId === 1 ? this.modelValue[0] : this.min,
            rounded,
          ),
        );
        this.update(targetId, clamped);
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
  <div class="slider">
    <div ref="container" class="container">
      <div class="rail" />
      <div class="range" :style="range" />
      <div v-for="(pos, ix) in markPos" :key="ix" class="mark" :style="pos" />
      <div
          v-for="(pos, ix) in knobPos"
          :key="ix"
          class="knob"
          :style="pos"
          @pointerdown="startDrag(ix, $event)">
        <div class="value">
          {{ Array.isArray(modelValue) ? modelValue[ix] : modelValue }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  --railSize: 0.625em;
  --markHeight: 1em;
  --knobSize: 1.625em;
  --valueMargin: 0.25em;
  display: block;
  width: 100%;
}

.container {
  position: relative;
  left: calc(var(--knobSize) / 2);
  width: calc(100% - var(--knobSize));
  height: calc(var(--knobSize) + var(--valueMargin) + 1em);
  font-size: var(--fontSizeMedium);
  line-height: 1;
}

.rail {
  position: absolute;
  top: calc((var(--knobSize) - var(--railSize)) / 2);
  left: 0;
  width: 100%;
  height: var(--railSize);
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: calc(var(--railSize) / 2);
}

.range {
  position: absolute;
  top: calc((var(--knobSize) - var(--railSize)) / 2);
  height: var(--railSize);
  background-color: var(--border);
  border-radius: calc(var(--railSize) / 2);
}

.mark {
  position: absolute;
  top: calc((var(--knobSize) - var(--markHeight)) / 2);
  width: 1px;
  height: var(--markHeight);
  background-color: var(--border);
}

.knob {
  position: absolute;
  top: 0;
  width: var(--knobSize);
  height: var(--knobSize);
  box-sizing: border-box;
  margin-left: calc(-1 * var(--knobSize) / 2);
  color: var(--fg);
  cursor: pointer;
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--knobSize) / 2);
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.knob:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.knob:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.value {
  width: 2.5em;
  margin-top: calc(var(--knobSize) + var(--valueMargin));
  margin-left: calc(-1 * (2.5em - var(--knobSize)) / 2 - 1px);
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}
</style>
