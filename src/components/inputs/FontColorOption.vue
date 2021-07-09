<script>
export default {
  props: ["value", "color"],
};
</script>

<template>
  <label class="radio" :style="{ color: color === '#ffffff' ? '#000000' : color }">
    <input :checked="value === color" type="radio" @change="$emit('input', color)">
    {{ color === "#ffffff" ? "♢" : "◆" }}
  </label>
</template>
