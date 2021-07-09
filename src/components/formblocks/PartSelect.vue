<script lang="ts">
export default {
  props: {
    show: { type: Boolean, required: true },
    modelValue: { type: String, required: true },
    parts: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div v-if="show" class="field">
    <div class="fukumoji">
      <img
          v-for="p in parts"
          :key="p"
          :class="'part' + (modelValue == p ? ' selected' : '')"
          :src="p"
          @click="$emit('update:modelValue', p)">
    </div>
  </div>
</template>
