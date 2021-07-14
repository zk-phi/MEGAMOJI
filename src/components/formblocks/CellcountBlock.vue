<script lang="ts">
import { NFormItem, NSpace, NInputNumber } from "naive-ui";

export default {
  components: {
    NFormItem, NSpace, NInputNumber,
  },
  props: {
    modelValue: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <NFormItem label="分割">
    <NSpace>
      <NInputNumber
          :value="modelValue[0]"
          :min="1"
          style="width: 90px;"
          @update:value="$emit('update:modelValue', [$event, modelValue[1]])" />
      <span>x</span>
      <NInputNumber
          :value="modelValue[1]"
          :min="1"
          style="width: 90px;"
          @update:value="$emit('update:modelValue', [modelValue[0], $event])" />
    </NSpace>
  </NFormItem>
</template>
