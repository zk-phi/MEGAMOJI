<script lang="ts">
import { defineComponent } from "vue";
import { NInputNumber } from "naive-ui";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";

export default defineComponent({
  components: {
    Fieldset, Space, NInputNumber,
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
    </Space>
  </Fieldset>
</template>
