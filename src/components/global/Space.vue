<script lang="ts">
import { defineComponent, VNodeChild } from "vue";
import { children } from "../../utils/vue";
import Node from "../utils/Node.vue";

export default defineComponent({
  components: {
    Node,
  },
  props: {
    vertical: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    full: { type: Boolean, default: false },
    xlarge: { type: Boolean, default: false },
  },
  computed: {
    children(): VNodeChild[] {
      return children(this);
    },
  },
});
</script>

<template>
  <div :class="['space', { vertical, small, large, full, xlarge }]">
    <div v-for="(child, ix) in children" :key="ix" class="child">
      <Node :node="child" />
    </div>
  </div>
</template>

<style scoped>
.space {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  gap: var(--spacingMedium);
}

.child {
  max-width: 100%;
}

.full {
  width: 100%;
}

.space.xlarge {
  gap: var(--spacingXLarge);
}

.space.large {
  gap: var(--spacingLarge);
}

.space.small {
  gap: var(--spacingSmall);
}

.vertical {
  flex-flow: column nowrap;
}
</style>
