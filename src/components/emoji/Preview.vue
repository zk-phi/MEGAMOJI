<script lang="ts">
export default {
  props: {
    images: { type: Array, required: true },
    darkMode: { type: Boolean, required: true },
  },
};
</script>

<template>
  <div :class="`preview ${darkMode ? 'dark' : 'light'}`">
    <div>
      <b>zk-phi</b> <small>1:23 AM</small>
    </div>
    <div v-for="(row, i) in images" :key="i" class="row">
      <img v-for="(col, j) in row" :key="j" class="cell large" :src="col">
    </div>
    <div>
      ほげほげほげほげほげほげほげほげ。
    </div>
    <div>
      文章中で使うとこんな
      <span v-for="(row, i) in images" :key="i">
        <img v-for="(col, j) in row" :key="j" class="cell small" :src="col">
      </span>
      感じ。
    </div>
    <div>
      <span v-for="(row, i) in images" :key="i">
        <div v-for="(col, j) in row" :key="j" class="reaction">
          <img class="cell smallest" :src="col"> 5
        </div>
      </span>
    </div>
  </div>
</template>
