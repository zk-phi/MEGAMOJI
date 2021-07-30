<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: { type: String, default: "default" },
    block: { type: Boolean, default: false },
  },
  computed: {
    className(): string {
      return `button ${this.type}${this.block ? " block" : ""}`;
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
.button {
  display: inline-block;
  box-sizing: border-box;
  padding: var(--paddingMedium);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--borderRadius);
}

.block {
  display: block;
  width: 100%;
}

.default {
  color: var(--primary);
  border-color: var(--primary);
}

.default:hover {
  color: var(--primaryHover);
  border-color: var(--primaryHover);
}

.default:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.text {
  padding: 0;
  color: var(--fg);
}

.text:hover {
  color: var(--primaryHover);
}

.text:active {
  color: var(--primaryActive);
}

.dashed {
  color: var(--fg);
  border-color: var(--border);
  border-style: dashed;
}

.dashed:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.dashed:active {
  color: var(--primaryActive);
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.primary {
  color: var(--distantFg);
  background-color: var(--primary);
}

.primary:hover {
  background-color: var(--primaryHover);
}

.primary:active {
  background-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}
</style>
