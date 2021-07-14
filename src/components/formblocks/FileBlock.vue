<script lang="ts">
import { defineComponent } from "vue";
import { NFormItem, NUpload, NButton } from "naive-ui";
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";

export default defineComponent({
  components: {
    NFormItem, NUpload, NButton,
  },
  props: {
    label: { type: String, default: undefined },
  },
  emits: [
    "load",
  ],
  data: (): Record<string, unknown> => ({
    fileList: [],
  }),
  methods: {
    onChange(files: { file: File }[]): void {
      if (files[0]) {
        this.fileList = [files[files.length - 1]];
        loadFileAsBlobURL(files[files.length - 1].file, (blobUrl) => {
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
      <NButton>
        ファイルを選ぶ
      </NButton>
    </NUpload>
  </NFormItem>
</template>
