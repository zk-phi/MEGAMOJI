<script lang="ts">
export default {
  props: {
    modelValue: { type: String, required: true },
    rows: { type: Number, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="control">
    <textarea
        :value="modelValue"
        class="textarea"
        :rows="rows"
        @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>
