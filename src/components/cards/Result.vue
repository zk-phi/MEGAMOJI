<script lang="ts">
import { defineComponent, PropType } from "vue";
import { saveAs } from "file-saver";
import filenamify from "filenamify/browser";
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
    name: { type: String, default: null },
    showTarget: { type: Boolean, required: false },
  },
  emits: [
    "toggleShowTarget",
  ],
  data() {
    return {
      previewMode: false,
    };
  },
  computed: {
    resultImageUrls(): string[][] {
      return this.images.map((row) => row.map((cell) => URL.createObjectURL(cell)));
    },
  },
  methods: {
    onDownload(): void {
      const download = prepareDownloadFile(this.images);
      const filename = filenamify(this.name ?? "", { replacement: "" }) || "megamoji";
      download.then((res) => saveAs(res, `${filename}.${extension(res)}`));
      Analytics.download();
    },
  },
});
</script>

<template>
  <Space vertical large>
    <Card class="result" title="プレビュー">
      <Space vertical large>
        <RawResult v-if="!previewMode" :images="resultImageUrls" />
        <Preview v-if="previewMode" :images="resultImageUrls" :dark-mode="false" />
        <Preview v-if="previewMode" :images="resultImageUrls" :dark-mode="true" />
        <Checkbox v-model="previewMode" name="サンプル表示">
          {{ "サンプル表示" }}
        </Checkbox>
      </Space>
    </Card>
    <Space class="buttons">
      <Button
          v-if="showTarget"
          name="効果をつける(戻る)"
          @click="$emit('toggleShowTarget', $event)">
        <template #icon>
          <Back />
        </template>
        もどる
      </Button>
      <Button
          v-else
          name="効果をつける"
          @click="$emit('toggleShowTarget', $event)">
        <template #icon>
          <Effect />
        </template>
        効果をつける
      </Button>
      <Button type="primary" name="保存" @click="onDownload">
        <template #icon>
          <Save />
        </template>
        絵文字を保存
      </Button>
    </Space>
  </Space>
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
