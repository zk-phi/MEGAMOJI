<script lang="ts">
import { defineComponent } from "vue";
import ToggleButton from "../inputs/ToggleButton.vue";
import TabButton from "../inputs/TabButton.vue";
import Fieldset from "../inputs/Fieldset.vue";
import TabGroup from "../inputs/TabGroup.vue";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import { mergeImages } from "../../utils/canvas";
import * as parts from "../../constants/parts";
import { EMOJI_SIZE } from "../../constants/emoji";
import empty from "../../parts/void.svg";

export default defineComponent({
  components: {
    ToggleButton, TabButton, TabGroup, Fieldset, Card, Space,
  },
  props: {
    show: { type: Boolean, required: true },
    emojiSize: { type: Number, default: null },
  },
  emits: [
    "render",
  ],
  data() {
    return {
      parts,
      tab: "base",
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
      const emojiSize = this.emojiSize || EMOJI_SIZE;
      mergeImages(emojiSize, emojiSize, [
        this.conf.base,
        this.conf.textures,
        this.conf.mouths,
        this.conf.eyes,
        this.conf.others,
      ]).then((img) => {
        this.$emit("render", img);
      });
    },
  },
});
</script>

<template>
  <Card v-if="show">
    <Fieldset label="パーツ">
      <Space vertical large>
        <TabGroup>
          <TabButton
              v-for="category in parts.categories"
              :key="category.value"
              v-model="tab"
              :value="category.value">
            {{ category.label }}
          </TabButton>
        </TabGroup>
        <Space small>
          <ToggleButton
              v-for="p in parts[tab]"
              :key="p"
              v-model="conf[tab]"
              size="part"
              :value="p">
            <img class="img" :src="p">
          </ToggleButton>
        </Space>
      </Space>
    </Fieldset>
  </Card>
</template>

<style scoped>
.img {
  height: 1em;
  background-color: #fff;
}
</style>
