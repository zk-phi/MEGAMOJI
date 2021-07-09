<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="control">
    <input
        :value="modelValue"
        class="input"
        type="text"
        @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>
