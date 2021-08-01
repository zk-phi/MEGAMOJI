<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NUpload } from "naive-ui";
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";
import Button from "../inputs/Button.vue";
import Image from "../icons/Image.vue";

export default defineComponent({
  components: {
    NFormItem, NUpload, Button, Image,
  },
  props: {
    label: { type: String, default: undefined },
  },
  emits: [
    "load",
  ],
  data() {
    return {
      fileList: [] as { file: File }[],
    };
  },
  methods: {
    onChange(files: { file: File }[]): void {
      if (files[0]) {
        this.fileList = [files[files.length - 1]];
        loadFileAsBlobURL(files[files.length - 1].file).then((blobUrl) => {
          urlToImg(blobUrl, (img) => this.$emit("load", img));
        });
      }
    },
  },
});
</script>

<template>
  <NFormItem :label="label">
    <NUpload
        :file-list="fileList"
        :multiple="false"
        :show-cancel-button="false"
        @update:file-list="onChange">
      <Button type="dashed">
        <Image /> ファイルを選ぶ
      </Button>
    </NUpload>
  </NFormItem>
</template>
