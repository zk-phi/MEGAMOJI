<script lang="ts">
import { defineComponent } from "vue";
import { NSpace } from "naive-ui";
import ToggleButton from "../inputs/ToggleButton.vue";

export default defineComponent({
  components: {
    ToggleButton, NSpace,
  },
  props: {
    modelValue: { type: String, required: true },
    parts: { type: Array, required: true },
  },
  emits: [
    "update:modelValue",
  ],
});
</script>

<template>
  <NSpace>
    <ToggleButton
        v-for="p in parts"
        :key="p"
        size="part"
        :value="p"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)">
      <img class="img" :src="p">
    </ToggleButton>
  </NSpace>
</template>

<style scoped>
.img {
  height: 1em;
  vertical-align: middle;
}
</style>
