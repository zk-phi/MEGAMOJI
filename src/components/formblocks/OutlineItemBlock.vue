<script lang="ts">
import { defineComponent } from "vue";
import IconButton from "../inputs/IconButton.vue";
import Color from "../inputs/Color.vue";
import Delete from "../icons/Delete.vue";

export default defineComponent({
  components: {
    IconButton, Delete, Color,
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
    "remove",
  ],
});
</script>

<template>
  <div style="display: flex; align-items: center; width: 100%;">
    <Color
        block
        :model-value="modelValue"
        style="margin-right: var(--spacingInlineSmall);"
        @update:model-value="$emit('update:modelValue', $event)" />
    <IconButton type="danger" @click="$emit('remove')">
      <Delete />
    </IconButton>
  </div>
</template>
