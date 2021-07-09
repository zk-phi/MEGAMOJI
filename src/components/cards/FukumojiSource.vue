<script lang="ts">
import Tabs from "../navigation/Tabs.vue";
import PartSelect from "../formblocks/PartSelect.vue";
import { EMOJI_SIZE } from "../../constants/emoji";
import { mergeImages, urlToImg } from "../../utils/canvas";
import * as parts from "../../constants/parts";

export default {
  components: {
    Tabs, PartSelect,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data: (): Record<string, unknown> => ({
    parts,
    tab: "base",
    conf: {
      base: "assets/void.svg",
      textures: "assets/void.svg",
      eyes: "assets/void.svg",
      mouths: "assets/void.svg",
      others: "assets/void.svg",
    },
  }),
  watch: {
    conf: {
      handler(): void {
        this.render();
      },
      deep: true,
    },
  },
  methods: {
    render(): void {
      mergeImages(EMOJI_SIZE, EMOJI_SIZE, [
        this.conf.base,
        this.conf.textures,
        this.conf.mouths,
        this.conf.eyes,
        this.conf.others,
      ], (blobUrl) => {
        urlToImg(blobUrl, (img) => this.$emit("render", img));
      });
    },
  },
};
</script>

<template>
  <div v-if="show" class="card">
    <div class="card-content">
      <Tabs v-model="tab" :tabs="parts.categories" />
      <PartSelect
          v-for="category in parts.categories"
          :key="category.value"
          v-model="conf[category.value]"
          :show="tab === category.value"
          :parts="parts[category.value]" />
    </div>
  </div>
</template>
