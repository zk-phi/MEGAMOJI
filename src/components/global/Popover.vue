<script lang="ts">
import { defineComponent, PropType } from "vue";
import { elementIsContained } from "../../utils/dom";

type Pos = {
  left?: string,
  right?: string,
  top?: string,
  bottom?: string,
  width?: string,
  height?: string,
};

export default defineComponent({
  props: {
    el: { type: Object as PropType<HTMLElement>, default: null },
    show: { type: Boolean, required: true },
    onHide: { type: Function, required: true },
    refresh: { type: Number, default: null },
    style: { type: Object, default: () => ({}) },
  },
  data: () => ({
    pos: {} as Pos,
    hideHandler: null as ((e: PointerEvent) => void) | null,
  }),
  watch: {
    refresh: {
      handler(): void {
        if (this.show) {
          this.refreshStyle();
        }
      },
    },
    show: {
      handler(): void {
        if (this.show) {
          this.refreshStyle();
          this.hideHandler = (e: PointerEvent): void => {
            if (!elementIsContained(e.target as Element, this.$refs.popover as Element)) {
              this.onHide();
            }
          };
          window.addEventListener("pointerdown", this.hideHandler, true);
          window.addEventListener("scroll", this.refreshStyle, { passive: true });
          window.addEventListener("resize", this.refreshStyle);
        } else if (this.hideHandler) {
          window.removeEventListener("pointerdown", this.hideHandler, true);
          window.removeEventListener("scroll", this.refreshStyle);
          window.removeEventListener("resize", this.refreshStyle);
          this.hideHandler = null;
        }
      },
    },
  },
  beforeUnmount(): void {
    if (this.hideHandler) {
      window.removeEventListener("pointerdown", this.hideHandler, true);
      window.removeEventListener("scroll", this.refreshStyle);
      window.removeEventListener("resize", this.refreshStyle);
    }
  },
  methods: {
    refreshStyle(): void {
      if (!this.el) {
        this.pos = {};
      } else {
        const rect = this.el.getBoundingClientRect();
        const pos: Pos = {};
        if (rect.left < window.innerWidth / 2) {
          pos.left = `${rect.left + window.scrollX}px`;
        } else {
          pos.right = `${document.documentElement.clientWidth - (rect.right + window.scrollX)}px`;
        }
        if (rect.top < window.innerHeight / 2) {
          pos.top = `${rect.bottom + window.scrollY}px`;
        } else {
          pos.bottom = `${document.documentElement.clientHeight - (rect.top + window.scrollY)}px`;
        }
        this.pos = pos;
      }
    },
  },
  updated(): void {
    if (this.show) {
      const rect = this.$refs.popover.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      const right = document.documentElement.clientWidth - (rect.right + window.scrollX);
      if (left < 0) {
        this.pos.left = 0;
        delete this.pos.right;
      }
      if (right < 0) {
        this.pos.right = 0;
        delete this.pos.left;
      }
    }
  },
});
</script>

<template>
  <teleport to="body">
    <div v-if="show" ref="popover" class="popover" :style="{ ...style, ...pos }">
      <slot />
    </div>
  </teleport>
</template>

<style scoped>
.popover {
  position: absolute;
  padding: var(--paddingLarge);
  margin: var(--marginSmall) 0;
  background-color: var(--bg);
  border-radius: var(--borderRadius);
  box-shadow: var(--popoverShadow);
}
</style>
