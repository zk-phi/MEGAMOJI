<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    parts: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<style scoped>
.part {
  width: 48px;
  height: 48px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
}

.part:hover {
  border: 1px solid #aaa;
}

.part:active {
  border: 1px solid #0c7a43;
}

.part.selected {
  border: 1px solid #18a058;
}
</style>

<template>
  <div class="field">
    <img
        v-for="p in parts"
        :key="p"
        :class="'part' + (modelValue == p ? ' selected' : '')"
        :src="p"
        @click="$emit('update:modelValue', p)">
  </div>
</template>
