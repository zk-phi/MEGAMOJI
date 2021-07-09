<script>
export default {
  props: ["modelValue", "color"],
  emits: ["update:modelValue"],
};
</script>

<template>
  <label class="radio" :style="{ color: color === '#ffffff' ? '#000000' : color }">
    <input
      type="radio"
      :checked="modelValue === color"
      @change="$emit('update:modelValue', color)">
    {{ color === "#ffffff" ? "♢" : "◆" }}
  </label>
</template>
