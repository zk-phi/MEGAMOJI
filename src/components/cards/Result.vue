<script lang="ts">
import { defineComponent } from "vue";
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";

export default defineComponent({
  components: {
    RawResult, Preview, Checkbox, Card, Space,
  },
  props: {
    images: { type: Array, required: true },
  },
  data() {
    return {
      previewMode: false,
    };
  },
});
</script>

<template>
  <Card class="result" title="プレビュー">
    <Space vertical large>
      <RawResult v-if="!previewMode" :images="images" />
      <Preview v-if="previewMode" :images="images" :dark-mode="false" />
      <Preview v-if="previewMode" :images="images" :dark-mode="true" />
      <Checkbox v-model="previewMode">
        {{ "サンプル表示" }}
      </Checkbox>
    </Space>
  </Card>
</template>

<style scoped>
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
