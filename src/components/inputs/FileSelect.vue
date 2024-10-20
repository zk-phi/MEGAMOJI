<script lang="ts">
import { defineComponent } from "vue";
import { urlToImg } from "../../utils/canvas";
import { loadFileAsBlobURL, loadFileAsArrayBuffer } from "../../utils/file";
import Button from "./Button.vue";
import File from "../icons/File.vue";

let customFontId = 0;

export default defineComponent({
  components: {
    Button, File,
  },
  props: {
    label: { type: String, default: undefined },
    type: { type: String, required: true },
    name: { type: String, default: "" },
  },
  emits: [
    "load",
  ],
  data() {
    return {
      file: null as File | null,
    };
  },
  computed: {
    accept(): (string | null) {
      if (this.type === "img") {
        return "image/*";
      } else if (this.type === "font") {
        return "font/otf,font/ttf,font/woff";
      } else {
        return null;
      }
    },
  },
  methods: {
    onClick(): void {
      (this.$refs.input as HTMLInputElement).click();
    },
    onChange(e: { target: { files: FileList, value: string } }): void {
      if (e.target.files[0]) {
        this.file = e.target.files[0];
        if (this.type === "img") {
          loadFileAsBlobURL(this.file).then((blobUrl) => {
            urlToImg(blobUrl, (img) => {
              if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
                this.$emit("load", img);
              }
            });
          });
        } else if (this.type === "font") {
          loadFileAsArrayBuffer(this.file).then((buffer) => {
            this.$emit("load", new FontFace(`custom-font-${customFontId}`, buffer));
            customFontId += 1;
          });
        }
      }
      e.target.value = "";
    },
  },
});
</script>

<template>
  <input ref="input" type="file" style="display: none;" :accept="accept" @change="onChange">
  <Button type="dashed" :name="name" @click="onClick">
    <slot />
  </Button>
  {{ " " }}
  <span v-if="file" class="file">
    <File /> {{ file.name }}
  </span>
</template>

<style scoped>
.file {
  margin-top: var(--spacingMedium);
  font-size: var(--fontSizeMedium);
  color: var(--fg);
  user-select: none;
}
</style>
