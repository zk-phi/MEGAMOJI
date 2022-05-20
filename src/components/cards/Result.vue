<script lang="ts">
import { defineComponent, PropType } from "vue";
import { saveAs } from "file-saver";
import { extension, prepareDownloadFile } from "../../utils/file";
import Analytics from "../../utils/analytics";
import RawResult from "../emoji/RawResult.vue";
import Preview from "../emoji/Preview.vue";
import Button from "../inputs/Button.vue";
import Checkbox from "../inputs/Checkbox.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Effect from "../icons/Effect.vue";
import Back from "../icons/Back.vue";
import Save from "../icons/Save.vue";

export default defineComponent({
  components: {
    RawResult, Preview, Checkbox, Card, Space, Button, Effect, Back, Save,
  },
  props: {
    images: { type: Array as PropType<Blob[][]>, required: true },
    showTarget: { type: Boolean, required: false },
  },
  emits: [
    "toggleShowTarget",
  ],
  computed: {
    resultImageUrls(): string[][] {
      return this.images.map((row) => row.map((cell) => URL.createObjectURL(cell)));
    },
  },
  data() {
    return {
      previewMode: false,
    };
  },
  methods: {
    onDownload(): void {
      const download = prepareDownloadFile(this.images);
      download.then((res) => saveAs(res, `megamoji.${extension(res)}`));
      Analytics && Analytics.download();
    },
  },
});
</script>

<template>
  <Card class="result" title="プレビュー">
    <Space vertical large>
      <RawResult v-if="!previewMode" :images="resultImageUrls" />
      <Preview v-if="previewMode" :images="resultImageUrls" :dark-mode="false" />
      <Preview v-if="previewMode" :images="resultImageUrls" :dark-mode="true" />
      <Checkbox v-model="previewMode">
        {{ "サンプル表示" }}
      </Checkbox>
      <Space class="buttons">
        <Button v-if="showTarget" @click="$emit('toggleShowTarget', $event)">
          <template #icon>
            <Back />
          </template>
          もどる
        </Button>
        <Button v-else @click="$emit('toggleShowTarget', $event)">
          <template #icon>
            <Effect />
          </template>
          効果をつける
        </Button>
        <Button type="primary" @click="onDownload">
          <template #icon>
            <Save />
          </template>
          絵文字を保存
        </Button>
      </Space>
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
