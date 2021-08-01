<script lang="ts">
import { defineComponent } from "vue";
import { NSpace, NFormItem, NColorPicker } from "naive-ui";
import FontColorOption from "../inputs/FontColorOption.vue";
import fontcolors from "../../constants/fontcolors";

export default defineComponent({
  components: {
    FontColorOption, NColorPicker, NSpace, NFormItem,
  },
  props: {
    modelValue: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data() {
    return {
      fontcolors,
    };
  },
});
</script>

<template>
  <NFormItem v-if="!showDetails" label="色">
    <NSpace vertical>
      <NSpace v-for="row in fontcolors" :key="row[0]">
        <FontColorOption
            v-for="color in row"
            :key="color"
            :model-value="modelValue"
            :color="color"
            @update:model-value="$emit('update:modelValue', $event)" />
      </NSpace>
    </NSpace>
  </NFormItem>
  <NFormItem v-else label="色">
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        @update:value="$emit('update:modelValue', $event)" />
  </NFormItem>
</template>
