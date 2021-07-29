<script lang="ts">
import { defineComponent } from "vue";
import { NColorPicker } from "naive-ui";
import IconButton from "../inputs/IconButton.vue";
import Delete from "../icons/Delete.vue";

export default defineComponent({
  components: {
    IconButton, Delete, NColorPicker,
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
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        style="margin-right: 8px;"
        @update:value="$emit('update:modelValue', $event)" />
    <IconButton type="danger" @click="$emit('remove')">
      <Delete />
    </IconButton>
  </div>
</template>
