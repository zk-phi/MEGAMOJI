<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    images: { type: Array, required: true },
    rounded: { type: Boolean, required: true },
  },
});
</script>

<template>
  <div v-for="(row, i) in images" :key="i" class="result-raw">
    <img
        v-for="(col, j) in row"
        :key="j"
        :class="`result-cell ${ rounded ? 'rounded' : ''}`"
        :src="col">
  </div>
</template>

<style scoped>
.result-raw {
  line-height: 0;
}

.result-cell {
  border: 1px solid #aaa;
}

.result-cell.rounded {
  border-radius: 30%;
}
</style>
