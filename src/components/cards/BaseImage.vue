<script lang="ts">
import { defineComponent, PropType } from "vue";
import Card from "../global/Card.vue";

export default defineComponent({
  components: {
    Card,
  },
  props: {
    image: { type: Object as PropType<HTMLCanvasElement>, required: true },
  },
  computed: {
    imageUrl(): string {
      return this.image.toDataURL();
    },
  },
});
</script>

<template>
  <Space vertical large>
    <Card class="result" title="元画像">
      <img class="base-image" :src="imageUrl">
    </Card>
  </Space>
</template>

<style scoped>
.base-image {
  max-width: 260px;
}

.result {
  background-image:
    linear-gradient(
      45deg,
      var(--bg) 25%,
      transparent 25%,
      transparent 75%,
      var(--bg) 75%,
      var(--bg)
    ),
    linear-gradient(
      45deg,
      var(--bg) 25%,
      transparent 25%,
      transparent 75%,
      var(--bg) 75%,
      var(--bg)
    );
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
}
</style>
