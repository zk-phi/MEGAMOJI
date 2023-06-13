<script lang="ts">
import { defineComponent } from "vue";
import Card from "../global/Card.vue";
import FileSelect from "../inputs/FileSelect.vue";
import Select from "../inputs/Select.vue";
import Fieldset from "../inputs/Fieldset.vue";
import Space from "../global/Space.vue";
import Image from "../icons/Image.vue";
import { urlToImg } from "../../utils/canvas";
import { Filter } from "../../types";
import filters from "../../constants/filters";

type FilterOption = { label: string, value: Filter };

export default defineComponent({
  components: {
    FileSelect, Select, Image, Card, Fieldset, Space,
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
          this.$emit("render", this.conf.filter.value(this.conf.img));
        } else {
          this.$emit("render", this.conf.img);
        }
      }
    },
  },
});
</script>

<template>
  <Card v-if="show">
    <Space vertical xlarge full>
      <Fieldset label="ファイル">
        <FileSelect type="img" @load="conf.img = $event">
          <Image /> ファイルを選ぶ
        </FileSelect>
      </Fieldset>
      <Fieldset label="前処理">
        <Select v-model="conf.filter" nullable :options="FILTER_OPTIONS" />
      </Fieldset>
    </Space>
  </Card>
</template>
