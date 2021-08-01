<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NTabs, NTabPane, NSpace } from "naive-ui";
import ToggleButton from "../inputs/ToggleButton.vue";
import { EMOJI_SIZE } from "../../constants/emoji";
import { mergeImages, urlToImg } from "../../utils/canvas";
import * as parts from "../../constants/parts";
import empty from "../../parts/void.svg";

export default defineComponent({
  components: {
    ToggleButton, NCard, NTabs, NTabPane, NSpace,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      parts,
      tab: "ベース",
      conf: {
        base: empty,
        textures: empty,
        eyes: empty,
        mouths: empty,
        others: empty,
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
});
</script>

<template>
  <NCard v-if="show">
    <NTabs v-model:value="tab" type="card">
      <NTabPane
          v-for="category in parts.categories"
          :key="category.label"
          :name="category.label">
        <NSpace>
          <ToggleButton
              v-for="p in parts[category.value]"
              :key="p"
              v-model="conf[category.value]"
              size="part"
              :value="p">
            <img class="img" :src="p">
          </ToggleButton>
        </NSpace>
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped>
.img {
  height: 1em;
}
</style>
