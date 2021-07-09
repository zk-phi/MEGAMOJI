<script lang="ts">
import SelectBlock from "./SelectBlock.vue";
import animations from "../../constants/animations";

export default {
  components: {
    SelectBlock
  },
  props: {
    modelValue: { type: Object, default: null },
  },
  data: (): Record<string, unknown> => ({
    animations
  }),
  methods: {
    onChange(label): void {
      this.$emit('update:modelValue', animations.find((anime) => anime.label === label) || null);
    },
  },
  emits: [
    "update:modelValue",
  ],
};
</script>

<template>
  <SelectBlock
      :model-value="modelValue ? modelValue.label : ''"
      @update:model-value="onChange"
      label="アニメーション">
    <option value="">
      なし
    </option>
    <option v-for="(anime, ix) in animations" :value="anime.label">
      {{ anime.label }}
    </option>
  </SelectBlock>
</template>
