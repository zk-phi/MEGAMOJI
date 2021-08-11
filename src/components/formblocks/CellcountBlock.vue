<script lang="ts">
import { defineComponent } from "vue";
import Fieldset from "../inputs/Fieldset.vue";
import Number from "../inputs/Number.vue";
import Space from "../global/Space.vue";

export default defineComponent({
  components: {
    Fieldset, Space, Number,
  },
  props: {
    modelValue: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <Fieldset label="分割">
    <Space>
      <Number
          :model-value="modelValue[0]"
          :min="1"
          style="width: 100px;"
          @update:model-value="$emit('update:modelValue', [$event, modelValue[1]])" />
      <span>x</span>
      <Number
          :model-value="modelValue[1]"
          :min="1"
          style="width: 100px;"
          @update:model-value="$emit('update:modelValue', [modelValue[0], $event])" />
    </Space>
  </Fieldset>
</template>
