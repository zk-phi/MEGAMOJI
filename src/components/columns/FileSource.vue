<script lang="ts">
import FileBlock from "../formblocks/FileBlock.vue";
import FilterSelectBlock from "../formblocks/FilterSelectBlock.vue";
import { urlToImg } from "../../utils/canvas";

export default {
  components: {
    FileBlock, FilterSelectBlock,
  },
  props: {
    show: { type: Boolean, required: true },
  },
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
    }
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
    }
  },
  emits: [
    "render",
  ],
};
</script>

<template>
  <div v-if="show" class="column">
    <div class="card">
      <div class="card-content">
        <FileBlock label="ファイル" @load="conf.img = $event" />
        <FilterSelectBlock v-model="conf.filter" />
      </div>
    </div>
  </div>
</template>
