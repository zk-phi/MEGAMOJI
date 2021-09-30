<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ColorStop } from "../../types";
import ColorPopover from "./ColorPopover.vue";
import Button from "./Button.vue";
import Delete from "../icons/Delete.vue";
import { absColor } from "../../utils/color";
import { nearestIndex } from "../../utils/array";

export default defineComponent({
  components: {
    ColorPopover, Button, Delete,
  },
  props: {
    modelValue: { type: Array as PropType<ColorStop[]>, required: true },
    baseColor: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: () => ({
    moveHandler: null as ((e: PointerEvent) => void) | null,
    upHandler: null as ((e?: PointerEvent) => void) | null,
    colorPickerTarget: null as number | null,
    knobRefs: [] as Element[],
    dragTarget: null as number | null,
  }),
  computed: {
    absColorStop(): ColorStop[] {
      return this.modelValue.map((colorStop) => ({
        pos: colorStop.pos,
        color: absColor(colorStop.color, this.baseColor),
      }));
    },
    gradient(): string {
      if (this.absColorStop.length === 1) {
        return this.absColorStop[0].color;
      }
      const colorstops = this.absColorStop.slice(0).sort((a, b) => (
        a.pos - b.pos
      )).map((colorStop) => `${colorStop.color} ${colorStop.pos}%`).join(",");
      return `linear-gradient(to right, ${colorstops})`;
    },
  },
  beforeUnmount() {
    if (this.upHandler) {
      this.upHandler();
    }
  },
  onBeforeUpdate() {
    this.knobRefs = [];
  },
  methods: {
    updatePos(newPos: number): void {
      this.$emit("update:modelValue", this.modelValue.map((colorStop, ix) => ({
        pos: ix === this.dragTarget ? newPos : colorStop.pos,
        color: colorStop.color,
      })));
      (this.$refs.popover as ColorPopover).refreshStyle();
    },
    updateColor(newColor: string): void {
      this.$emit("update:modelValue", this.modelValue.map((colorStop, ix) => ({
        pos: colorStop.pos,
        color: ix === this.colorPickerTarget ? newColor : colorStop.color,
      })));
    },
    deleteColorStop(): void {
      this.$emit("update:modelValue", this.modelValue.filter((_, ix) => (
        this.colorPickerTarget !== ix
      )));
      this.colorPickerTarget = null;
    },
    addColorStop(evt: PointerEvent): void {
      const rect = (this.$refs.container as HTMLDivElement).getBoundingClientRect();
      const pos = (evt.clientX - rect.left) / rect.width * 100;
      this.$emit("update:modelValue", [...this.modelValue, { pos, color: "identical" }]);
    },
    startDrag(evt: PointerEvent): void {
      if (this.moveHandler) return;
      const rect = (this.$refs.container as HTMLDivElement).getBoundingClientRect();
      const startPos = (evt.clientX - rect.left) / rect.width * 100;
      this.dragTarget = nearestIndex(this.modelValue.map((cs) => cs.pos), startPos);
      this.colorPickerTarget = this.dragTarget;
      this.moveHandler = (e: PointerEvent) => {
        const pos = (e.clientX - rect.left) / rect.width * 100;
        const clamped = Math.min(100, Math.max(0, Math.round(pos)));
        this.updatePos(clamped);
        e.preventDefault();
      };
      this.upHandler = (e?: PointerEvent) => {
        if (this.moveHandler) {
          document.removeEventListener("pointermove", this.moveHandler);
          this.moveHandler = null;
          this.dragTarget = null;
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
    setKnobRef(ix: number) {
      return (el: Element) => { this.knobRefs[ix] = el; };
    },
    onHide(): void {
      this.colorPickerTarget = null;
    },
  },
});
</script>

<template>
  <div class="gradient" :style="{ background: gradient }">
    <div ref="container" class="container">
      <div class="rail" @click="addColorStop" />
      <div
          v-for="(colorStop, ix) in absColorStop"
          :ref="setKnobRef(ix)"
          :key="ix"
          class="knob"
          :style="{ left: `${colorStop.pos}%` }"
          @pointerdown="startDrag($event)">
        <div
            :class="['knob-icon', { active: dragTarget === ix }]"
            :style="{ background: colorStop.color }" />
      </div>
    </div>
  </div>
  <ColorPopover
      ref="popover"
      :show="colorPickerTarget != null"
      :el="colorPickerTarget != null ? knobRefs[colorPickerTarget] : null"
      :on-hide="onHide"
      :model-value="colorPickerTarget != null ? absColorStop[colorPickerTarget].color : ''"
      @update:model-value="updateColor($event)">
    <Button danger block @click="deleteColorStop">
      <Delete /> 削除
    </Button>
  </ColorPopover>
</template>

<style scoped>
.gradient {
  --railHeight: 36px;
  --knobWidth: 18px;
  --knobHeight: 36px;
  --knobTouchAreaWidth: 3em;
  display: block;
  width: 100%;
  border-radius: var(--borderRadius);
}

.container {
  position: relative;
  left: calc(var(--knobWidth) / 2);
  width: calc(100% - var(--knobWidth));
  height: calc(var(--knobHeight));
  font-size: var(--fontSizeMedium);
  line-height: 1;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  touch-action: none;
}

.rail {
  position: absolute;
  top: calc((var(--knobHeight) - var(--railHeight)) / 2);
  left: 0;
  width: 100%;
  height: var(--railHeight);
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  cursor: copy;
}

.knob {
  position: absolute;
  top: 0;
  width: var(--knobTouchAreaWidth);
  height: var(--knobHeight);
  box-sizing: border-box;
  margin-left: calc(-1 * var(--knobTouchAreaWidth) / 2);
  text-align: center;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  cursor: grab;
}

.knob-icon {
  display: inline-block;
  width: var(--knobWidth);
  height: var(--knobHeight);
  border-radius: var(--borderRadius);
  box-shadow:
    0 0 0 1px inset var(--border),
    0 0 0 2px inset #fff;
}

.knob:hover > .knob-icon {
  box-shadow:
    0 0 0 1px inset var(--primary),
    0 0 0 2px inset #fff;
}

.knob-icon.active {
  box-shadow:
    var(--primaryShadow),
    0 0 0 1px inset var(--primaryActive),
    0 0 0 2px inset #fff;
}
</style>
