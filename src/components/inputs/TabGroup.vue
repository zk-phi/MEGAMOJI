<script lang="ts">
import { defineComponent } from "vue";
import Space from "../global/Space.vue";

export default defineComponent({
  components: {
    Space,
  },
});
</script>

<template>
  <div class="tab-group">
    <Space small>
      <slot />
    </Space>
  </div>
</template>

<style scoped>
.tab-group {
  border-bottom: 1px solid var(--border);
}
</style>
