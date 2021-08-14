<script lang="ts">
import { defineComponent } from "vue";
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";

const transparentBg = {
  backgroundPosition: "0 0, 10px 10px",
  backgroundSize: "20px 20px",
  backgroundImage: `
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef)
  `,
};

export default defineComponent({
  components: {
    RawResult, Preview, Checkbox, Card, Space,
  },
  props: {
    images: { type: Array, required: true },
  },
  data() {
    return {
      transparentBg,
      previewMode: false,
    };
  },
});
</script>

<template>
  <Card :style="transparentBg" title="絵文字">
    <Space vertical>
      <RawResult v-if="!previewMode" :images="images" />
      <Preview v-if="previewMode" :images="images" :dark-mode="false" />
      <Preview v-if="previewMode" :images="images" :dark-mode="true" />
      <Checkbox v-model="previewMode">
        {{ "プレビューモード" }}
      </Checkbox>
    </Space>
  </Card>
</template>
