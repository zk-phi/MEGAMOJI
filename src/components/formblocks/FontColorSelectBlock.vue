<script lang="ts">
import { defineComponent } from "vue";
import { NSpace, NFormItem } from "naive-ui";
import FontColorOption from "../inputs/FontColorOption.vue";
import ColorBlock from "./ColorBlock.vue";
import fontcolors from "../../constants/fontcolors";

export default defineComponent({
  components: {
    FontColorOption, ColorBlock, NSpace, NFormItem,
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
  <ColorBlock
      v-else
      :model-value="modelValue"
      label="色"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
