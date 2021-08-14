<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  provide() {
    return {
      numColumns: () => this.numColumns,
    };
  },
  props: {
    columns: { type: Array as PropType<number[][]>, required: true },
  },
  data: () => ({
    width: 0,
  }),
  computed: {
    numColumns(): number {
      const column = this.columns.find((item) => this.width <= item[0]);
      return column ? column[1] : 1;
    },
  },
  methods: {
    updateWidth() {
      this.width = this.$el.getBoundingClientRect().width;
    }
  },
  mounted() {
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  },
});
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }">
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--marginXLarge);
}
</style>
