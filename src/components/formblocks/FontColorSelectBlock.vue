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
  data: () => ({
    fontcolors,
  }),
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <div class="field">
    <label class="label">色</label>
    <div v-for="row in fontcolors" :key="row[0]" class="control">
      <FontColorOption
          v-for="color in row"
          :ix="color"
          :model-value="modelValue"
          :color="color"
          @update:model-value="$emit('update:modelValue', $event)" />
    </div>
  </div>
  <ColorBlock
      v-if="showDetails"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      label="その他の色" />
</template>
