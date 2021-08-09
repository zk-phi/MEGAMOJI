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
    numColumns() {
      return this.columns.find((item) => this.width <= item[0])[1];
    },
  },
  mounted() {
    this.observer = new ResizeObserver((entries) => {
      this.width = entries[0].contentRect.width;
    });
    this.observer.observe(this.$el);
  },
  beforeUnmount() {
    this.observer.disconnect();
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
