<script lang="ts">
export default {
  props: {
    images: { type: Array, required: true },
  },
}
</script>

<template>
  <div v-for="row in images" class="row">
    <img v-for="col in row" class="cell default" :src="col">
  </div>
</template>
