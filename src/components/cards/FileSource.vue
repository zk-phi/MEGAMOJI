<script lang="ts">
import { NCard } from "naive-ui";
import FileBlock from "../formblocks/FileBlock.vue";
import FilterSelectBlock from "../formblocks/FilterSelectBlock.vue";
import { urlToImg } from "../../utils/canvas";

export default {
  components: {
    FileBlock, FilterSelectBlock, NCard,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data: (): Record<string, unknown> => ({
    conf: {
      img: null,
      filter: null,
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
      if (this.conf.img) {
        if (this.conf.filter) {
          urlToImg(this.conf.filter.fn(this.conf.img), (filteredImg) => {
            this.$emit("render", filteredImg);
          });
        } else {
          this.$emit("render", this.conf.img);
        }
      }
    },
  },
};
</script>

<template>
  <NCard v-if="show">
    <FileBlock label="ファイル" @load="conf.img = $event" />
    <FilterSelectBlock v-model="conf.filter" />
  </NCard>
</template>
