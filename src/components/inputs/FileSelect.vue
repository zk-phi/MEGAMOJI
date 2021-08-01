<script lang="ts">
import { defineComponent } from "vue";
import { NUpload } from "naive-ui";
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";
import Button from "./Button.vue";

export default defineComponent({
  components: {
    NUpload, Button,
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
  <NUpload
      :file-list="fileList"
      :multiple="false"
      :show-cancel-button="false"
      @update:file-list="onChange">
    <Button type="dashed">
      <slot />
    </Button>
  </NUpload>
</template>
