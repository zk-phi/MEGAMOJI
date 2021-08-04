<script lang="ts">
import { defineComponent } from "vue";
import { NColorPicker } from "naive-ui";
import ToggleButton from "../inputs/ToggleButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import ColorSample from "../global/ColorSample.vue";
import Space from "../global/Space.vue";
import fontcolors from "../../constants/fontcolors";

export default defineComponent({
  components: {
    ToggleButton, ColorSample, NColorPicker, Space, Fieldset,
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
  <Fieldset v-if="!showDetails" label="色">
    <Space small vertical>
      <Space v-for="row in fontcolors" small :key="row[0]">
        <ToggleButton
            v-for="color in row"
            size="small"
            :key="color"
            :model-value="modelValue"
            :value="color"
            @update:model-value="$emit('update:modelValue', $event)">
          <ColorSample :color="color" />
        </ToggleButton>
      </Space>
    </Space>
  </Fieldset>
  <Fieldset v-else label="色">
    <NColorPicker
        :modes="['hex']"
        :value="modelValue"
        :show-alpha="false"
        @update:value="$emit('update:modelValue', $event)" />
  </Fieldset>
</template>
