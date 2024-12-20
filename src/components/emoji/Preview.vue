<script lang="ts">
import { defineComponent } from "vue";
import Reaction from "./Reaction.vue";

export default defineComponent({
  components: {
    Reaction,
  },
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
      <b>ほげほげさん</b> <small>1:23 AM</small>
    </div>
    <div v-for="(row, i) in images" :key="i" class="row">
      <img
          v-for="(col, j) in row"
          :key="j"
          :class="`img large ${ rounded ? 'mi2' : ''}`"
          :src="col">
    </div>
    <div>
      ほげほげほげほげほげほげほげほげ。
    </div>
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
    <div>
      <span v-for="(row, i) in images" :key="i">
        <Reaction
            v-for="(col, j) in row"
            :key="j"
            :src="col"
            :rounded="rounded" />
      </span>
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
  color: #ddd;
  background-color: #333;
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

.large {
  height: 32px;
}

.in_text {
  height: 24px;
  vertical-align: bottom;
}
</style>
