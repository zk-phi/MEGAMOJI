<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    images: { type: Array, required: true },
    darkMode: { type: Boolean, required: true },
    rounded: { type: Boolean, required: true },
  },
});
</script>

<template>
  <div :class="`preview ${darkMode ? 'dark' : 'light'}`">
    <div>
      文章中で使うとこんな
      <span v-for="(row, i) in images" :key="i">
        <img
            v-for="(col, j) in row"
            :key="j"
            :class="`img in_text ${ rounded ? 'mi2' : ''}`"
            :src="col">
      </span>
      感じ。
    </div>
  </div>
</template>

<style scoped>
.preview {
  padding: 12px;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #ccc;
}

.preview.light {
  color: #222;
  background-color: #fff;
}

.preview.dark {
  color: #222;
  background-color: #5de678;
}

.row {
  line-height: 0;
}

.img {
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.img.mi2 {
  border-radius: 30%;
}

.in_text {
  height: 19px;
  vertical-align: -0.2em;
}
</style>
