<script lang="ts">
import { defineComponent, PropType } from "vue";
import Button from "../inputs/Button.vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import Slider from "../inputs/Slider.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Checkbox from "../inputs/Checkbox.vue";
import ColorSample from "../global/ColorSample.vue";
import Space from "../global/Space.vue";
import OutlineItemBlock from "./OutlineItemBlock.vue";
import { absColor } from "../../utils/color";

type OutlineOption = { value: string, absColor: string };

export default defineComponent({
  components: {
    ToggleButton, ColorSample, OutlineItemBlock, Fieldset, Button, Space, Slider, Checkbox,
  },
  props: {
    modelValue: { type: Array as PropType<string[]>, required: true },
    thickness: { type: Number, required: true },
    posX: { type: Number, required: true },
    posY: { type: Number, required: true },
    baseColor: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue", "update:thickness", "update:posX", "update:posY",
  ],
  computed: {
    options(): OutlineOption[] {
      return [
        { value: "#000000", absColor: "#000000" },
        { value: "darker", absColor: absColor("darker", this.baseColor) },
        { value: "lighterer", absColor: absColor("lighterer", this.baseColor) },
      ];
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
    toggle3D(): void {
      if (this.posX === 0 && this.posY === 0) {
        this.$emit("update:thickness", 4);
        this.$emit("update:posX", -0.9);
        this.$emit("update:posY", -0.9);
      } else {
        this.$emit("update:thickness", 8);
        this.$emit("update:posX", 0);
        this.$emit("update:posY", 0);
      }
    }
  },
});
</script>

<template>
  <Space v-if="!showDetails" vertical full>
    <Fieldset v-if="!showDetails" label="アウトライン">
      <Space small>
        <ToggleButton
            v-for="option in options"
            :key="option.value"
            name="アウトライン"
            :model-value="modelValue"
            size="smallIcon"
            :value="option.value"
            @update:model-value="$emit('update:modelValue', $event)">
          <ColorSample :color="option.absColor" />
        </ToggleButton>
      </Space>
    </Fieldset>
    <Checkbox
        name="立体感"
        :model-value="posX !== 0 || posY !== 0"
        @update:model-value="toggle3D">
      {{ "立体感" }}
    </Checkbox>
  </Space>
  <Space v-else vertical full xlarge>
    <Fieldset label="アウトライン">
      <Space vertical full>
        <OutlineItemBlock
            v-for="(color, ix) in modelValue"
            :key="ix"
            :model-value="absColors[ix]"
            @update:model-value="update(ix, $event)"
            @remove="remove(ix) " />
        <Button type="dashed" name="アウトライン (追加)" block @click="add">
          + アウトラインを追加
        </Button>
      </Space>
    </Fieldset>
    <Fieldset label="アウトライン太さ">
      <Slider
          :model-value="thickness"
          block
          :min="2"
          :max="12"
          :step="1"
          @update:model-value="$emit('update:thickness', $event)" />
    </Fieldset>
    <Fieldset label="アウトライン位置 (横)">
      <Slider
          :model-value="posX"
          block
          :min="-1"
          :max="1"
          :step="0.1"
          @update:model-value="$emit('update:posX', $event)" />
    </Fieldset>
    <Fieldset label="アウトライン位置 (縦)">
      <Slider
          :model-value="posY"
          block
          :min="-1"
          :max="1"
          :step="0.1"
          @update:model-value="$emit('update:posY', $event)" />
    </Fieldset>
  </Space>
</template>
