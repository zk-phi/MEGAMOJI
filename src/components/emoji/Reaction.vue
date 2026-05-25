<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: { type: String, required: true },
    rounded: { type: Boolean, required: true },
  },
});
</script>

<template>
  <img :class="`reaction_icon ${ rounded ? 'mi2' : ''}`" :src="src">
</template>

<style scoped>
.reaction_icon {
  display: inline-block;
  height: 19px;
  vertical-align: -5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.reaction_icon.mi2 {
  border-radius: 30%;
}
</style>
