<script lang="ts">
import { defineComponent } from "vue";
import { urlToImg, loadFileAsBlobURL } from "../../utils/canvas";
import Button from "./Button.vue";
import File from "../icons/File.vue";

export default defineComponent({
  components: {
    Button, File,
  },
  props: {
    label: { type: String, default: undefined },
  },
  emits: [
    "load",
  ],
  data() {
    return {
      file: null,
    };
  },
  methods: {
    onClick(): void {
      this.$refs.input.click();
    },
    onChange(e: Event): void {
      if (e.target.files[0]) {
        this.file = e.target.files[0];
        loadFileAsBlobURL(this.file).then((blobUrl) => {
          urlToImg(blobUrl, (img) => this.$emit("load", img));
        });
      }
    },
  },
});
</script>

<template>
  <input ref="input" type="file" style="display: none;" @change="onChange" />
  <Button type="dashed" @click="onClick">
    <slot />
  </Button>
  <div v-if="file" class="file">
    <File /> {{ file.name }}
  </div>
</template>

<style scoped>
.file {
  margin-top: var(--marginSmall);
  font-size: var(--fontSizeMedium);
  color: var(--fg);
  user-select: none;
}
</style>
