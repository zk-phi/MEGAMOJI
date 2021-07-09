<script>
export default {
  props: ["modelValue", "font", "label"],
  emits: ["update:modelValue"],
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
