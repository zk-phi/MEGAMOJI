<script lang="ts">
import { NButton } from "naive-ui";

export default {
  components: {
    NButton,
  },
  props: {
    click: { type: Function, required: true },
  },
};
</script>

<template>
  <NButton @click="click" :block="true">
    <slot />
  </NButton>
</template>
