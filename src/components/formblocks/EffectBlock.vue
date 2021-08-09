<script lang="ts">
import { defineComponent } from "vue";
import Checkbox from "../inputs/Checkbox.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";

export default defineComponent({
  components: {
    Fieldset, Space, Checkbox,
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
  <Space vertical xlarge full>
    <Fieldset v-for="category in effects" :key="category.label" :label="category.label">
      <Space>
        <Checkbox
            v-for="effect in category.effects"
            :key="effect.label"
            :value="effect"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)">
          {{ effect.label }}
        </Checkbox>
      </Space>
    </Fieldset>
  </Space>
</template>
