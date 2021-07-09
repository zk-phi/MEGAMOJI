<script>
export default {
  props: ["value", "font", "label"],
};
</script>

<template>
  <div class="control">
    <label class="radio" :style="{ font: font }">
      <input type="radio" :checked="value === font" @change="$emit('input', font)">
      <slot />
    </label>
  </div>
</template>
