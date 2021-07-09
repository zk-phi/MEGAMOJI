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
      label="拡大縮小">
    <option value="">
      ぴっちり
    </option>
    <option value="cover">
      はみだす (アス比維持)
    </option>
    <option value="contain">
      おさめる (アス比維持)
    </option>
  </SelectBlock>
</template>
