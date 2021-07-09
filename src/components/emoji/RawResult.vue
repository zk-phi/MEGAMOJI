<script lang="ts">
export default {
  props: {
    images: { type: Array, required: true },
  },
};
</script>

<template>
  <div v-for="(row, i) in images" :key="i" class="row">
    <img v-for="(col, j) in row" :key="j" class="cell default" :src="col">
  </div>
</template>
