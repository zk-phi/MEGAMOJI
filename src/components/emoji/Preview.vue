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
  },
});
</script>

<template>
  <div :class="`preview ${darkMode ? 'dark' : 'light'}`">
    <div>
      <b>ほげほげさん</b> <small>1:23 AM</small>
    </div>
    <div v-for="(row, i) in images" :key="i" class="row">
      <div
          v-for="(col, j) in row"
          :key="j"
          class="img large"
          :style="{ backgroundImage: `url(${col})` }" />
    </div>
    <div>
      ほげほげほげほげほげほげほげほげ。
    </div>
    <div>
      文章中で使うとこんな
      <span v-for="(row, i) in images" :key="i">
        <div
            v-for="(col, j) in row"
            :key="j"
            class="img in_text"
            :style="{ backgroundImage: `url(${col})` }" />
      </span>
      感じ。
    </div>
    <div>
      <span v-for="(row, i) in images" :key="i">
        <Reaction v-for="(col, j) in row" :key="j" :src="col" />
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

.large {
  width: 32px;
  height: 32px;
}

.in_text {
  width: 24px;
  height: 24px;
  vertical-align: bottom;
}
</style>
