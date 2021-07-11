<script lang="ts">
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";
import SwitchBlock from "../formblocks/SwitchBlock.vue";
import { NFormItem, NCard, NSpace, NSwitch } from "naive-ui";

const transparentBg = {
  backgroundPosition: "0 0, 10px 10px",
  backgroundSize: "20px 20px",
  backgroundImage: `
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef)
  `,
};

export default {
  components: {
    RawResult, Preview, SwitchBlock, NFormItem, NCard, NSpace, NSwitch,
  },
  props: {
    images: { type: Array, required: true },
  },
  data: (): Record<string, unknown> => ({
    transparentBg,
    previewMode: false,
  }),
};
</script>

<template>
  <NCard :style="transparentBg" title="絵文字 (右クリックで保存)">
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
