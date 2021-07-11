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
  <NButton :block="true" @click="click">
    <slot />
  </NButton>
</template>
