<script lang="ts">
export default {
  props: {
    images: { type: Array, required: true },
  },
};
</script>

<template>
  <div v-for="(row, i) in images" :key="i" style="line-height: 0;">
    <img v-for="(col, j) in row" :key="j" style="border: 1px solid #aaa;" :src="col">
  </div>
</template>
