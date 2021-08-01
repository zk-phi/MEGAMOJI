<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NSpace } from "naive-ui";
import Checkbox from "../inputs/Checkbox.vue";

export default defineComponent({
  components: {
    NFormItem, NSpace, Checkbox,
  },
  props: {
    modelValue: { type: Array, required: true },
    effects: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <NFormItem v-for="category in effects" :key="category.label" :label="category.label">
    <NSpace>
      <Checkbox
          v-for="effect in category.effects"
          :key="effect.label"
          :value="effect"
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)">
        {{ effect.label }}
      </Checkbox>
    </NSpace>
  </NFormItem>
</template>
