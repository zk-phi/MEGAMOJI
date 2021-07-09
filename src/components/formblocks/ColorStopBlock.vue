<script lang="ts">
export default {
  props: {
    modelValue: { type: Object, required: true },
    onRemove: { type: Function, required: true },
  },
  emits: [
    "update:modelValue",
    "remove",
  ],
  methods: {
    changeColor(val: string): void {
      this.$emit("update:modelValue", { color: val, pos: this.modelValue.pos });
    },
    changePos(val: string): void {
      this.$emit("update:modelValue", { color: this.modelValue.color, pos: Number(val) });
    },
  },
};
</script>

<template>
  <div class="field has-addons">
    <div class="control">
      <input
          :value="modelValue.color"
          type="color"
          class="input"
          @change="changeColor($event.target.value)">
    </div>
    <div class="control is-expanded">
      <input
          :value="modelValue.pos"
          class="input"
          type="range"
          min="1"
          max="100"
          @change="changePos($event.target.value)">
    </div>
    <div class="control">
      <button class="button" @click="$emit('remove')">
        x
      </button>
    </div>
  </div>
</template>
