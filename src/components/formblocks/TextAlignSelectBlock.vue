<script lang="ts">
import SelectBlock from "./SelectBlock.vue";

export default {
  components: {
    SelectBlock
  },
  props: {
    modelValue: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      label="揃え">
    <option value="stretch">
      両端
    </option>
    <option value="left">
      左
    </option>
    <option value="center">
      中央
    </option>
    <option value="right">
      右
    </option>
  </SelectBlock>
</template>
