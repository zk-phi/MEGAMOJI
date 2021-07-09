<script lang="ts">
import SelectBlock from "./SelectBlock.vue";

export default {
  components: {
    SelectBlock,
  },
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue"
      label="スピード"
      @update:model-value="$emit('update:modelValue', $event)">
    <option value="">
      普通
    </option>
    <option value="turbo">
      速い
    </option>
    <option value="super-turbo">
      爆速
    </option>
  </SelectBlock>
</template>
