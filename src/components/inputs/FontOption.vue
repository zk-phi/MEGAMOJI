<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    font: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="control">
    <label class="radio" :style="{ font: font }">
      <input
          type="radio"
          :checked="modelValue === font"
          @change="$emit('update:modelValue', font)">
      <slot />
    </label>
  </div>
</template>
