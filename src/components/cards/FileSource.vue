<script lang="ts">
import { defineComponent } from "vue";
import { NCard } from "naive-ui";
import FileBlock from "../formblocks/FileBlock.vue";
import FilterSelectBlock from "../formblocks/FilterSelectBlock.vue";
import { urlToImg } from "../../utils/canvas";
import { Filter } from "../../types";

type FilterOption = { label: string, fn: Filter };

export default defineComponent({
  components: {
    FileBlock, FilterSelectBlock, NCard,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      conf: {
        img: null as (HTMLImageElement | null),
        filter: null as (FilterOption | null),
      },
    };
  },
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
});
</script>

<template>
  <NCard v-if="show">
    <FileBlock label="ファイル" @load="conf.img = $event" />
    <FilterSelectBlock v-model="conf.filter" />
  </NCard>
</template>
