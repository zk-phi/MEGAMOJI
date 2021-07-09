<script lang="ts">
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";
import CheckboxBlock from "../formblocks/CheckboxBlock.vue";

export default {
  components: {
    RawResult, Preview, CheckboxBlock,
  },
  props: {
    images: { type: Array, required: true },
  },
  data: (): Record<string, unknown> => ({
    previewMode: false,
  }),
};
</script>

<template>
  <div class="card">
    <div class="card-content result_area">
      <div class="field">
        <label class="label">絵文字 (右クリックで保存)</label>
        <RawResult v-if="!previewMode" :images="images" />
        <Preview v-if="previewMode" :images="images" :dark-mode="false" />
        <Preview v-if="previewMode" :images="images" :dark-mode="true" />
      </div>
      <CheckboxBlock v-model="previewMode">
        プレビュー
      </CheckboxBlock>
    </div>
  </div>
</template>
