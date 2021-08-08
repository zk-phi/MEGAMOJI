<script lang="ts">
import { defineComponent } from "vue";
import { NThing, NAvatar } from "naive-ui";
import Space from "../global/Space.vue";
import Card from "../global/Card.vue";
import Button from "../inputs/Button.vue";
import textSample from "../../samples/text.png";
import imageSample from "../../samples/image.png";
import fukumojiSample from "../../samples/fukumoji.png";

export default defineComponent({
  components: {
    Card, NThing, Space, NAvatar, Button,
  },
  data() {
    return {
      textSample,
      imageSample,
      fukumojiSample,
    };
  },
  methods: {
    openLicense() {
      window.open("https://github.com/zk-phi/MEGAMOJI/blob/master/LICENSE.markdown");
    },
  },
});
</script>

<template>
  <Card title="使い方">
    <Space vertical>
      <NThing>
        <template #avatar>
          <NAvatar :src="textSample" />
        </template>
        <template #header>
          テキスト絵文字
        </template>
        <template #description>
          文字からスタンプを作ります。「テキスト」欄になにか入力してみてください。
        </template>
      </NThing>
      <NThing>
        <template #avatar>
          <NAvatar :src="imageSample" />
        </template>
        <template #header>
          画像絵文字
        </template>
        <template #description>
          好きな画像を正方形にトリミングしてスタンプにします。
        </template>
      </NThing>
      <NThing>
        <template #avatar>
          <NAvatar :src="fukumojiSample" />
        </template>
        <template #header>
          キメラ絵文字
        </template>
        <template #description>
          既存の絵文字を合成してスタンプを作ります。
        </template>
      </NThing>
      <Button type="text" @click="openLicense">
        ライセンス表示
      </Button>
    </Space>
  </Card>
</template>
