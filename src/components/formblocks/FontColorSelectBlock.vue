<script lang="ts">
import FontColorOption from "../inputs/FontColorOption.vue";
import ColorBlock from "./ColorBlock.vue";
import fontcolors from "../../constants/fontcolors";

export default {
  components: {
    FontColorOption, ColorBlock,
  },
  props: {
    modelValue: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  data: (): Record<string, unknown> => ({
    fontcolors,
  }),
};
</script>

<template>
  <div class="field">
    <label class="label">色</label>
    <div v-for="row in fontcolors" :key="row[0]" class="control">
      <FontColorOption
          v-for="color in row"
          :key="color"
          :model-value="modelValue"
          :color="color"
          @update:model-value="$emit('update:modelValue', $event)" />
    </div>
  </div>
  <ColorBlock
      v-if="showDetails"
      :model-value="modelValue"
      label="その他の色"
      @update:model-value="$emit('update:modelValue', $event)" />
</template>
