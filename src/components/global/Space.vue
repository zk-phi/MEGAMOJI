<script lang="ts">
import { defineComponent, VNodeChild } from "vue";
import { children } from "../../utils/vue";
import Node from "../utils/Node.vue";

export default defineComponent({
  components: {
    Node
  },
  props: {
    vertical: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    full: { type: Boolean, default: false },
  },
  computed: {
    children(): VNodeChild[] {
      return children(this);
    },
  },
});
</script>

<template>
  <div :class="['space', { vertical, small, full }]">
    <div v-for="child in children" class="child">
      <Node :node="child" />
    </div>
  </div>
</template>

<style>
.space {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
  column-gap: var(--marginMedium);
  row-gap: var(--marginSmall);
}

.child {
  max-width: 100%;
}

.full {
  width: 100%;
}

.small {
  gap: var(--marginXSmall);
}

.vertical {
  flex-flow: column nowrap;
}
</style>
