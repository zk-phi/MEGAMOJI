<script lang="ts">
import { defineComponent } from "vue";
import { NColorPicker, NSlider } from "naive-ui";
import { absColor } from "../../utils/color";
import IconButton from "../inputs/IconButton.vue";
import Delete from "../icons/Delete.vue";

export default defineComponent({
  components: {
    IconButton, Delete, NColorPicker, NSlider,
  },
  props: {
    modelValue: { type: Object, required: true },
    baseColor: { type: String, required: true },
  },
  emits: [
    "update:modelValue",
    "remove",
  ],
  computed: {
    absColor(): string {
      return absColor(this.modelValue.color, this.baseColor);
    },
  },
  methods: {
    changeColor(val: string): void {
      this.$emit("update:modelValue", { color: val, pos: this.modelValue.pos });
    },
    changePos(val: string): void {
      this.$emit("update:modelValue", { color: this.modelValue.color, pos: Number(val) });
    },
  },
});
</script>

<template>
  <div style="display: flex; align-items: center; width: 100%;">
    <NColorPicker
        :modes="['hex']"
        :value="absColor"
        :show-alpha="false"
        style="width: 128px; margin-right: 8px;"
        @update:value="changeColor($event)" />
    <NSlider
        :value="modelValue.pos"
        :min="1"
        :max="100"
        style="margin-right: 8px;"
        @update:value="changePos($event)" />
    <IconButton type="danger" @click="$emit('remove')">
      <Delete />
    </IconButton>
  </div>
</template>
