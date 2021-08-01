<script lang="ts">
import { defineComponent } from "vue";
import { NSpace, NFormItem, NColorPicker } from "naive-ui";
import ToggleButton from "../inputs/ToggleButton.vue";
import ColorSample from "../global/ColorSample.vue";
import fontcolors from "../../constants/fontcolors";

export default defineComponent({
  components: {
    ToggleButton, ColorSample, NColorPicker, NSpace, NFormItem,
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
        <ToggleButton
            v-for="color in row"
            :key="color"
            :model-value="modelValue"
            :value="color"
            @update:model-value="$emit('update:modelValue', $event)">
          <ColorSample :color="color" />
        </ToggleButton>
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
