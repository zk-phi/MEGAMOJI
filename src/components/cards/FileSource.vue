<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NFormItem } from "naive-ui";
import FileSelect from "../inputs/FileSelect.vue";
import Select from "../inputs/Select.vue";
import Image from "../icons/Image.vue";
import { urlToImg } from "../../utils/canvas";
import { Filter } from "../../types";
import filters from "../../constants/filters";

type FilterOption = { label: string, value: Filter };

export default defineComponent({
  components: {
    FileSelect, Select, Image, NCard, NFormItem,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      FILTER_OPTIONS: filters,
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
          urlToImg(this.conf.filter.value(this.conf.img), (filteredImg) => {
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
    <NFormItem label="ファイル">
      <FileSelect @load="conf.img = $event">
        <Image /> ファイルを選ぶ
      </FileSelect>
    </NFormItem>
    <NFormItem label="前処理">
      <Select v-model="conf.filter" block nullable :options="FILTER_OPTIONS" />
    </NFormItem>
  </NCard>
</template>
