<script lang="ts">
export default {
  props: {
    modelValue: { type: Object, required: true },
    onRemove: { type: Function, required: true },
  },
  methods: {
    changeColor (e) {
      this.$emit('update:modelValue', { color: e.target.value, pos: this.modelValue.pos });
    },
    changePos (e) {
      this.$emit('update:modelValue', { color: this.modelValue.color, pos: e.target.value });
    },
  },
  emits: [
    "update:modelValue",
    "remove"
  ],
};
</script>

<template>
  <div class="field has-addons">
    <div class="control">
      <input
          :value="modelValue.color"
          type="color"
          class="input"
          @change="changeColor">
    </div>
    <div class="control is-expanded">
      <input
          :value="modelValue.pos"
          class="input"
          type="range"
          min="1"
          max="100"
          @change="changePos">
    </div>
    <div class="control">
      <button class="button" @click="$emit('remove')">
        x
      </button>
    </div>
  </div>
</template>
