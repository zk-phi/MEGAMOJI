<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    src: { type: String, required: true },
  },
});
</script>

<template>
  <div class="reaction">
    <img class="reaction_icon" :src="src"> 5
  </div>
</template>

<style scoped>
.reaction {
  display: inline-block;
  padding: 3px 6px;
  margin: 2px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  background-color: rgba(128, 128, 128, 0.3);
  border: 1px solid transparent;
  border-radius: 12px;
}

.reaction:hover {
  background-color: rgba(128, 128, 128, 0.2);
  border-color: currentColor;
}

.reaction_icon {
  display: inline-block;
  height: 19px;
  vertical-align: -5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
</style>
