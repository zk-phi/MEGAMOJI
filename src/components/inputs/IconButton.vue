<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: { type: String, default: "default" },
  },
  computed: {
    className(): string {
      return `icon-button ${this.type}`;
    },
  },
});
</script>

<template>
  <button :class="className">
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-block;
  padding: 0;
  font-size: var(--iconButtonSize);
  line-height: 1;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.default {
  color: var(--fg);
}

.default:hover {
  color: var(--primary);
}

.default:active {
  color: var(--primaryActive);
}

.danger {
  color: var(--fg);
}

.danger:hover {
  color: var(--danger);
}

.danger:active {
  color: var(--dangerActive);
}
</style>
