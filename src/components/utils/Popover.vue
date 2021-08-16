<script lang="ts">
import { defineComponent, PropType } from "vue";
import { elementIsContained } from "../../utils/dom";

export default defineComponent({
  props: {
    el: { type: Object as PropType<HTMLElement>, default: null },
    show: { type: Boolean, required: true },
    onHide: { type: Function, required: true },
    refresh: { type: Number, default: null },
  },
  data: () => ({
    style: {},
    hideHandler: null,
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
          this.hideHandler = (e) => {
            if (!elementIsContained(e.target, this.$refs.popover)) {
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
        this.style = {};
      } else {
        const rect = this.el.getBoundingClientRect();
        const style = {};
        if (rect.left < window.innerWidth / 2) {
          style.left = `${rect.left + window.scrollX}px`;
        } else {
          style.right = `${document.documentElement.clientWidth - (rect.right + window.scrollX)}px`;
        }
        if (rect.top < window.innerHeight / 2) {
          style.top = `${rect.bottom + window.scrollY}px`;
          style.width = `${rect.width}`;
        } else {
          style.bottom = `${document.documentElement.clientHeight - (rect.top + window.scrollY)}px`;
          style.width = `${rect.width}`;
        }
        this.style = style;
      }
    },
  },
});
</script>

<template>
  <teleport to="body">
    <div v-if="show" ref="popover" class="popover" :style="style">
      <slot />
    </div>
  </teleport>
</template>

<style scoped>
.popover {
  position: absolute;
  margin: var(--marginSmall) 0;
  padding: var(--paddingLarge);
  background-color: var(--bg);
  border-radius: var(--borderRadius);
  box-shadow: var(--popoverShadow);
}
</style>
