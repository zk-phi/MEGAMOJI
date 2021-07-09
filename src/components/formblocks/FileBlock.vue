<script lang="ts">
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";

export default {
  props: {
    label: { type: String, default: undefined },
  },
  emits: [
    "load",
  ],
  methods: {
    onChange(e: { target: { files: File[]} }): void {
      if (e.target.files[0]) {
        loadFileAsBlobURL(e.target.files[0], (blobUrl) => {
          urlToImg(blobUrl, (img) => this.$emit("load", img));
        });
      }
    },
  },
};
</script>

<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control">
      <input class="input" type="file" @change="onChange">
    </div>
  </div>
</template>
