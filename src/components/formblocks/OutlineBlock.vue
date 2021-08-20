<script lang="ts">
import { defineComponent, PropType } from "vue";
import Button from "../inputs/Button.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import ColorSample from "../global/ColorSample.vue";
import Space from "../global/Space.vue";
import OutlineItemBlock from "./OutlineItemBlock.vue";
import { absColor } from "../../utils/color";

export default defineComponent({
  components: {
    ToggleButton, ColorSample, OutlineItemBlock, Fieldset, Button, Space,
  },
  props: {
    modelValue: { type: Array as PropType<string[]>, required: true },
    baseColor: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    darker(): string {
      return absColor("darker", this.baseColor);
    },
    absColors(): string[] {
      return this.modelValue.map((color) => absColor(color, this.baseColor));
    },
  },
  methods: {
    update(ix: number, value: string): void {
      this.$emit("update:modelValue", this.modelValue.map((origVal, i) => (
        ix === i ? value : origVal
      )));
    },
    add(): void {
      this.$emit("update:modelValue", [...this.modelValue, "identical"]);
    },
    remove(ix: number): void {
      this.$emit("update:modelValue", this.modelValue.filter((_, i) => i !== ix));
    },
  },
});
</script>

<template>
  <Fieldset v-if="!showDetails" label="アウトライン">
    <Space small>
      <ToggleButton
          :model-value="modelValue"
          size="smallIcon"
          value="#000000"
          @update:modelValue="$emit('update:modelValue', $event)">
        <ColorSample color="#000000" />
      </ToggleButton>
      <ToggleButton
          :model-value="modelValue"
          size="smallIcon"
          value="darker"
          @update:model-value="$emit('update:modelValue', $event)">
        <ColorSample :color="darker" />
      </ToggleButton>
    </Space>
  </Fieldset>
  <Fieldset v-else label="アウトライン">
    <Space vertical full>
      <OutlineItemBlock
          v-for="(color, ix) in modelValue"
          :key="ix"
          :model-value="absColors[ix]"
          @update:model-value="update(ix, $event)"
          @remove="remove(ix) " />
      <Button type="dashed" block @click="add">
        + アウトラインを追加
      </Button>
    </Space>
  </Fieldset>
</template>
