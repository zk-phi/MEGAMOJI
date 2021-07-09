<script lang="ts">
import OutlineOption from "../inputs/OutlineOption.vue";
import ButtonBlock from "./ButtonBlock.vue";
import { darkerColor, lighterColor } from "../../utils/color";

export default {
  components: {
    OutlineOption, ButtonBlock,
  },
  props: {
    modelValue: { type: Array, required: true },
    baseColor: { type: String, required: true },
    showDetails: { type: Boolean, required: true },
  },
  emits: [
    "update:modelValue",
  ],
  computed: {
    colors(): string[] {
      return this.modelValue.map((color) => {
        if (color === "darker") {
          return darkerColor(this.baseColor);
        } else if (color === "lighter") {
          return lighterColor(this.baseColor);
        } else if (color === "identical") {
          return this.baseColor;
        } else {
          return color;
        }
      });
    },
  },
  methods: {
    update(ix, value): void {
      this.$emit("update:modelValue", this.modelValue.map((origVal, i) => (
        ix === i ? value : origVal
      )));
    },
    add(): void {
      this.$emit("update:modelValue", [...this.modelValue, this.baseColor]);
    },
    remove(ix): void {
      this.$emit("update:modelValue", this.modelValue.filter((_, i) => i !== ix));
    },
  },
};
</script>

<template>
  <div class="field">
    <label class="label">アウトライン</label>
    <div class="control">
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="#000000"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="darker"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="identical"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="lighter"
          @update:modelValue="$emit('update:modelValue', $event)" />
      <OutlineOption
          :model-value="modelValue"
          :base-color="baseColor"
          color="#ffffff"
          @update:modelValue="$emit('update:modelValue', $event)" />
    </div>
  </div>
  <div v-if="showDetails">
    <div class="field">
      <label class="label">その他のアウトライン</label>
    </div>
    <div v-for="(color, ix) in modelValue" class="field has-addons">
      <div class="control is-expanded">
        <input
            class="input"
            type="color"
            :value="colors[ix]"
            @change="update(ix, $event.target.value)">
      </div>
      <div class="control">
        <button class="button" @click="remove(ix)">
          x
        </button>
      </div>
    </div>
    <ButtonBlock :click="add">
      + アウトラインを追加
    </ButtonBlock>
  </div>
</template>
