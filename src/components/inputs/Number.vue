<script lang="ts">
import { defineComponent } from "vue";
import Decrement from "../icons/Decrement.vue";
import Increment from "../icons/Increment.vue";

export default defineComponent({
  components: {
    Decrement, Increment,
  },
  props: {
    modelValue: { type: Number, required: true },
    block: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Infinity },
  },
  emits: [
    "update:modelValue",
  ],
  methods: {
    onChange(value: string): void {
      const number = Number(value);
      if (!Number.isNaN(number)) {
        this.$emit("update:modelValue", Math.min(this.max, Math.max(this.min, number)));
      }
    },
  },
});
</script>

<template>
  <div :class="['wrapper', { block }]">
    <input
        class="number"
        type="text"
        :value="modelValue"
        @input="onChange($event.target.value)">
    <div class="buttons">
      <button class="button" @click="onChange(modelValue - 1)">
        <Decrement />
      </button>
      <button class="button" @click="onChange(modelValue + 1)">
        <Increment />
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
}

.block {
  display: block;
  width: 100%;
}

.number {
  width: 100%;
  box-sizing: border-box;
  padding: var(--numberPadding);
  font-size: var(--fontSizeMedium);
  line-height: 1;
  color: var(--fg);
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--borderRadius);
  outline: none;
}

.number:hover {
  border-color: var(--primary);
}

.number:focus {
  border-color: var(--primary);
  box-shadow: var(--primaryShadow);
}

.number:active {
  border-color: var(--primaryActive);
  box-shadow: var(--primaryShadow);
}

.buttons {
  position: absolute;
  top: var(--paddingV);
  right: calc(var(--paddingH) - var(--spacingInlineSmall));
}

.button {
  padding: 0;
  font-size: var(--fontSizeXLarge);
  line-height: 1;
  color: var(--border);
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.button:hover {
  color: var(--primary);
}

.button:active {
  color: var(--primaryActive);
}
</style>
