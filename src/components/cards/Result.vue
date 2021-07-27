<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NSpace, NSwitch } from "naive-ui";
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";

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
    RawResult, Preview, NCard, NSpace, NSwitch,
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
  <NCard :style="transparentBg" title="絵文字">
    <NSpace vertical>
      <RawResult v-if="!previewMode" :images="images" />
      <Preview v-if="previewMode" :images="images" :dark-mode="false" />
      <Preview v-if="previewMode" :images="images" :dark-mode="true" />
      <NSpace>
        <NSwitch v-model:value="previewMode" />
        <span>プレビュー</span>
      </NSpace>
    </NSpace>
  </NCard>
</template>
