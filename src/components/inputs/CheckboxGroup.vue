<script>
import { NSpace } from "naive-ui";

export default {
  components: {
    NSpace
  },
};
</script>

<template>
  <NSpace item-style="display: flex">
    <slot />
  </NSpace>
</template>
