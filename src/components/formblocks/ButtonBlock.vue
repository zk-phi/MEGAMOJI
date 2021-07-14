<script lang="ts">
import { defineComponent } from "vue";
import { NButton } from "naive-ui";

export default defineComponent({
  components: {
    NButton,
  },
  props: {
    click: { type: Function, required: true },
  },
});
</script>

<template>
  <NButton :block="true" @click="click">
    <slot />
  </NButton>
</template>
